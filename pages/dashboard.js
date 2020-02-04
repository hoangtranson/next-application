import React from 'react';
import Router from 'next/router';
import fetch from 'isomorphic-unfetch';
import nextCookie from 'next-cookies';
import Layout from '../components/layout.login';
import getHost from '../utils/host.util';
import { withAuthSync } from '../utils/auth.util';

const dashboardPage = props => {
    return (
        <Layout>
            <form className="form-signin text-center">
                <h1 className="h3 mb-3 font-weight-normal">Hi {props.data.username}!</h1>
                <p>Update your profile here</p>
                <label htmlFor="username" className="sr-only">User Name</label>
                <input
                    type="text"
                    id="username"
                    className="form-control"
                    placeholder="User Name"
                />

                <label htmlFor="inputPassword" className="sr-only">Password</label>
                <input
                    type="password"
                    id="inputPassword"
                    className="form-control"
                    placeholder="Password"
                />

                <label htmlFor="avatar" className="sr-only">Avatar</label>
                <input
                    type="file"
                    id="avatar"
                    className="form-control"
                    placeholder="Password"
                />

                <button className="btn btn-lg btn-primary btn-block" type="submit">Update</button>
            </form>
        </Layout>
    )
}

dashboardPage.getInitialProps = async ctx => {
    const { token, username } = nextCookie(ctx);
    const apiUrl = getHost(ctx.req) + '/api/profile';

    const redirectOnError = () =>
        typeof window !== 'undefined'
            ? Router.push('/login')
            : ctx.res.writeHead(302, { Location: '/login' }).end()

    if (!token) {
        return redirectOnError();
    }

    try {
        const response = await fetch(apiUrl, {
            credentials: 'include',
            headers: {
                Authorization: JSON.stringify({ token, username }),
            },
        })

        if (response.ok) {
            const data = await response.json();
            return { data };
        } else {
            return redirectOnError();
        }
    } catch (error) {
        return redirectOnError();
    }
}

export default withAuthSync(dashboardPage);