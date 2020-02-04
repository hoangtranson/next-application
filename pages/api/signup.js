const bcrypt = require('bcryptjs');
import { User } from '../../models';

// TODO install jwt to generate dynamic token with expire time when user do login
export default async (req, res) => {
    const { username, password } = await req.body;
    try {
        const encryptPassword = await bcrypt.hash(password, 8);
        const user = await new User({ 'username': username, 'password': encryptPassword }).save();
        return res.status(200).json(user);
    } catch (err) {
        return res.status(404).json({ message: "Your username and password are not corrected!" })
    }
}