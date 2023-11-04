import FixtureRepo from "../../useCase/interface/fixtureRepo";
import FixtureModel from "../db/fixtureModel";

class FixtureRepository implements FixtureRepo {
    async findAllFixtures(): Promise<{}[]> {
        const data = await FixtureModel.find({});
        if (data && data.length > 0) return data;
        return [];
    }
}

export default FixtureRepository;
