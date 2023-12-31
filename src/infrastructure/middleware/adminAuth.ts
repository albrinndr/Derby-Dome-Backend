import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

declare global {
    namespace Express {
        interface Request {
            userId?: string;
            clubId?: string;
        }
    }
}

const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token;

    token = req.cookies.adminJWT;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

            if (decoded) {
                if (!decoded.role || decoded.role !== 'admin') {
                    return res.status(401).json({ message: 'Not authorized, invalid token' });
                }
                next();
            } else {
                return res.status(401).json({ message: 'Not authorized, invalid token' });
            }

        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, invalid token' });
        }
    } else {
        return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
};

export { protect };