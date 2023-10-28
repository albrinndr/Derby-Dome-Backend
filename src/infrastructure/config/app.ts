import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import cors from 'cors';

import userRoutes from '../routes/userRoutes';
import clubRoutes from '../routes/clubRoutes';
import adminRoutes from '../routes/adminRoutes';
import path from 'path';

export const createServer = () => {
    try {
        const app = express();

        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));
        app.use(express.static(path.join(__dirname, '../public')));
        app.use(cookieParser());
        app.use(cors({origin: process.env.CORS_URL,credentials: true,}));

        app.use('/api/user', userRoutes);
        app.use('/api/club', clubRoutes);
        app.use('/api/admin', adminRoutes);

        return app;
    } catch (error) {
        const err: Error = error as Error;
        console.log(err.message);
    }
};