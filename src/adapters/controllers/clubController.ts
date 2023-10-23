import { Request, Response } from "express";
import ClubUseCase from "../../useCase/clubUseCase";

class ClubController {
    private clubCase: ClubUseCase;
    constructor(clubCase: ClubUseCase) {
        this.clubCase = clubCase;
    }

    async signup(req: Request, res: Response) {
        try {
            const club = await this.clubCase.signUp(req.body);
            res.status(club.status).json(club.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async login(req: Request, res: Response) {
        try {
            const club = await this.clubCase.login(req.body);

            if (club.data.token != '') {
                res.cookie('clubJWT', club.data.token, {
                    httpOnly: true,
                    sameSite: 'strict',
                    maxAge: 30 * 24 * 60 * 60 * 1000
                });
            }
            res.status(club.status).json(club.data.club);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }
}

export default ClubController;
