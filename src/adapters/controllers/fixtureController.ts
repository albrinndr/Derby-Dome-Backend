import { Request, Response } from "express";
import FixtureUseCase from "../../useCase/fixtureUseCase";

class FixtureController {
    private FixtureCase: FixtureUseCase;
    constructor(FixtureCase: FixtureUseCase) {
        this.FixtureCase = FixtureCase;
    }

    async getFixtureFormContent(req: Request, res: Response) {
        try {
            const fixtureData = await this.FixtureCase.fixtureContent(req.body.date, req.clubId || '');
            res.status(fixtureData.status).json(fixtureData.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);

        }
    }
}

export default FixtureController;
