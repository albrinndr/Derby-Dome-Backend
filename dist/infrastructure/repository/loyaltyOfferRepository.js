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
const loyaltyOfferModel_1 = __importDefault(require("../db/loyaltyOfferModel"));
class LoyaltyOfferRepository {
    save(offer) {
        return __awaiter(this, void 0, void 0, function* () {
            const newOffer = new loyaltyOfferModel_1.default(offer);
            yield newOffer.save();
            return newOffer;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const offer = yield loyaltyOfferModel_1.default.findOne({ _id: id });
                if (offer)
                    return offer;
                return false;
            }
            catch (error) {
                return false;
            }
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const offers = yield loyaltyOfferModel_1.default.find();
                return offers;
            }
            catch (error) {
                return [];
            }
        });
    }
    deleteOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleted = yield loyaltyOfferModel_1.default.deleteOne({ _id: id });
                if (deleted)
                    return true;
                return false;
            }
            catch (error) {
                return false;
            }
        });
    }
}
exports.default = LoyaltyOfferRepository;
