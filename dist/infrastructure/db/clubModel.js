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
const ClubSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    image: { type: String, required: true },
    password: { type: String, required: true },
    isBlocked: { type: Boolean, default: false },
    address: { type: String, required: true },
    contactPerson: { type: String, required: true },
    description: { type: String, required: true },
    bgImg: { type: String, default: 'https://res.cloudinary.com/ddzzicdji/image/upload/v1699006744/club-banners/vdwaui8m3bom4cmgohdy.webp' },
    team: {
        manager: {
            name: { type: String },
            image: { type: String }
        },
        players: [
            {
                name: { type: String },
                shirtNo: { type: Number },
                position: { type: String },
                image: { type: String },
                startingXI: { type: Boolean }
            }
        ]
    },
    followers: [{ type: String }],
    notifications: [{
            fixtureId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Fixture' },
            message: { type: String },
            isRead: [{ type: String }],
            date: { type: Date, default: new Date() }
        }]
}, {
    timestamps: true
});
const ClubModel = mongoose_1.default.model('Club', ClubSchema);
exports.default = ClubModel;
