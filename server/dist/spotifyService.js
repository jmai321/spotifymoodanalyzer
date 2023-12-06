"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAudioFeatures = exports.fetchRecentlyPlayed = void 0;
const axios_1 = __importDefault(require("axios"));
async function fetchRecentlyPlayed(accessToken) {
    try {
        const response = await axios_1.default.get('https://api.spotify.com/v1/me/player/recently-played', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        return response.data.items; // Array of recently played tracks
    }
    catch (error) {
        console.error('Error fetching recently played songs:', error);
        return [];
    }
}
exports.fetchRecentlyPlayed = fetchRecentlyPlayed;
async function fetchAudioFeatures(trackId, accessToken) {
    try {
        const response = await axios_1.default.get(`https://api.spotify.com/v1/audio-features/${trackId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        return response.data; // Audio features of the track
    }
    catch (error) {
        console.error('Error fetching audio features:', error);
        return null;
    }
}
exports.fetchAudioFeatures = fetchAudioFeatures;
