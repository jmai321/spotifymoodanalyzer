import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'), // Parse DB_PORT as an integer
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false, // Change when done
    logging: false,
    entities: [
       path.join(__dirname, '../dist/entity/**/*.js')
    ],
    migrations: [
       path.join(__dirname, '../dist/migration/**/*.js')
    ],
    subscribers: [
       path.join(__dirname, '../dist/subscriber/**/*.js')
    ],
    ssl: {
        rejectUnauthorized: false, // Change to false since you're using PlanetScale
    },
});

export const initializeDatabase = async () => {
    try {
        await AppDataSource.initialize();
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed', error);
        process.exit(1);
    }
};
