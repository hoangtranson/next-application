const bcrypt = require('bcryptjs');
const graphQL = require('graphql');
const graphQLBookshelf = require('graphql-bookshelfjs');
// import { User } from '../../models';
const models = require('../../models');
const graphQLSchema = require('../../grahpql')(models);


// TODO install jwt to generate dynamic token with expire time when user do login
export default async (req, res) => {
    const { username, password } = await req.body;
    try {
        const queryString = `{ 
            user (username: "${username}") {
                username,
                password,
                avatar
            } 
        }`;
        const result = await graphQL.graphql(graphQLSchema, queryString, null, { loaders: graphQLBookshelf.getLoaders() });
        
        if(result.data && result.data.user) {
            const user =  result.data.user; 

            const isPasswordMatch = await bcrypt.compare(password, user.password);

            if (!isPasswordMatch) {
                return res.status(404).json({ message: "Your password is not corrected!" })
            }
            return res.status(200).json(user);

        } else {
            return res.status(404).json({ message: "Your username is not corrected!" });
        }
    } catch (err) {
        return res.status(404).json({ message: "Your username and password are not corrected!" })
    }
}