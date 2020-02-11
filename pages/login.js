import React, { useState } from 'react';
import Link from 'next/link';
import fetch from 'isomorphic-unfetch';
import Layout from '../components/layout';
import { login } from '../utils/auth.util';

const loginPage = () => {
    const [userData, setUserData] = useState({ username: '', password: '', error: '' });

    const handleSubmit = async event => {
        event.preventDefault();
        setUserData(Object.assign({}, userData, { error: '' }));

        const username = userData.username;
        const password = userData.password;
        const url = '/api/login';

        if (username && password) {
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                })
                if (response.status === 200) {
                    const { username, password } = await response.json();
                    await login({ token: password, username });
                } else {
                    let error = new Error(response.statusText);
                    error.response = response;
                    throw error;
                }
            } catch (error) {
                console.error(
                    'You have an error in your code or there are Network issues.',
                    error
                );
            }
        }

    }

    return (
        <Layout>
            <form className="form-signin text-center" onSubmit={handleSubmit}>
                <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
                <label htmlFor="username" className="sr-only">User Name</label>
                <input
                    type="text"
                    id="username"
                    className="form-control"
                    placeholder="User Name"
                    value={userData.username}
                    onChange={event =>
                        setUserData(
                            Object.assign({}, userData, { username: event.target.value })
                        )
                    }
                />

                <label htmlFor="inputPassword" className="sr-only">Password</label>
                <input
                    type="password"
                    id="inputPassword"
                    className="form-control"
                    placeholder="Password"
                    value={userData.password}
                    onChange={event =>
                        setUserData(
                            Object.assign({}, userData, { password: event.target.value })
                        )
                    }
                />
                <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
                <Link href="/signup">
                    <a>Signup new account?</a>
                </Link>
            </form>
        </Layout>
    )
}

export default loginPage