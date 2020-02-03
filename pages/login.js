import React, { useState } from 'react';
import fetch from 'isomorphic-unfetch';
import Layout from '../components/layout';
import { login } from '../utils/auth.util';

const Login = () => {
    const [userData, setUserData] = useState({ username: '', error: '' });

    const handleSubmit = async event => {
        event.preventDefault();
        setUserData(Object.assign({}, userData, { error: '' }));

        const username = userData.username;
        const url = '/api/login';

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username }),
            })
            if (response.status === 200) {
                const { token } = await response.json();
                await login({ token });
            } else {
                console.log('Login failed.');
                let error = new Error(response.statusText);
                error.response = response;
                throw error;
            }
        } catch (error) {
            console.error(
                'You have an error in your code or there are Network issues.',
                error
            );

            const { response } = error;
            setUserData(
                Object.assign({}, userData, {
                    error: response ? response.statusText : error.message,
                })
            )
        }
    }

    return (
        <Layout>
            <form className="form-signin text-center">
                <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
                <label for="inputEmail" className="sr-only">Email address</label>
                <input type="email" id="inputEmail" className="form-control" placeholder="Email address" required="" autofocus="" />
                <label for="inputPassword" className="sr-only">Password</label>
                <input type="password" id="inputPassword" className="form-control" placeholder="Password" required="" />
                <div className="checkbox mb-3">
                </div>
                <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
            </form>
        </Layout>
    )
}

export default Login