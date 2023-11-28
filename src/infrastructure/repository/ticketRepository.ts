import TicketI from "../../domain/ticket";
import TicketRepo from "../../useCase/interface/ticketRepo";
import TicketModel from "../db/ticketModel";

class TicketRepository implements TicketRepo {
    async save(data: TicketI): Promise<any> {
        const ticket = new TicketModel(data);
        await ticket.save();
        return ticket;
    }

    async userTickets(userId: string): Promise<[] | any> {
        const tickets = await TicketModel.find({ userId });
        return tickets;
    }

    async cancelTicket(ticketId: string): Promise<any> {
        try {
            const ticket = await TicketModel.updateOne({ _id: ticketId }, {
                $set: {
                    isCancelled: true,
                    cancelledDate: new Date()
                }
            });
            if (ticket) return true;
            return false;
        } catch (error) {
            return false;
        }
    }

    async findOneById(ticketId: string): Promise<any> {
        try {
            const ticket = await TicketModel.findOne({ _id: ticketId });
            return ticket;
        } catch (error) {
        }
    }

    async clubTicketProfit(clubId: string, selectedYear?: string): Promise<any> {
        try {
            let year = selectedYear ? parseInt(selectedYear) : 2023;

            const result = await TicketModel.aggregate([
                {
                    $match: {
                        isCancelled: false,
                        createdAt: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) }
                    }
                },
                {
                    $lookup: {
                        from: 'fixtures', // Replace 'fixtures' with the name of your Fixture collection
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

            return totalPrices;

        } catch (error) {

        }
    };

    async clubTicketSectionCountForDashboard(clubId: string): Promise<any> {
        try {
            const results = await TicketModel.aggregate([
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
            const seatCounts: { [key: string]: number; } = {
                vip: 0,
                premium: 0,
                economy: 0
            };

            // Assign counts to respective sections
            results.forEach((result: any) => {
                seatCounts[result._id] = result.count;
            });

            return seatCounts;
        } catch (error) {

        }
    }

    async fixtureTicketSales(fixtureId: string): Promise<any> {
        try {
            const result = await TicketModel.aggregate([
                {
                    $match: {
                        fixtureId: fixtureId, // Convert to ObjectId
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
            } else {
                return 0; // Return 0 if no matching tickets found
            }
        } catch (error) {

        }
    }


    async sectionSelectionCountAdminDashboard(): Promise<any> {
        try {
            const results = await TicketModel.aggregate([
                {
                    $match: {
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
            const seatCounts: { [key: string]: number; } = {
                vip: 0,
                premium: 0,
                economy: 0
            };

            // Assign counts to respective sections
            results.forEach((result: any) => {
                seatCounts[result._id] = result.count;
            });

            return seatCounts;
        } catch (error) {
            return {};
        }
    }

    async ticketsNotCancelled(): Promise<{}[]> {
        try {
            const tickets = await TicketModel.find({ isCancelled: false });
            return tickets;
        } catch (error) {
            return [];
        }
    }

    async ticketSalesDataAdminDashboard(selectedYear?: string): Promise<any> {
        try {
            let year = selectedYear ? parseInt(selectedYear) : 2023;

            //total years list
            const totalYears = await TicketModel.aggregate([
                { $match: { isCancelled: false } },
                { $group: { _id: { date: { $dateToString: { format: "%Y", date: "$createdAt" } } } } },
                { $sort: { '_id.date': -1 } }
            ]);

            const displayYears: string[] = [];
            totalYears.forEach((year) => { displayYears.push(year._id.date); });


            // total ticket count
            const result = await TicketModel.aggregate([
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

            const totalCounts: number[] = Array.from({ length: 12 }, () => 0); // Initialize an array with zeros for each month

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
        } catch (error) {

        }
    }
}
export default TicketRepository;
