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
                }],
                reviews: []
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

    async userReview(userId: string, rating: number, review: string): Promise<any> {
        try {
            const stadium = await StadiumModel.findOne({});
            if (stadium) {
                const userReview = await StadiumModel.findOne({ 'reviews.userId': userId });

                if (userReview) {
                    const filter = { 'reviews.userId': userId };
                    const updated = await StadiumModel.updateOne(
                        filter,
                        { $set: { 'reviews.$.rating': rating, 'reviews.$.review': review } }
                    );
                    return updated;

                } else {
                    const newReview = { userId: userId, rating: rating, review: review };
                    const newResult = await StadiumModel.updateOne(
                        { $push: { reviews: newReview } }
                    );

                    return newResult;
                }
            } else {
                const stadium = new StadiumModel({
                    timings: [],
                    seats: [],
                    reviews: [{
                        userId, rating, review
                    }]
                });
                await stadium.save();
                return stadium;
            }
        } catch (error) {
            const err: Error = error as Error;
            console.log(err.message);

        }
    }

    async removeReview(userId: string): Promise<boolean> {
        try {
            const result = await StadiumModel.updateOne(
                { $pull: { reviews: { userId: userId } } }
            );
            if (result) return true;
            return false;
        } catch (error) {
            return false;
        }
    }

    async allReviews(): Promise<{}[]> {
        try {
            const stadium = await StadiumModel.findOne().populate('reviews.userId');;
            if (stadium && stadium.reviews) return stadium.reviews;
            return [];
        } catch (error) {
            return [];
        }
    }

    async singleUserReview(userId: string): Promise<any> {
        try {
            const userReview = await StadiumModel.aggregate([
                { $unwind: '$reviews' }, // Deconstructs the reviews array into separate documents
                { $match: { 'reviews.userId': userId } }, // Matches the reviews with the given userId
                { $replaceRoot: { newRoot: '$reviews' } } // Replaces the root with the matched review object
            ]);

            return userReview.length ? userReview[0] : null;
        } catch (error) {
            return null;
        }
    }
}

export default StadiumRepository;
