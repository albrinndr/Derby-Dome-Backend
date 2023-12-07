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
const stadiumModal_1 = __importDefault(require("../db/stadiumModal"));
class StadiumRepository {
    saveTime(time) {
        return __awaiter(this, void 0, void 0, function* () {
            const stadium = yield stadiumModal_1.default.findOne();
            if (stadium) {
                stadium.timings.push({
                    time: time.time,
                    price: time.price,
                    showDate: time.showDate,
                });
                yield stadium.save();
                return stadium;
            }
            else {
                const stadium = new stadiumModal_1.default({
                    timings: [{
                            time: time.time,
                            price: time.price,
                            showDate: time.showDate,
                        }]
                });
                yield stadium.save();
                return stadium;
            }
        });
    }
    findByTime(time) {
        return __awaiter(this, void 0, void 0, function* () {
            const findTime = yield stadiumModal_1.default.findOne({ 'timings.time': time });
            if (findTime)
                return findTime;
            return null;
        });
    }
    findAllTime() {
        return __awaiter(this, void 0, void 0, function* () {
            const matchTimings = yield stadiumModal_1.default.aggregate([{ $project: { _id: 0, timings: 1 } }]);
            if (matchTimings && matchTimings[0] && matchTimings[0].timings) {
                return matchTimings[0].timings;
            }
            else {
                return [];
            }
        });
    }
    findTimeById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const findTime = yield stadiumModal_1.default.findOne({ 'timings._id': id });
            if (findTime)
                return findTime;
            return null;
        });
    }
    updatePrice(id, price) {
        return __awaiter(this, void 0, void 0, function* () {
            yield stadiumModal_1.default.findOneAndUpdate({ 'timings._id': id }, { $set: { 'timings.$.price': price } });
        });
    }
    deleteMatchTime(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield stadiumModal_1.default.updateOne({ 'timings._id': id }, { $pull: { timings: { _id: id } } });
        });
    }
    /////////////////////seat price///////////////
    seatPriceSave(stand, seatName, price) {
        return __awaiter(this, void 0, void 0, function* () {
            // const updateQuery: any = { $set: {} };
            // updateQuery.$set[`seats.${stand}.${seatName}`] = price;
            // await StadiumModel.updateOne({}, updateQuery, { upsert: true });
            const stadium = yield stadiumModal_1.default.findOne();
            if (stadium) {
                const query = { 'seats.stand': stand };
                query[`seats.price.${seatName}`] = price;
                const result = yield stadiumModal_1.default.findOne({ 'seats.stand': stand });
                if (result) {
                    const updateQuery = {};
                    updateQuery[`seats.$.price.${seatName}`] = price;
                    yield stadiumModal_1.default.updateOne({ 'seats.stand': stand }, { $set: updateQuery });
                }
                else {
                    const newStand = {
                        stand,
                        price: {
                            [seatName]: price
                        }
                    };
                    yield stadiumModal_1.default.updateOne({}, { $push: { seats: newStand } });
                }
            }
            else {
                const stadium = new stadiumModal_1.default({
                    timings: [],
                    seats: [{
                            stand,
                            price: {
                                [seatName]: price
                            }
                        }],
                    reviews: []
                });
                yield stadium.save();
            }
        });
    }
    getAllSeats() {
        return __awaiter(this, void 0, void 0, function* () {
            const seats = yield stadiumModal_1.default.aggregate([{ $project: { _id: 0, seats: 1 } }]);
            if (seats && seats[0] && seats[0].seats) {
                return seats[0].seats;
            }
            else {
                return [];
            }
        });
    }
    getSeatPrices() {
        return __awaiter(this, void 0, void 0, function* () {
            const seats = yield stadiumModal_1.default.aggregate([{ $project: { _id: 0, seats: 1 } }]);
            if (seats && seats[0] && seats[0].seats) {
                const priceObj = {};
                seats[0].seats.forEach((seat) => {
                    priceObj[seat.stand] = seat.price;
                });
                return priceObj;
            }
            else {
                return {};
            }
        });
    }
    userReview(userId, rating, review) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stadium = yield stadiumModal_1.default.findOne({});
                if (stadium) {
                    const userReview = yield stadiumModal_1.default.findOne({ 'reviews.userId': userId });
                    if (userReview) {
                        const filter = { 'reviews.userId': userId };
                        const updated = yield stadiumModal_1.default.updateOne(filter, { $set: { 'reviews.$.rating': rating, 'reviews.$.review': review } });
                        return updated;
                    }
                    else {
                        const newReview = { userId: userId, rating: rating, review: review };
                        const newResult = yield stadiumModal_1.default.updateOne({ $push: { reviews: newReview } });
                        return newResult;
                    }
                }
                else {
                    const stadium = new stadiumModal_1.default({
                        timings: [],
                        seats: [],
                        reviews: [{
                                userId, rating, review
                            }]
                    });
                    yield stadium.save();
                    return stadium;
                }
            }
            catch (error) {
                const err = error;
                console.log(err.message);
            }
        });
    }
    removeReview(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield stadiumModal_1.default.updateOne({ $pull: { reviews: { userId: userId } } });
                if (result)
                    return true;
                return false;
            }
            catch (error) {
                return false;
            }
        });
    }
    allReviews() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stadium = yield stadiumModal_1.default.findOne().populate('reviews.userId');
                ;
                if (stadium && stadium.reviews)
                    return stadium.reviews;
                return [];
            }
            catch (error) {
                return [];
            }
        });
    }
    singleUserReview(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userReview = yield stadiumModal_1.default.aggregate([
                    { $unwind: '$reviews' },
                    { $match: { 'reviews.userId': userId } },
                    { $replaceRoot: { newRoot: '$reviews' } } // Replaces the root with the matched review object
                ]);
                return userReview.length ? userReview[0] : null;
            }
            catch (error) {
                return null;
            }
        });
    }
}
exports.default = StadiumRepository;
