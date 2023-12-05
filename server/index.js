const express = require('express');
const axios = require('axios');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URI,
    credentials: true,
}));
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
    }
}));

app.get('/login', (req, res) => {
    const scope = 'user-read-private';
    res.redirect(`https://accounts.spotify.com/authorize?response_type=code&client_id=${process.env.CLIENT_ID}&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}`);
});

app.get('/callback', async (req, res) => {
    const code = req.query.code || null;
    try {
        const response = await axios({
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            data: new URLSearchParams({
                code: code,
                redirect_uri: process.env.REDIRECT_URI,
                grant_type: 'authorization_code'
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + (Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64'))
            }
        });

        if (response.data.access_token) {
            req.session.token = response.data.access_token;
            res.redirect(process.env.FRONTEND_URI + '/profile-page');
        } else {
            res.redirect(process.env.FRONTEND_URI + '/login');
        }
    } catch (error) {
        console.error('Error during callback processing:', error);
        res.redirect(process.env.FRONTEND_URI + '/login');
    }
});

app.get('/user', async (req, res) => {
    if (!req.session.token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const response = await axios.get('https://api.spotify.com/v1/me', {
            headers: { Authorization: `Bearer ${req.session.token}` }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


