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
class AdminController {
    constructor(adminCase) {
        this.adminCase = adminCase;
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = yield this.adminCase.login(req.body);
                if (admin.data.token) {
                    res.cookie('adminJWT', admin.data.token, {
                        httpOnly: true,
                        sameSite: 'strict',
                        secure: process.env.NODE_ENV !== 'development',
                        maxAge: 30 * 24 * 60 * 60 * 1000
                    });
                }
                res.status(admin.status).json(admin.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.cookie('adminJWT', '', {
                    httpOnly: true,
                    expires: new Date(0)
                });
                res.status(200).json({ message: 'Admin logged out' });
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.adminCase.getUsers();
                res.status(users.status).json(users.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    blockUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.query.id;
                const user = yield this.adminCase.blockUser(userId);
                res.status(user.status).json(user.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    getClubs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const clubs = yield this.adminCase.getClubs();
                res.status(clubs.status).json(clubs.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    blockClub(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const clubId = req.query.id;
                const club = yield this.adminCase.blockClub(clubId);
                res.status(club.status).json(club.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    slotSaleDashboardData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const year = req.query.year;
                const result = yield this.adminCase.dashboardSlotSaleData(year);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    staticChartAndCardDashboardData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.adminCase.dashboardChartAndCardContent();
                res.status(result.status).json(result.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    ticketsSoldDashboardData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const year = req.query.year;
                const result = yield this.adminCase.dashboardTicketSoldData(year);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    allFixtures(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.adminCase.allFixtures();
                res.status(result.status).json(result.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
}
exports.default = AdminController;
