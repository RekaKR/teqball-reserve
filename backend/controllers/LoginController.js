var jwt = require('jsonwebtoken');
const secret = 'supersecret'
const AuthEntityService = require("../services/AuthEntityService");
const fetch = require('node-fetch')
const jwt_decode = require("jwt-decode");


async function checkingLogin(req, res) {
    const code = req.body.code

    const fetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:
            new URLSearchParams({
                'code': code,
                'client_id': '645622545318-54bkra0rued7ajsn83sj3rdh0nik2fk9.apps.googleusercontent.com',
                'client_secret': 'Kg3RyJ3wWM3Vj6qAhbEROwkF',
                'redirect_uri': 'http://localhost:3000/login',
                'grant_type': 'authorization_code'
            })
    }
    fetch("https://oauth2.googleapis.com/token", fetchOptions)
        .then(res => res.json())
        .then(token => checkingUser(token, res))
        .catch(error => res.status(404).json({
            msg: 'Authentication failed!',
        }))

}

async function checkingUser(data, res) {

    const { name, email, sub } = jwt_decode(data.id_token)

    const foundUser = await AuthEntityService.getUser({ googleId: sub })
    if (!foundUser) {
        const newUser = {
            name: name,
            email: email,
            googleId: sub, 
            role: "user"
        }
        await AuthEntityService.insertUser(newUser)
    }
    jwt.sign({
        "google": sub,
        "name": name,
        "email": email, 
        "role": "user"
    }, secret, { expiresIn: '1h' },
        function (err, token) {
            res.json({ token: token })
        });
}



exports.checkingLogin = checkingLogin;
exports.secret = secret;

