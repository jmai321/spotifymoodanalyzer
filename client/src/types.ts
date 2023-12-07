export interface Song {
    id: number;
    spotifyTrackId: string;
    name: string;
    artist: string;
    valence: number;
    playedAt: Date;
    trackImageUrl: string;
    energy: number;
    acousticness: number;
    liveness: number;
    instrumentalness: number;
    danceability: number;
  }