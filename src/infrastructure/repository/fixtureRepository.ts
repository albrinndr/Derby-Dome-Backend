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
        try {
            const fixtures = await FixtureModel.find({ clubId: id, status: 'active' }).populate('clubId');
            if (fixtures && fixtures.length > 0) return fixtures;
            return [];
        } catch (error) {
            return [];
        }
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

    async updateNormalSeats(fixtureId: string, stand: string, section: string, row: string, count: number): Promise<any> {
        try {
            const fixture = await FixtureModel.findOne({ _id: fixtureId });
            if (fixture && fixture.seats) {
                const rowCount = fixture.seats[stand][section][row];
                fixture.seats[stand][section][row] = rowCount - count;
                await fixture.save();
                return true;
            }
        } catch (error) {
            return false;
        }
    }

    async updateVipSeats(fixtureId: string, stand: string, row: string, count: number, seats: number[]): Promise<any> {
        try {
            const fixture = await FixtureModel.findOne({ _id: fixtureId });
            if (fixture && fixture.seats) {
                const rowCount = fixture.seats[stand]['vip'][row].count;
                const rowSeatsArr = fixture.seats[stand]['vip'][row].seats;
                fixture.seats[stand]['vip'][row].count = rowCount - count;
                fixture.seats[stand]['vip'][row].seats = [...rowSeatsArr, ...seats];

                await fixture.save();
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }
    }

}

export default FixtureRepository;
