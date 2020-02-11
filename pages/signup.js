import React, { useState } from 'react';
import fetch from 'isomorphic-unfetch';
import Layout from '../components/layout';
import { Message } from '../components/message';
import { login } from '../utils/auth.util';
import { userValidationSchema } from '../utils/validation';
import { STATUS } from '../constants';

const signupPage = () => {
    const [userData, setUserData] = useState({ 
        username: '', 
        password: '', 
        message: {
            status: '',
            text: ''
        } 
    });

    const handleSubmit = async event => {
        event.preventDefault();
        setUserData( prevState => ({
            ...prevState,
            message: {
                status: '',
                text: ''
            }
        }));

        const username = userData.username;
        const password = userData.password;
        const url = '/api/signup';

        const validation = userValidationSchema.validate({ username, password });

        if (!validation.error) {
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
        } else {
            setUserData( prevState => ({
                ...prevState,
                message: {
                    status: STATUS.FAIL,
                    text: validation.error.details[0].message
                }
            }));
        }

    }

    return (
        <Layout>
            <form className="form-signin text-center" onSubmit={handleSubmit}>
                <h1 className="h3 mb-3 font-weight-normal">Please sign up</h1>
                <Message message={userData.message} />
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

                <button className="btn btn-lg btn-primary btn-block" type="submit">Sign up</button>
            </form>
        </Layout>
    )
}

export default signupPage;