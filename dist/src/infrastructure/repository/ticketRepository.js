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
const ticketModel_1 = __importDefault(require("../db/ticketModel"));
class TicketRepository {
    save(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const ticket = new ticketModel_1.default(data);
            yield ticket.save();
            return ticket;
        });
    }
    userTickets(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tickets = yield ticketModel_1.default.find({ userId }).populate('fixtureId');
            return tickets;
        });
    }
    cancelTicket(ticketId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ticket = yield ticketModel_1.default.updateOne({ _id: ticketId }, {
                    $set: {
                        isCancelled: true,
                        cancelledDate: new Date()
                    }
                });
                if (ticket)
                    return true;
                return false;
            }
            catch (error) {
                return false;
            }
        });
    }
    findOneById(ticketId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ticket = yield ticketModel_1.default.findOne({ _id: ticketId });
                return ticket;
            }
            catch (error) {
            }
        });
    }
    clubTicketProfit(clubId, selectedYear) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let year = selectedYear ? parseInt(selectedYear) : 2023;
                const result = yield ticketModel_1.default.aggregate([
                    {
                        $match: {
                            isCancelled: false,
                            createdAt: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) }
                        }
                    },
                    {
                        $lookup: {
                            from: 'fixtures',
                            localField: 'fixtureId',
                            foreignField: '_id',
                            as: 'fixture'
                        }
                    },
                    {
                        $unwind: '$fixture'
                    },
                    {
                        $match: {
                            'fixture.clubId': clubId
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
                return totalPrices;
            }
            catch (error) {
            }
        });
    }
    ;
    clubTicketSectionCountForDashboard(clubId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const results = yield ticketModel_1.default.aggregate([
                    {
                        $lookup: {
                            from: 'fixtures',
                            localField: 'fixtureId',
                            foreignField: '_id',
                            as: 'fixture'
                        }
                    },
                    {
                        $match: {
                            'fixture.clubId': clubId,
                            isCancelled: false // Consider only non-cancelled tickets
                        }
                    },
                    {
                        $group: {
                            _id: '$section',
                            count: { $sum: '$ticketCount' }
                        }
                    }
                ]);
                // Initialize counts for each section
                const seatCounts = {
                    vip: 0,
                    premium: 0,
                    economy: 0
                };
                // Assign counts to respective sections
                results.forEach((result) => {
                    seatCounts[result._id] = result.count;
                });
                return seatCounts;
            }
            catch (error) {
            }
        });
    }
    fixtureTicketSales(fixtureId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield ticketModel_1.default.aggregate([
                    {
                        $match: {
                            fixtureId: fixtureId,
                            isCancelled: false
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            totalPrice: { $sum: '$price' }
                        }
                    }
                ]);
                if (result.length > 0) {
                    return result[0].totalPrice; // Return the total price if found
                }
                else {
                    return 0; // Return 0 if no matching tickets found
                }
            }
            catch (error) {
            }
        });
    }
    sectionSelectionCountAdminDashboard() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const results = yield ticketModel_1.default.aggregate([
                    {
                        $match: {
                            isCancelled: false
                        }
                    },
                    {
                        $group: {
                            _id: '$section',
                            count: { $sum: '$ticketCount' }
                        }
                    }
                ]);
                // Initialize counts for each section
                const seatCounts = {
                    vip: 0,
                    premium: 0,
                    economy: 0
                };
                // Assign counts to respective sections
                results.forEach((result) => {
                    seatCounts[result._id] = result.count;
                });
                return seatCounts;
            }
            catch (error) {
                return {};
            }
        });
    }
    ticketsNotCancelled() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tickets = yield ticketModel_1.default.find({ isCancelled: false });
                return tickets;
            }
            catch (error) {
                return [];
            }
        });
    }
    ticketSalesDataAdminDashboard(selectedYear) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let year = selectedYear ? parseInt(selectedYear) : 2023;
                //total years list
                const totalYears = yield ticketModel_1.default.aggregate([
                    { $match: { isCancelled: false } },
                    { $group: { _id: { date: { $dateToString: { format: "%Y", date: "$createdAt" } } } } },
                    { $sort: { '_id.date': -1 } }
                ]);
                const displayYears = [];
                totalYears.forEach((year) => { displayYears.push(year._id.date); });
                // total ticket count
                const result = yield ticketModel_1.default.aggregate([
                    {
                        $match: {
                            isCancelled: false,
                            createdAt: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) }
                        }
                    },
                    {
                        $group: {
                            _id: { month: { $month: '$createdAt' } },
                            ticketCount: { $sum: '$ticketCount' }
                        }
                    },
                    {
                        $sort: { '_id.month': 1 }
                    }
                ]);
                const totalCounts = Array.from({ length: 12 }, () => 0); // Initialize an array with zeros for each month
                // Assign count at the correct index based on month
                result.forEach((item) => {
                    totalCounts[item._id.month - 1] = item.ticketCount;
                });
                // Fill missing months with 0 if no data available
                for (let i = 0; i < 12; i++) {
                    if (totalCounts[i] === undefined) {
                        totalCounts[i] = 0;
                    }
                }
                return { displayYears, totalCounts };
            }
            catch (error) {
            }
        });
    }
    findAllTickets() {
        return __awaiter(this, void 0, void 0, function* () {
            const tickets = yield ticketModel_1.default.find({}).populate({
                path: 'fixtureId',
                populate: {
                    path: 'clubId',
                    model: 'Club' // Replace 'Club' with the actual model name for 'clubId'
                }
            }).populate("userId");
            return tickets;
        });
    }
}
exports.default = TicketRepository;
