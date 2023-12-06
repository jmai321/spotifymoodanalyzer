"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'), // Parse DB_PORT as an integer
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false, // Change when done
    logging: false,
    entities: [
        path_1.default.join(__dirname, '../dist/entity/**/*.js')
    ],
    migrations: [
        path_1.default.join(__dirname, '../dist/migration/**/*.js')
    ],
    subscribers: [
        path_1.default.join(__dirname, '../dist/subscriber/**/*.js')
    ],
    ssl: {
        rejectUnauthorized: false, // Change to false since you're using PlanetScale
    },
});
const initializeDatabase = async () => {
    try {
        await exports.AppDataSource.initialize();
        console.log('Database connected successfully');
    }
    catch (error) {
        console.error('Database connection failed', error);
        process.exit(1);
    }
};
exports.initializeDatabase = initializeDatabase;
