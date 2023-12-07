"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const TicketSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' },
    fixtureId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'Fixture' },
    stand: { type: String, required: true },
    section: { type: String, required: true },
    seats: [{
            row: { type: String, required: true },
            userSeats: [{ type: Number }]
        }],
    ticketCount: { type: Number, required: true },
    price: { type: Number, required: true },
    paymentType: { type: String, required: true },
    coupon: { type: Boolean, default: false },
    qrCode: { type: String, required: true },
    isCancelled: { type: Boolean, default: false },
    cancelledDate: { type: Date }
}, {
    timestamps: true
});
const TicketModel = mongoose_1.default.model('Ticket', TicketSchema);
exports.default = TicketModel;
