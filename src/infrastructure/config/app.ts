import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';

import userRoutes from '../routes/userRoutes';
import clubRoutes from '../routes/clubRoutes';

export const createServer = () => {
    try {
        const app = express();

        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        app.use(cookieParser());

        app.use('/api/user', userRoutes);
        app.use('/api/club', clubRoutes);

        return app;
    } catch (error) {
        const err: Error = error as Error;
        console.log(err.message);
    }
};