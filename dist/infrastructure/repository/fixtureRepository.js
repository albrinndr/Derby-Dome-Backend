"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fixtureModel_1 = __importDefault(require("../db/fixtureModel"));
class FixtureRepository {
    findAllFixtures() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield fixtureModel_1.default.find({}).populate('awayTeamId').populate('clubId');
            if (data && data.length > 0)
                return data;
            return [];
        });
    }
    saveFixture(fixture) {
        return __awaiter(this, void 0, void 0, function* () {
            const newFixture = new fixtureModel_1.default(fixture);
            yield newFixture.save();
            return newFixture;
        });
    }
    findFixturesByClubId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fixtures = yield fixtureModel_1.default.find({ clubId: id, status: 'active' }).populate('clubId');
                if (fixtures && fixtures.length > 0)
                    return fixtures;
                return [];
            }
            catch (error) {
                return [];
            }
        });
    }
    findFixtureByIdAndCancel(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield fixtureModel_1.default.findByIdAndUpdate({ _id: id }, { $set: { status: 'cancelled' } });
            if (result)
                return true;
            return false;
        });
    }
    findByIdNotCancelled(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield fixtureModel_1.default.findOne({ _id: id, status: { $ne: 'cancelled' } }).populate('clubId').populate('awayTeamId');
                if (result)
                    return result;
                return null;
            }
            catch (error) {
                return null;
            }
        });
    }
    updateNormalSeats(fixtureId, stand, section, row, count, seats) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fixture = yield fixtureModel_1.default.findOne({ _id: fixtureId });
                if (fixture && fixture.seats) {
                    const rowSeatsArr = fixture.seats[stand][section][row].seats;
                    if (fixture && fixture.seats) {
                        const rowCount = fixture.seats[stand][section][row].count;
                        fixture.seats[stand][section][row].count = rowCount - count;
                        fixture.seats[stand][section][row].seats = [...rowSeatsArr, ...seats];
                        yield fixture.save();
                        return true;
                    }
                }
                else {
                    return false;
                }
            }
            catch (error) {
                return false;
            }
        });
    }
    updateVipSeats(fixtureId, stand, row, count, seats) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fixture = yield fixtureModel_1.default.findOne({ _id: fixtureId });
                if (fixture && fixture.seats) {
                    const rowCount = fixture.seats[stand]['vip'][row].count;
                    const rowSeatsArr = fixture.seats[stand]['vip'][row].seats;
                    fixture.seats[stand]['vip'][row].count = rowCount - count;
                    fixture.seats[stand]['vip'][row].seats = [...rowSeatsArr, ...seats];
                    yield fixture.save();
                    return true;
                }
                return false;
            }
            catch (error) {
                return false;
            }
        });
    }
    updateSeatsOnCancel(fixtureId, stand, section, row, count, seats) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fixture = yield fixtureModel_1.default.findOne({ _id: fixtureId });
                if (fixture && fixture.seats) {
                    const rowCount = fixture.seats[stand][section][row].count;
                    const rowSeatsArr = fixture.seats[stand][section][row].seats;
                    fixture.seats[stand][section][row].count = rowCount + count;
                    const updatedSeats = rowSeatsArr.filter((seat) => !seats.includes(seat));
                    fixture.seats[stand][section][row].seats = updatedSeats;
                    yield fixture.save();
                    return true;
                }
                return false;
            }
            catch (error) {
                return false;
            }
        });
    }
    clubExpenditure(clubId, selectedYear) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let year = selectedYear ? parseInt(selectedYear) : 2023;
                //total years list
                const totalYears = yield fixtureModel_1.default.aggregate([
                    { $match: { clubId: clubId, status: 'active' } },
                    { $group: { _id: { date: { $dateToString: { format: "%Y", date: "$createdAt" } } } } },
                    { $sort: { '_id.date': -1 } }
                ]);
                const displayYears = [];
                totalYears.forEach((year) => { displayYears.push(year._id.date); });
                // total expenditure
                const result = yield fixtureModel_1.default.aggregate([
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
                const totalPrices = Array.from({ length: 12 }, () => 0); // Initialize an array with zeros for each month
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
            }
            catch (error) {
            }
        });
    }
    ;
    findUpcomingFixtures(clubId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currDate = new Date();
                const fixtures = yield fixtureModel_1.default.find({ clubId: clubId, date: { $gt: currDate }, status: 'active', checkDate: { $lt: currDate } }).populate('clubId');
                return fixtures;
            }
            catch (error) {
            }
        });
    }
    slotSaleAdminDashboard(selectedYear) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let year = selectedYear ? parseInt(selectedYear) : 2023;
                //total years list
                const totalYears = yield fixtureModel_1.default.aggregate([
                    { $match: { status: 'active' } },
                    { $group: { _id: { date: { $dateToString: { format: "%Y", date: "$createdAt" } } } } },
                    { $sort: { '_id.date': -1 } }
                ]);
                const displayYears = [];
                totalYears.forEach((year) => { displayYears.push(year._id.date); });
                // total expenditure
                const result = yield fixtureModel_1.default.aggregate([
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
                const totalPrices = Array.from({ length: 12 }, () => 0); // Initialize an array with zeros for each month
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
            }
            catch (error) {
            }
        });
    }
    ;
    findAllFixturesNotCancelled() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield fixtureModel_1.default.find({ status: 'active' });
            if (data && data.length > 0)
                return data;
            return [];
        });
    }
}
exports.default = FixtureRepository;
