import { useEffect } from 'react';
import Router from 'next/router';
import nextCookie from 'next-cookies';
import cookie from 'js-cookie';

export const login = ({ token, username }) => {
    cookie.set('token', token, { expires: 1 });
    cookie.set('username', username, { expires: 1 });
    Router.push('/dashboard');
}

export const auth = ctx => {
    const { token, username } = nextCookie(ctx);
    if (!token) {
        if (typeof window === 'undefined') {
            ctx.res.writeHead(302, { Location: '/login' });
            ctx.res.end();
        } else {
            Router.push('/login');
        }
    }

    return { token, username }
}

export const logout = () => {
    cookie.remove('token');
    cookie.remove('token');
    Router.push('/login');
}

export const withAuthSync = WrappedComponent => {
    const Wrapper = props => {
        return <WrappedComponent {...props} />;
    }

    Wrapper.getInitialProps = async ctx => {
        const _auth = auth(ctx);
        const componentProps =
            WrappedComponent.getInitialProps &&
            (await WrappedComponent.getInitialProps(ctx))

        return { ...componentProps, authentication: _auth };
    }

    return Wrapper;
}