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
Object.defineProperty(exports, "__esModule", { value: true });
class StadiumUseCase {
    // private ScheduleTask: ScheduleTask;
    constructor(StadiumRepository, ScheduleTask, FixtureRepository) {
        this.StadiumRepository = StadiumRepository;
        this.FixtureRepository = FixtureRepository;
        // this.ScheduleTask = ScheduleTask;
    }
    addNewTime(timeData) {
        return __awaiter(this, void 0, void 0, function* () {
            const timeExists = yield this.StadiumRepository.findByTime(timeData.time);
            if (!timeExists) {
                let values = Object.assign({}, timeData);
                const fixtureData = yield this.FixtureRepository.findAllFixtures();
                if (fixtureData.length === 0)
                    values = Object.assign(Object.assign({}, timeData), { showDate: new Date(new Date().setDate(new Date().getDate() + 10)) });
                const newTime = yield this.StadiumRepository.saveTime(values);
                return {
                    status: 200,
                    data: newTime
                };
            }
            else {
                return {
                    status: 400,
                    data: { message: 'Time already exists!' }
                };
            }
        });
    }
    getAllTimes() {
        return __awaiter(this, void 0, void 0, function* () {
            const allTimes = yield this.StadiumRepository.findAllTime();
            return {
                status: 200,
                data: allTimes
            };
        });
    }
    updateTimePrice(timeData) {
        return __awaiter(this, void 0, void 0, function* () {
            const time = yield this.StadiumRepository.findTimeById(timeData.id);
            if (time) {
                yield this.StadiumRepository.updatePrice(timeData.id, timeData.price);
                // this.ScheduleTask.scheduleTimePrice(() => this.StadiumRepository.updatePrice(timeData.id, timeData.price));
                return {
                    status: 200,
                    data: { message: 'Changes applied!' }
                };
            }
            else {
                return {
                    status: 400,
                    data: { message: 'Invalid data provided' }
                };
            }
        });
    }
    deleteMatchTime(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const time = yield this.StadiumRepository.findTimeById(id);
            if (time) {
                yield this.StadiumRepository.deleteMatchTime(id);
                // this.ScheduleTask.scheduleTimePrice(() => this.StadiumRepository.deleteMatchTime(id));
                return {
                    status: 200,
                    data: { message: 'Time removed!' }
                };
            }
            else {
                return {
                    status: 400,
                    data: { message: 'Invalid data provided' }
                };
            }
        });
    }
    setSeatPrice(seatData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.StadiumRepository.seatPriceSave(seatData.stand, seatData.seatName, seatData.price);
            return {
                status: 200,
                data: { message: 'Seat price updated!' }
            };
        });
    }
    getSeats() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.StadiumRepository.getAllSeats();
            return {
                status: 200,
                data: result
            };
        });
    }
    addUpdateReview(userId, rating, review) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.StadiumRepository.userReview(userId, rating, review);
            if (result) {
                return {
                    status: 200,
                    data: "Your review is submitted"
                };
            }
            else {
                return {
                    status: 400,
                    data: { message: "An error occurred! Please try again!" }
                };
            }
        });
    }
    deleteReview(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const review = yield this.StadiumRepository.removeReview(userId);
            if (review) {
                return {
                    status: 200,
                    data: "Your review is removed!"
                };
            }
            else {
                return {
                    status: 400,
                    data: { message: "An error occurred! Please try again!" }
                };
            }
        });
    }
    reviewPageData(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const reviews = yield this.StadiumRepository.allReviews();
            if (userId) {
                const userReview = yield this.StadiumRepository.singleUserReview(userId);
                return {
                    status: 200,
                    data: { reviews, userReview }
                };
            }
            else {
                return {
                    status: 200,
                    data: { reviews }
                };
            }
        });
    }
}
exports.default = StadiumUseCase;
