import { Request, Response } from "express";
import FixtureUseCase from "../../useCase/fixtureUseCase";
import CloudinaryUpload from "../../infrastructure/utils/cloudinaryUpload";


class FixtureController {
    private FixtureCase: FixtureUseCase;
    private CloudinaryUpload: CloudinaryUpload;
    constructor(FixtureCase: FixtureUseCase, CloudinaryUpload: CloudinaryUpload) {
        this.FixtureCase = FixtureCase;
        this.CloudinaryUpload = CloudinaryUpload;

    }

    async getFixtureFormContent(req: Request, res: Response) {
        try {
            // let date = new Date(req.body.date);
            // date.setDate(date.getDate() + 1);    
            const fixtureData = await this.FixtureCase.fixtureContent(req.body.date, req.clubId || '');
            res.status(fixtureData.status).json(fixtureData.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);

        }
    }

    async createNewFixture(req: Request, res: Response) {
        try {
            if (req.file) {
                const imageUrl = await this.CloudinaryUpload.upload(req.file.path, 'matchday-posters');
                const formData = { ...req.body, clubId: req.clubId, poster: imageUrl.secure_url };

                const fixture = await this.FixtureCase.addNewFixture(formData);
                res.status(fixture.status).json(fixture.data);
            } else {
                res.status(400).json({ message: 'Upload a matchday Poster' });
            }
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async getClubFixtures(req: Request, res: Response) {
        try {
            const id = req.clubId || '';
            const fixtures = await this.FixtureCase.clubFixtures(id);
            res.status(fixtures.status).json(fixtures.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async cancelFixture(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const result = await this.FixtureCase.cancelFixture(id);
            res.status(result.status).json(result.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }
}

export default FixtureController;
