import GenCouponI from "../../useCase/interface/genCoupon";
import CouponI from "../../domain/coupon";

class GenerateCoupon implements GenCouponI {
    generateCouponName(): string {
        const length = 6;
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }

        return result;
    }

    async createUniqueCoupon(coupons: CouponI[]): Promise<any> {
        let newCoupon = this.generateCouponName();
        const couponNames = coupons.map((coupon: CouponI) => coupon.name);

        // Ensure generated coupon is unique
        while (couponNames.includes(newCoupon)) {
            newCoupon = this.generateCouponName();
        }

        return newCoupon;
    }
}

export default GenerateCoupon;
