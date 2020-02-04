import { User } from '../../models';

export default async (req, res) => {
    if (!('authorization' in req.headers)) {
        return res.status(401).send('Authorization header missing.');
    }

    const auth = await req.headers.authorization;
    const { token, username } = JSON.parse(auth);

    if(!token || !username) {
        return res.status(401).send('You are not authorized.');
    }
    
    try {
        const user = await User.where({ 'username': username, 'password': token}).fetch({ require: true });

        if (!user) {
            return res.status(404).json({ message: "Your username is not corrected!" });
        }

        return res.status(200).json(user);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "error" })
    }
}