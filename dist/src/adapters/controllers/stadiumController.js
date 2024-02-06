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
class StadiumController {
    constructor(StadiumCase) {
        this.StadiumCase = StadiumCase;
    }
    addNewTime(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const timeData = yield this.StadiumCase.addNewTime(req.body);
                res.status(timeData.status).json(timeData.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    getAllTimes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const times = yield this.StadiumCase.getAllTimes();
                res.status(times.status).json(times.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    updateTimePrice(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updated = yield this.StadiumCase.updateTimePrice(req.body);
                res.status(updated.status).json(updated.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    deleteMatchTime(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updated = yield this.StadiumCase.deleteMatchTime(req.params.id);
                res.status(updated.status).json(updated.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    setSeatPrice(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.StadiumCase.setSeatPrice(req.body);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    getAllSeats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.StadiumCase.getSeats();
                res.status(result.status).json(result.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    addUpdateReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { rating, review } = req.body;
                const userId = req.userId || '';
                const result = yield this.StadiumCase.addUpdateReview(userId, rating, review);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    deleteReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.StadiumCase.deleteReview(req.userId || '');
                res.status(result.status).json(result.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
}
exports.default = StadiumController;
