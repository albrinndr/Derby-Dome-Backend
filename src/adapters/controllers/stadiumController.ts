import { Request, Response } from "express";
import MatchTimeUseCase from "../../useCase/stadiumUseCase";

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

    async getAllTimes(req: Request, res: Response) {
        try {
            const times = await this.MatchTimeCase.getAllTimes();
            res.status(times.status).json(times.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async updateTimePrice(req: Request, res: Response) {
        try {
            const updated = await this.MatchTimeCase.updateTimePrice(req.body);
            res.status(updated.status).json(updated.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }
}

export default MatchTimeController;
