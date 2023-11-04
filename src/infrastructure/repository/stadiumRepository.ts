import Stadium, { Time } from "../../domain/stadium";
import StadiumRepo from "../../useCase/interface/stadiumRepo";
import StadiumModel from "../db/stadiumModal";

class StadiumRepository implements StadiumRepo {
    async saveTime(time: Time): Promise<any> {
        const stadium = await StadiumModel.findOne();
        if (stadium) {
            stadium.timings.push({
                time: time.time,
                price: time.price,
                // newPrice: time.price,
                // delete: time.delete,
                showDate: time.showDate,
            });
            await stadium.save();
            return stadium;
        } else {
            const stadium = new StadiumModel({
                timings: [{
                    time: time.time,
                    price: time.price,
                    // newPrice: time.price,
                    // delete: time.delete,
                    showDate: time.showDate,
                }]
            });
            await stadium.save();
            return stadium;
        }
    }

    async findByTime(time: string): Promise<Stadium | null> {
        const findTime = await StadiumModel.findOne({ 'timings.time': time });
        if (findTime) return findTime;
        return null;
    }

    async findAllTime(): Promise<{}[] | null> {
        const matchTimings = await StadiumModel.aggregate([{ $project: { _id: 0, timings: 1 } }]);
        // return matchTimings[0].timings;
        if (matchTimings && matchTimings[0] && matchTimings[0].timings) {
            return matchTimings[0].timings;
        } else {
            return [];
        }
    }

    async findTimeById(id: string): Promise<Stadium | null> {
        const findTime = await StadiumModel.findOne({ 'timings._id': id });
        if (findTime) return findTime;
        return null;
    }

    // async updateNewPrice(id: string, price: number): Promise<any> {
    //     await StadiumModel.findOneAndUpdate(
    //         { 'timings._id': id },
    //         {
    //             $set: {
    //                 'timings.$.newPrice': price,
    //                 'timings.$.showDate': new Date(new Date().setDate(new Date().getDate() + 12))
    //             }
    //         }
    //     );
    // }

    async updatePrice(id: string, price: number): Promise<any> {
        await StadiumModel.findOneAndUpdate(
            { 'timings._id': id },
            { $set: { 'timings.$.price': price } }
        );
    }

    // async setMatchDelete(id: string): Promise<any> {
    //     await StadiumModel.findOneAndUpdate(
    //         { 'timings._id': id },
    //         {
    //             $set: {
    //                 'timings.$.delete': true,
    //                 'timings.$.showDate': new Date(new Date().setDate(new Date().getDate() + 12))

    //             }
    //         }
    //     );
    // }

    async deleteMatchTime(id: string): Promise<any> {
        await StadiumModel.updateOne(
            { 'timings._id': id },
            { $pull: { timings: { _id: id } } }
        );

    }

    //////////////////////////////////seat price///////////////

    async seatPriceSave(stand: string, price: number): Promise<any> {
        const stadium = await StadiumModel.findOne();
        if (stadium) {
            const result = await StadiumModel.findOne({ 'seats.stand': stand });
            if (result) {
                await StadiumModel.updateOne(
                    { 'seats.stand': stand },
                    { $set: { 'seats.$.price': price } }
                );
            } else {
                await StadiumModel.updateOne({},
                    {
                        $push: {
                            seats: { stand: stand, price: price }
                        }
                    }
                );
            }
        } else {
            const stadium = new StadiumModel({
                seats: [{
                    stand: stand,
                    price: price
                }]
            });
            await stadium.save();
        }

    }

    async getAllSeats(): Promise<any> {
        const seats = await StadiumModel.aggregate([{ $project: { _id: 0, seats: 1 } }]);
        if (seats && seats[0] && seats[0].seats) {
            return seats[0].seats;
        } else {
            return [];
        }
    }
}

export default StadiumRepository;
