import { Request, Response } from "express";
import StadiumUseCase from "../../useCase/stadiumUseCase";

class MatchTimeController {
    private StadiumCase: StadiumUseCase;
    constructor(StadiumCase: StadiumUseCase) {
        this.StadiumCase = StadiumCase;
    }

    async addNewTime(req: Request, res: Response) {
        try {
            const timeData = await this.StadiumCase.addNewTime(req.body);
            res.status(timeData.status).json(timeData.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async getAllTimes(req: Request, res: Response) {
        try {
            const times = await this.StadiumCase.getAllTimes();
            res.status(times.status).json(times.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async updateTimePrice(req: Request, res: Response) {
        try {
            const updated = await this.StadiumCase.updateTimePrice(req.body);
            res.status(updated.status).json(updated.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async deleteMatchTime(req: Request, res: Response) {
        try {
            const updated = await this.StadiumCase.deleteMatchTime(req.params.id);
            res.status(updated.status).json(updated.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async setSeatPrice(req: Request, res: Response) {
        try {
            const result = await this.StadiumCase.setSeatPrice(req.body);
            res.status(result.status).json(result.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async getAllSeats(req: Request, res: Response) {
        try {
            const result = await this.StadiumCase.getSeats();
            res.status(result.status).json(result.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }
}

export default MatchTimeController;
