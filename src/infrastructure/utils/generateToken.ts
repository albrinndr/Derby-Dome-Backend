import jwt from 'jsonwebtoken';
import JWT from '../../useCase/interface/jwt';
import { ObjectId } from 'mongoose';

class JWTToken implements JWT {
    generateToken(userId: string): string {
        const KEY = process.env.JWT_SECRET;
        if (KEY) {
            const token: string = jwt.sign({ userId }, KEY);
            return token;
        }
        throw new Error('JWT key is not defined!');
    }
}



export default JWTToken;
