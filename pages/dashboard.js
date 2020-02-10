import React, { useState } from 'react';
import Router from 'next/router';
import fetch from 'isomorphic-unfetch';
import nextCookie from 'next-cookies';
import Layout from '../components/layout.login';
import getHost from '../utils/host.util';
import { withAuthSync } from '../utils/auth.util';

import { STATUS } from '../constants';

const Message = props => {
    if (props.message.status === STATUS.FAIL) {
        return (
            <div className="alert alert-danger" role="alert">
                {props.message.text}
            </div>
        )
    }

    if (props.message.status === STATUS.OK) {
        return (
            <div className="alert alert-success" role="alert">
                {props.message.text}
            </div>
        )
    }

    return null;
}

const Avatar = props => {
    if (props.link) {
        return (
            <img src={props.link} alt="" className="size-50" />
        )
    }

    return null;
}

const dashboardPage = props => {
    console.log('dashboardPage => ', props);
    const [userData, setUserData] = useState({
        username: props.data.username,
        avatarLink: `http://localhost:3001/profile/${props.data.avatar}`,
        avatar: '',
        message: {
            status: '',
            text: ''
        }
    });


    const updateMessage = ({ status, text }) => {
        setUserData(
            Object.assign({}, userData, {
                message: {
                    status,
                    text
                },
                avatar: ''
            })
        )
    }

    const updateAvtLink = ({ id }) => {
        setUserData(
            Object.assign({}, userData, {
                avatarLink: `http://localhost:3001/profile/${id}`
            })
        )
        console.log('userData => ', userData);
    }

    const handleSubmit = async event => {
        event.preventDefault();

        setUserData(Object.assign({}, userData, { error: '' }));
        const { username, avatar } = userData;
        const url = 'http://localhost:3001/profile';
        const formData = new FormData();
        formData.append('file', avatar);

        if (avatar) {
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    const _res = await response.json();
                    const updateProfile = await fetch('/api/profile', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': JSON.stringify({ token: props.authentication.token, username: props.authentication.username })
                        },
                        body: JSON.stringify({ avatarId: _res.id })
                    });
                    updateAvtLink(_res);
                    updateMessage({ status: STATUS.OK, text: 'Update Successfully!' });
                } else {
                    updateMessage({ status: STATUS.FAIL, text: 'Update Failed!' });
                }
            } catch (error) {
                updateMessage({ status: STATUS.FAIL, text: 'You have an error in your code or there are Network issues.' });
            }
        }
    }

    return (
        <Layout>
            <form className="form-signin text-center" onSubmit={handleSubmit}>
                <h1 className="h3 mb-3 font-weight-normal">Hi {props.data.username}!</h1>
                <Avatar link={userData.avatarLink} />
                <hr />
                <p>Update your profile here</p>
                <Message message={userData.message} />
                <label htmlFor="username" className="sr-only">User Name</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    className="form-control"
                    placeholder="User Name"
                    value={userData.username}
                    disabled
                />

                <label htmlFor="avatar" className="sr-only">Avatar</label>
                <input
                    type="file"
                    id="avatar"
                    name="avatar"
                    className="form-control"
                    onChange={event =>
                        setUserData(
                            Object.assign({}, userData, { avatar: event.target.files[0] })
                        )
                    }
                />

                <button className="btn btn-lg btn-primary btn-block" type="submit">Update</button>
            </form>
        </Layout>
    )
}

dashboardPage.getInitialProps = async ctx => {

    const { token, username } = nextCookie(ctx);
    const apiUrl = getHost(ctx.req) + '/api/profile';

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                Authorization: JSON.stringify({ token, username })
            }
        });

        if (response.ok) {
            const data = await response.json();
            return { data };
        } else {
            // fixed issue: You should only use "next/router" inside the client side of your app
            return ctx.res.writeHead(302, { Location: '/login' }).end();
        }
    } catch (error) {
        // fixed issue: You should only use "next/router" inside the client side of your app
        return ctx.res.writeHead(302, { Location: '/login' }).end();
    }
}

export default withAuthSync(dashboardPage);