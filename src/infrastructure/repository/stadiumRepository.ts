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
                showDate: time.showDate,
            });

            await stadium.save();
            return stadium;

        } else {
            const stadium = new StadiumModel({
                timings: [{
                    time: time.time,
                    price: time.price,
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


    async updatePrice(id: string, price: number): Promise<any> {
        await StadiumModel.findOneAndUpdate(
            { 'timings._id': id },
            { $set: { 'timings.$.price': price } }
        );
    }


    async deleteMatchTime(id: string): Promise<any> {
        await StadiumModel.updateOne(
            { 'timings._id': id },
            { $pull: { timings: { _id: id } } }
        );

    }

    /////////////////////seat price///////////////

    async seatPriceSave(stand: string, seatName: string, price: number): Promise<any> {
        // const updateQuery: any = { $set: {} };
        // updateQuery.$set[`seats.${stand}.${seatName}`] = price;
        // await StadiumModel.updateOne({}, updateQuery, { upsert: true });
        const stadium = await StadiumModel.findOne();
        if (stadium) {
            const query: any = { 'seats.stand': stand };
            query[`seats.price.${seatName}`] = price;

            const result = await StadiumModel.findOne({ 'seats.stand': stand });

            if (result) {
                const updateQuery: any = {};
                updateQuery[`seats.$.price.${seatName}`] = price;

                await StadiumModel.updateOne(
                    { 'seats.stand': stand },
                    { $set: updateQuery }
                );
            } else {
                const newStand = {
                    stand,
                    price: {
                        [seatName]: price
                    }
                };

                await StadiumModel.updateOne(
                    {},
                    { $push: { seats: newStand } }
                );
            }

        } else {
            const stadium = new StadiumModel({
                timings: [],
                seats: [{
                    stand,
                    price: {
                        [seatName]: price
                    }
                }]
            });

            await stadium.save();
        }
    }


    async getAllSeats(): Promise<[]> {
        const seats = await StadiumModel.aggregate([{ $project: { _id: 0, seats: 1 } }]);
        if (seats && seats[0] && seats[0].seats) {
            return seats[0].seats;
        } else {
            return [];
        }
    }

    async getSeatPrices(): Promise<{}> {
        const seats = await StadiumModel.aggregate([{ $project: { _id: 0, seats: 1 } }]);
        if (seats && seats[0] && seats[0].seats) {
            const priceObj: any = {};

            seats[0].seats.forEach((seat: any) => {
                priceObj[seat.stand] = seat.price;
            });
            return priceObj;
        } else {
            return {};
        }
    }
}

export default StadiumRepository;
