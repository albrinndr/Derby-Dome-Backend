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
class PaymentController {
    constructor(FixtureCase, TicketCase) {
        this.FixtureCase = FixtureCase;
        this.TicketCase = TicketCase;
    }
    verifyPayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let event = req.body;
            if (event.type === 'checkout.session.completed') {
                const paymentDataClub = req.app.locals.paymentDataClub;
                const paymentDataUser = req.app.locals.paymentDataUser;
                if (paymentDataClub != null) {
                    yield this.FixtureCase.addNewFixture(paymentDataClub.data);
                    req.app.locals.paymentDataClub = null;
                }
                if (paymentDataUser != null) {
                    yield this.TicketCase.addNewTicket(paymentDataUser);
                    req.app.locals.paymentDataUser = null;
                }
                return;
            }
        });
    }
}
exports.default = PaymentController;
