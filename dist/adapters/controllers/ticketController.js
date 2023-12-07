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
class TicketController {
    constructor(TicketCase) {
        this.TicketCase = TicketCase;
    }
    createMatchTicket(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = {
                    userId: req.userId || '',
                    fixtureId: req.body.fixtureId,
                    stand: req.body.stand,
                    section: req.body.section,
                    ticketCount: req.body.ticketCount,
                    seats: req.body.seats,
                    price: req.body.price,
                    paymentType: req.body.paymentType,
                    coupon: req.body.coupon
                };
                if (req.body.paymentType === 'online') {
                    const result = yield this.TicketCase.verifyOnlinePayment(data.userId, data.fixtureId, data.price);
                    req.app.locals.paymentDataUser = data;
                    res.status(result.status).json(result.data);
                }
                else {
                    const result = yield this.TicketCase.addNewTicket(data);
                    res.status(result.status).json(result.data);
                }
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    getUserTickets(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId || '';
                const result = yield this.TicketCase.getUserTickets(userId);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    cancelTicket(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.TicketCase.cancelTicket(req.body.ticketId);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    getAllTickets(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.TicketCase.getAllTicketsDetails();
                res.status(result.status).json(result.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
}
exports.default = TicketController;
