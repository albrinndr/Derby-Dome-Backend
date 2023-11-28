import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import ClubRepository from '../repository/clubRepository';

const clubRepo = new ClubRepository();

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

    token = req.cookies.clubJWT;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

            const club = await clubRepo.findById(decoded.userId as string);
            if (decoded && (!decoded.role || decoded.role != 'club')) {
                return res.status(401).json({ message: 'Not authorized, invalid token' });
            }
            else if (club) {
                req.clubId = club._id;
                if (club.isBlocked) {
                    return res.status(401).json({ message: 'Club have been blocked by admin!' });
                } else {
                    next();
                }
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