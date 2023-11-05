import Fixture from "../../domain/fixture";
import FixtureRepo from "../../useCase/interface/fixtureRepo";
import FixtureModel from "../db/fixtureModel";

class FixtureRepository implements FixtureRepo {
    async findAllFixtures(): Promise<{}[]> {
        const data = await FixtureModel.find({}).populate('awayTeamId')
        if (data && data.length > 0) return data;
        return [];
    }

    async saveFixture(fixture: Fixture): Promise<any> {
        const newFixture = new FixtureModel(fixture);
        await newFixture.save();
        return newFixture;
    }
}

export default FixtureRepository;
