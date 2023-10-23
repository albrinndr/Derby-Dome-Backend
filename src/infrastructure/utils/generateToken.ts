import jwt from 'jsonwebtoken';
import JWT from '../../useCase/interface/jwt';
import { Response } from 'express';
import { ObjectId } from 'mongoose';

class JWTToken implements JWT {
    generateToken(res: Response, userId: ObjectId, name: string): void {
        const value = name;
        const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
            expiresIn: '30d'
        });
        console.log(token);
        res.cookie(value, token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });
    }
}



export default JWTToken;
