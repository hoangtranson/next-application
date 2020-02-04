const bcrypt = require('bcryptjs');
import { User } from '../../models';

// TODO install jwt to generate dynamic token with expire time when user do login
export default async (req, res) => {
    const { username, password } = await req.body;
    try {
        const user = await User.where({ 'username': username}).fetch({ require: true });

        if (!user) {
            return res.status(404).json({ message: "Your username is not corrected!" });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.attributes.password);

        if (!isPasswordMatch) {
            return res.status(404).json({ message: "Your password is not corrected!" })
        }
        return res.status(200).json(user);
    } catch (err) {
        return res.status(404).json({ message: "Your username and password are not corrected!" })
    }
}