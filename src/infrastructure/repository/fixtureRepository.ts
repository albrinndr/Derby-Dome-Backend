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

    async updateNormalSeats(fixtureId: string, stand: string, section: string, row: string, count: number, seats: number[]): Promise<any> {
        try {
            const fixture = await FixtureModel.findOne({ _id: fixtureId });
            if (fixture && fixture.seats) {
                const rowSeatsArr = fixture.seats[stand][section][row].seats;
                if (fixture && fixture.seats) {
                    const rowCount = fixture.seats[stand][section][row].count;
                    fixture.seats[stand][section][row].count = rowCount - count;
                    fixture.seats[stand][section][row].seats = [...rowSeatsArr, ...seats];
                    await fixture.save();
                    return true;
                }
            }else{
                return false
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

    async updateSeatsOnCancel(fixtureId: string, stand: string, section: string, row: string, count: number, seats: number[]): Promise<boolean> {
        try {
            const fixture = await FixtureModel.findOne({ _id: fixtureId });
            if (fixture && fixture.seats) {
                const rowCount = fixture.seats[stand][section][row].count;
                const rowSeatsArr = fixture.seats[stand][section][row].seats;
                fixture.seats[stand][section][row].count = rowCount + count;

                const updatedSeats = rowSeatsArr.filter((seat: any) => !seats.includes(seat));
                fixture.seats[stand][section][row].seats = updatedSeats;

                await fixture.save();
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }
    }

    async clubExpenditure(clubId: string, selectedYear?: string): Promise<any> {
        try {
            let year = selectedYear ? parseInt(selectedYear) : 2023;


            //total years list
            const totalYears = await FixtureModel.aggregate([
                { $match: { clubId: clubId, status: 'active' } },
                { $group: { _id: { date: { $dateToString: { format: "%Y", date: "$createdAt" } } } } },
                { $sort: { '_id.date': -1 } }
            ]);

            const displayYears: string[] = [];
            totalYears.forEach((year) => { displayYears.push(year._id.date); });


            // total expenditure
            const result = await FixtureModel.aggregate([
                {
                    $match: {
                        clubId: clubId,
                        status: 'active',
                        createdAt: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) }
                    }
                },
                {
                    $group: {
                        _id: { month: { $month: '$createdAt' } },
                        totalPrice: { $sum: '$price' }
                    }
                },
                {
                    $sort: { '_id.month': 1 }
                }
            ]);

            // Prepare the final array with total prices ordered by months
            const totalPrices: number[] = Array.from({ length: 12 }, () => 0); // Initialize an array with zeros for each month

            // Assign totalPrice at the correct index based on month
            result.forEach((item) => {
                totalPrices[item._id.month - 1] = item.totalPrice;
            });

            // Fill missing months with 0 if no data available
            for (let i = 0; i < 12; i++) {
                if (totalPrices[i] === undefined) {
                    totalPrices[i] = 0;
                }
            }


            return { displayYears, totalPrices };

        } catch (error) {

        }

    };

    async findUpcomingFixtures(clubId: string): Promise<any> {
        try {
            const currDate = new Date();
            const fixtures = await FixtureModel.find({ clubId: clubId, date: { $gt: currDate }, status: 'active', checkDate: { $lt: currDate } }).populate('clubId');
            return fixtures;
        } catch (error) {

        }

    }


    async slotSaleAdminDashboard(selectedYear?: string): Promise<any> {
        try {
            let year = selectedYear ? parseInt(selectedYear) : 2023;

            //total years list
            const totalYears = await FixtureModel.aggregate([
                { $match: { status: 'active' } },
                { $group: { _id: { date: { $dateToString: { format: "%Y", date: "$createdAt" } } } } },
                { $sort: { '_id.date': -1 } }
            ]);

            const displayYears: string[] = [];
            totalYears.forEach((year) => { displayYears.push(year._id.date); });


            // total expenditure
            const result = await FixtureModel.aggregate([
                {
                    $match: {
                        status: 'active',
                        createdAt: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) }
                    }
                },
                {
                    $group: {
                        _id: { month: { $month: '$createdAt' } },
                        totalPrice: { $sum: '$price' }
                    }
                },
                {
                    $sort: { '_id.month': 1 }
                }
            ]);

            // Prepare the final array with total prices ordered by months
            const totalPrices: number[] = Array.from({ length: 12 }, () => 0); // Initialize an array with zeros for each month

            // Assign totalPrice at the correct index based on month
            result.forEach((item) => {
                totalPrices[item._id.month - 1] = item.totalPrice;
            });

            // Fill missing months with 0 if no data available
            for (let i = 0; i < 12; i++) {
                if (totalPrices[i] === undefined) {
                    totalPrices[i] = 0;
                }
            }
            return { displayYears, totalPrices };
        } catch (error) {

        }

    };

    async findAllFixturesNotCancelled(): Promise<{}[]> {
        const data = await FixtureModel.find({ status: 'active' });
        if (data && data.length > 0) return data;
        return [];
    }
}

export default FixtureRepository;
