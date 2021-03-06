# Demo Application 

## Requirements

1. Features:

    - User Login
    - Dashboard
    - Upload Document

2. Tech Stacks:

    - React.js as a view library
    - Next.js for server side rendering
    - GraphQL as the query language
    - Apollo as client/server implementation of GraphQL
    - PostgreSQL for storing data
    - MongoDB for document and file storage
    - Bookshelf as node ORM for PostgreSQL
    - Joi for validation

    - unfetch - https://github.com/developit/unfetch#readme

## DataBase

1. Start server: `pg_ctl restart -D  "D:\Subin\database\data"`
2. Fixed issue: password authentication failed for user “postgres”

- go to `main/pg_hba.conf`
- Change all authentication methods to `trust`
- restart server
- run: `psql -h localhost -U postgres`

3. Notes

- `\list` or `\l`: list all databases
- `\dt`: list all tables in the current database
- `\connect database_name`: To switch databases

## Start Project

1. Clone project and npm install
1. start postgresql `pg_ctl restart -D  "D:\Subin\database\data"`
2. run `npm run dev` to start localhost and signup new user
3. start mongodb for store file
4. clone uploadService from https://github.com/hoangtranson/uploadService and npm install
5. run `npm run start` to start upload service

## DEMO

![login sample next app][login]

[login]: /demo/login.png