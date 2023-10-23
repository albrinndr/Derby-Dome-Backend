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

   
}

export default ClubController;
