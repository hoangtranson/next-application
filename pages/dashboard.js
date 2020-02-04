import React from 'react';
import Router from 'next/router';
import fetch from 'isomorphic-unfetch';
import nextCookie from 'next-cookies';
import Layout from '../components/layout.login';
import getHost from '../utils/host.util';
import { withAuthSync } from '../utils/auth.util';

const dashboardPage = props => {
    const { name } = props.data;

    return (
        <Layout>
            <h1>{name}</h1>
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