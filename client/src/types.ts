export interface Song {
    id: number;
    spotifyTrackId: string;
    name: string;
    artist: string;
    valence: number;
    playedAt: Date;
    trackImageUrl: string;
  }