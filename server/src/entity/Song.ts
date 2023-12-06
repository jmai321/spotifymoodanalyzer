import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Song {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    spotifyTrackId: string;

    @Column()
    name: string; // Ensure this property is defined

    @Column()
    artist: string; // Ensure this property is defined

    @Column({ type: 'float' })
    valence: number;

    @Column({ type: 'timestamp' })
    playedAt: Date;
}
