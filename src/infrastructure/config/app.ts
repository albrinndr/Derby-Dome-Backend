import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';

import userRoutes from '../routes/userRoutes';

export const createServer = () => {
    try {
        const app = express();

        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        app.use(cookieParser());

        app.use('/api/user', userRoutes);

        return app;
    } catch (error) {
        const err: Error = error as Error;
        console.log(err.message);
    }
};