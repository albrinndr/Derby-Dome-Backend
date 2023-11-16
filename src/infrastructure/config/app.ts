import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import cors from 'cors';
import session from 'express-session';

import userRoutes from '../routes/userRoutes';
import clubRoutes from '../routes/clubRoutes';
import adminRoutes from '../routes/adminRoutes';
import paymentRoutes from '../routes/paymentRoutes';
import path from 'path';
import http from 'http';
import { SocketRepository } from '../repository/socketRepository';

const app = express();

const httpServer = http.createServer(app);

const socket = new SocketRepository(httpServer);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.use(cookieParser());
app.use(cors({ origin: process.env.CORS_URL, credentials: true, }));
app.use(session({ secret: process.env.SESSION_SECRET as string, resave: false, saveUninitialized: true }));

app.use('/api/user', userRoutes);
app.use('/api/club', clubRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);


export { httpServer };
