import "reflect-metadata";
import { AppDataSource } from "./ormconfig";
import { Song } from "./entity/Song";
import axios from 'axios';
import express, { Request, Response } from "express";
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URI,
    credentials: true,
}));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
    }
}));

AppDataSource.initialize()
    .then(() => {
        console.log("Database connected successfully");

        app.get('/login', (req: Request, res: Response) => {
            const scope = 'user-read-private user-read-recently-played';
            res.redirect(`https://accounts.spotify.com/authorize?response_type=code&client_id=${process.env.CLIENT_ID}&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI!)}`);
        });

        app.get('/callback', async (req: Request, res: Response) => {
            const code = req.query.code as string | null;
            if (!code) {
                return res.redirect(process.env.FRONTEND_URI + '/login');
            }

            try {
                const response = await axios({
                    method: 'post',
                    url: 'https://accounts.spotify.com/api/token',
                    data: new URLSearchParams({
                        code: code,
                        redirect_uri: process.env.REDIRECT_URI!,
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

        app.get('/user', async (req: Request, res: Response) => {
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

        app.get('/fetch-and-save-songs', async (req: Request, res: Response) => {
            if (!req.session.token) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
        
            try {
                const recentlyPlayedResponse = await axios.get('https://api.spotify.com/v1/me/player/recently-played?limit=50', {
                    headers: { 'Authorization': `Bearer ${req.session.token}` }
                });
                const recentlyPlayed = recentlyPlayedResponse.data.items;
                const songRepository = AppDataSource.getRepository(Song);
        
                for (const item of recentlyPlayed) {
                    const playedAtDate = new Date(item.played_at);
        
                    // Find existing song using exact date comparison
                    const existingSong = await songRepository.createQueryBuilder('song')
                        .where("song.spotifyTrackId = :spotifyTrackId AND DATE(song.playedAt) = DATE(:playedAt)", {
                            spotifyTrackId: item.track.id,
                            playedAt: playedAtDate
                        })
                        .getOne();
        
                    if (existingSong) {
                        console.log(`Song already exists: ${item.track.id}-${item.played_at}`);
                        continue;
                    }
        
                    const audioFeaturesResponse = await axios.get(`https://api.spotify.com/v1/audio-features/${item.track.id}`, {
                        headers: { 'Authorization': `Bearer ${req.session.token}` }
                    });
                    const audioFeatures = audioFeaturesResponse.data;
        
                    if (audioFeatures) {
                        const song = new Song();
                        song.spotifyTrackId = item.track.id;
                        song.name = item.track.name;
                        song.artist = item.track.artists.map((artist: { name: any; }) => artist.name).join(', ');
                        song.valence = audioFeatures.valence;
                        song.playedAt = playedAtDate;
                        song.energy = audioFeatures.energy;
                        song.acousticness = audioFeatures.acousticness;
                        song.liveness = audioFeatures.liveness;
                        song.instrumentalness = audioFeatures.instrumentalness;
                        song.danceability = audioFeatures.danceability;
        
                        // Fetch and save track image URL
                        const trackDetailsResponse = await axios.get(`https://api.spotify.com/v1/tracks/${item.track.id}`, {
                            headers: { 'Authorization': `Bearer ${req.session.token}` }
                        });
                        const trackDetails = trackDetailsResponse.data;
                        if (trackDetails && trackDetails.album && trackDetails.album.images && trackDetails.album.images.length > 0) {
                            song.trackImageUrl = trackDetails.album.images[0].url;
                        }
        
                        await songRepository.save(song);
                    }
                }
                res.send('Songs fetched and saved successfully.');
            } catch (error) {
                console.error('Error fetching and saving songs:', error);
                res.status(500).send('Failed to fetch and save songs.');
            }
        }); 

        app.get('/songs', async (req: Request, res: Response) => {
            try {
                const songRepository = AppDataSource.getRepository(Song);
                const songs = await songRepository.find();
                res.json(songs);
            } catch (error) {
                console.error('Error retrieving songs:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
        
        const PORT = process.env.PORT || 8080;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((error) => {
        console.error("Database connection failed", error);
        process.exit(1);
    });
