import CouponI from "../../domain/coupon";

interface GenCouponI {
    generateCouponName(): string;
    createUniqueCoupon(coupons: CouponI[]): Promise<string>;

}

export default GenCouponI;
