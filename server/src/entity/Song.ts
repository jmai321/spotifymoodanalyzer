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
}
