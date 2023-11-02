import { Request, Response } from "express";
import MatchTimeUseCase from "../../useCase/matchTimeUseCase";

class MatchTimeController {
    private MatchTimeCase: MatchTimeUseCase;
    constructor(MatchTimeCase: MatchTimeUseCase) {
        this.MatchTimeCase = MatchTimeCase;
    }

    async addNewTime(req: Request, res: Response) {
        try {
            const timeData = await this.MatchTimeCase.addNewTime(req.body);
            res.status(timeData.status).json(timeData.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }
}

export default MatchTimeController;
