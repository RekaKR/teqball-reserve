var jwt = require('jsonwebtoken');
const secret = 'supersecret'
const AuthEntityService = require("../services/AuthEntityService");
const fetch = require('node-fetch')
const jwt_decode = require("jwt-decode");
const { google } = require('googleapis');

const SCOPES = [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
    "openid",
];

const oAuth2Client = new google.auth.OAuth2(
    "645622545318-54bkra0rued7ajsn83sj3rdh0nik2fk9.apps.googleusercontent.com", "Kg3RyJ3wWM3Vj6qAhbEROwkF", 'http://localhost:3000/login'
);

async function googleSetup(req, res) {

    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        prompt: "select_account"
    });

    res.send({ url: authUrl })
}

async function checkingLogin(req, res) {
    const code = req.body.code

    oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);

        oAuth2Client.setCredentials({ refresh_token: token.refresh_token });

        checkingUser(token, res)
    });

}

async function checkingUser(token, res) {

    const { name, email, sub, picture } = jwt_decode(token.id_token)

    const foundUser = await AuthEntityService.getUser({ googleId: sub })
    if (!foundUser) {
        const newUser = {
            name: name,
            email: email,
            googleId: sub,
            groups: [],
            picture: picture
        }
        await AuthEntityService.insertUser(newUser)
    }
    jwt.sign({
        "google": sub,
        "name": name,
        "email": email,
        "picture": picture,
        "refresh_token": token.refresh_token
    }, secret, { expiresIn: '1h' },
        function (err, token) {
            res.json({ token: token })
        });
}



exports.googleSetup = googleSetup;
exports.checkingLogin = checkingLogin;
exports.secret = secret;

