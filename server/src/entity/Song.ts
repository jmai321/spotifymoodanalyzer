import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Song {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    spotifyTrackId: string;

    @Column()
    name: string;

    @Column()
    artist: string;

    @Column({ type: 'float' })
    valence: number;

    @Column({ type: 'timestamp' })
    playedAt: Date;

    @Column()
    trackImageUrl: string;

    @Column({ type: 'float' })
    energy: number;

    @Column({ type: 'float' })
    acousticness: number;

    @Column({ type: 'float' })
    liveness: number;

    @Column({ type: 'float' })
    instrumentalness: number;

    @Column({ type: 'float' })
    danceability: number;

}
