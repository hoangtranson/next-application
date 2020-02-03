import React from 'react';
import Head from 'next/head';
import Header from './header';

const Layout = props => (
    <>
        <Head>
            <title>next-application</title>
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossOrigin="anonymous" />
            <link rel="stylesheet" href="css/main.css" />
        </Head>

        <Header />

        <main>
            <div className="container">{props.children}</div>
        </main>
    </>
)

export default Layout;