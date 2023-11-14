import { generateRandomString } from './script';

export function redirectToSpotifyAuthService(clientId: string, redirectUri: string, scopes: string[]) {
    const state = generateRandomString(16);
    localStorage.setItem('spotify_auth_state', state);

    const params = new URLSearchParams();
    params.append('response_type', 'code');
    params.append('client_id', clientId);
    params.append('scope', scopes.join(' '));
    params.append('redirect_uri', redirectUri);
    params.append('state', state);

    // Redirect the user to the Spotify authorization page
    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
}
