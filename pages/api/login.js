import fetch from 'isomorphic-unfetch';
import { User } from '../../models';

const _TOKEN = "ZnN5cWhQR2JBRzBTR3pselljQlQ3QVZzc1Fqcm1RSHY6ZHZJY3RHclNoTXFJQXVDbw";

// TODO install jwt and bscryptjs to generate dynamic token with expire time when user do login
export default async (req, res) => {
    const { username, password } = await req.body;
    try {
        const user = await User.where({ 'username': username, 'password': password }).fetch({ require: true });
        return res.status(200).json({user, token: _TOKEN});
    } catch (err) {
        return res.status(404).json({ message: "Your username and password are not corrected!" })
    }
}