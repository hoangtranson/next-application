import React, { useState } from 'react';
import Router from 'next/router';
import fetch from 'isomorphic-unfetch';
import nextCookie from 'next-cookies';
import Layout from '../components/layout.login';
import getHost from '../utils/host.util';
import { withAuthSync } from '../utils/auth.util';
import { Message } from '../components/message';
import { STATUS } from '../constants';

const Avatar = props => {
    if (props.link) {
        return (
            <img src={props.link} alt="" className="size-50" />
        )
    }

    return null;
}

const dashboardPage = props => {
    const [userData, setUserData] = useState({
        username: props.data.username,
        avatarLink: `${process.env.UPLOAD_SERVICE_URL}/profile/${props.data.avatar}`,
        avatarId: props.data.avatar,
        form: {
            avatar: '',
            message: {
                status: '',
                text: ''
            }
        }
    });


    const updateMessage = ({ status, text }) => {
        setUserData( prevState => ({
            ...prevState,
            form: {
                message: {
                    status,
                    text
                },
                avatar: ''
            }
        }));
    }

    const handleSubmit = async event => {
        event.preventDefault();

        setUserData(Object.assign({}, userData, { error: '' }));
        const { username, form } = userData;
        const url = `${process.env.UPLOAD_SERVICE_URL}/profile`;
        const formData = new FormData();
        formData.append('file', form.avatar);
        if(userData.avatarId) {
            formData.append('oldAvatar', userData.avatarId);
        }
        
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

                    if (updateProfile.ok) {
                        const response = await updateProfile.json();
                        setUserData( prevState => ({
                            ...prevState,
                            avatarLink: `${process.env.UPLOAD_SERVICE_URL}/profile/${response.avatar}`,
                            avatarId: response.avatar
                        }));
                        updateMessage({ status: STATUS.OK, text: 'Update Successfully!' });
                    }
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
                <Message message={userData.form.message} />
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
                        setUserData( prevState => ({
                            ...prevState,
                            form: {
                                ...prevState.form,
                                avatar: event.target.files[0]
                            }
                        }))
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