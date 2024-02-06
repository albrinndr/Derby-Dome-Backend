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
const couponModel_1 = __importDefault(require("../db/couponModel"));
class CouponRepository {
    save(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const coupon = new couponModel_1.default(data);
            yield coupon.save();
            return coupon;
        });
    }
    findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const coupon = yield couponModel_1.default.findOne({ name });
                if (coupon)
                    return true;
                return false;
            }
            catch (error) {
                return false;
            }
        });
    }
    findAllCoupons() {
        return __awaiter(this, void 0, void 0, function* () {
            let coupons = yield couponModel_1.default.find();
            coupons = coupons.filter((coupon) => !coupon.isLoyalty);
            return coupons;
        });
    }
    findByNameForEdit(name, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const coupon = yield couponModel_1.default.findOne({ _id: { $ne: id }, name });
                if (coupon)
                    return true;
                return false;
            }
            catch (error) {
                return false;
            }
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const coupon = yield couponModel_1.default.findOne({ _id: id });
            return coupon;
        });
    }
    deleteCoupon(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleted = yield couponModel_1.default.deleteOne({ _id: id });
                if (deleted)
                    return true;
                return false;
            }
            catch (error) {
                return false;
            }
        });
    }
    findByNameForCheckout(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const coupon = yield couponModel_1.default.findOne({ name });
                if (coupon)
                    return coupon;
                return false;
            }
            catch (error) {
                return false;
            }
        });
    }
    applyCoupon(userId, name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const coupon = yield couponModel_1.default.updateOne({ name }, { $push: { users: userId } });
                if (coupon)
                    return true;
                return false;
            }
            catch (error) {
                return false;
            }
        });
    }
    findAvailableCoupons() {
        return __awaiter(this, void 0, void 0, function* () {
            const currDate = new Date();
            let coupons = yield couponModel_1.default.find({
                $and: [
                    { startingDate: { $lte: currDate } },
                    { endingDate: { $gte: currDate } }
                ]
            });
            coupons = coupons.filter((coupon) => !coupon.isLoyalty);
            return coupons;
        });
    }
    // loyalty coupons
    findAllCouponsForLoyalty() {
        return __awaiter(this, void 0, void 0, function* () {
            const coupons = yield couponModel_1.default.find();
            return coupons;
        });
    }
    findUserAvailableLoyaltyCoupons(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let coupons = yield couponModel_1.default.find({
                    isLoyalty: true, loyaltyId: userId.toString(), endingDate: { $gt: new Date() }
                });
                return coupons;
            }
            catch (error) {
                return [];
            }
        });
    }
    applyLoyaltyCoupon(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const coupon = yield couponModel_1.default.deleteOne({ name });
                if (coupon)
                    return true;
                return false;
            }
            catch (error) {
                return false;
            }
        });
    }
}
exports.default = CouponRepository;
