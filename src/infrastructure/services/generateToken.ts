import jwt from 'jsonwebtoken';
import JWT from '../../useCase/interface/jwt';

class JWTToken implements JWT {
    generateToken(userId: string, role: string): string {
        const KEY = process.env.JWT_SECRET;
        if (KEY) {
            const token: string = jwt.sign({ userId, role }, KEY);
            return token;
        }
        throw new Error('JWT key is not defined!');
    }
}



export default JWTToken;
