import Fixture from "../../domain/fixture";
import FixtureRepo from "../../useCase/interface/fixtureRepo";
import FixtureModel from "../db/fixtureModel";

class FixtureRepository implements FixtureRepo {
    async findAllFixtures(): Promise<{}[]> {
        const data = await FixtureModel.find({}).populate('awayTeamId').populate('clubId');
        if (data && data.length > 0) return data;
        return [];
    }

    async saveFixture(fixture: Fixture): Promise<any> {
        const newFixture = new FixtureModel(fixture);
        await newFixture.save();
        return newFixture;
    }

    async findFixturesByClubId(id: string): Promise<{}[]> {
        const fixtures = await FixtureModel.find({ clubId: id, status: 'active' });
        if (fixtures && fixtures.length > 0) return fixtures;
        return [];
    }

    async findFixtureByIdAndCancel(id: string): Promise<boolean> {
        const result = await FixtureModel.findByIdAndUpdate({ _id: id }, { $set: { status: 'cancelled' } });
        if (result) return true;
        return false;
    }

    async findByIdNotCancelled(id: string): Promise<any | null> {
        try {
            const result = await FixtureModel.findOne({ _id: id, status: { $ne: 'cancelled' } }).populate('clubId').populate('awayTeamId');
            if (result) return result;
            return null;
        } catch (error) {
            return null;
        }
    }

}

export default FixtureRepository;
