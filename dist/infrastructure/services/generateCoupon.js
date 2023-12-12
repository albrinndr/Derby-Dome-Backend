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
class GenerateCoupon {
    generateCouponName() {
        const length = 6;
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }
        return result;
    }
    createUniqueCoupon(coupons) {
        return __awaiter(this, void 0, void 0, function* () {
            let newCoupon = this.generateCouponName();
            const couponNames = coupons.map((coupon) => coupon.name);
            // Ensure generated coupon is unique
            while (couponNames.includes(newCoupon)) {
                newCoupon = this.generateCouponName();
            }
            return newCoupon;
        });
    }
}
exports.default = GenerateCoupon;
