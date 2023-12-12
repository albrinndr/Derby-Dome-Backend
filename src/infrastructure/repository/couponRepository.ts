import CouponI from "../../domain/coupon";
import CouponRepo from "../../useCase/interface/couponRepo";
import CouponModel from "../db/couponModel";

class CouponRepository implements CouponRepo {
    async save(data: CouponI): Promise<CouponI> {
        const coupon = new CouponModel(data);
        await coupon.save();
        return coupon;
    }

    async findByName(name: string): Promise<boolean> {
        try {
            const coupon = await CouponModel.findOne({ name });
            if (coupon) return true;
            return false;
        } catch (error) {
            return false;
        }
    }
    async findAllCoupons(): Promise<{}[]> {
        let coupons = await CouponModel.find();
        coupons = coupons.filter((coupon) => !coupon.isLoyalty);
        return coupons;
    }

    async findByNameForEdit(name: string, id: string): Promise<boolean> {
        try {
            const coupon = await CouponModel.findOne({ _id: { $ne: id }, name });
            if (coupon) return true;
            return false;
        } catch (error) {
            return false;
        }
    }
    async findById(id: string): Promise<any> {
        const coupon = await CouponModel.findOne({ _id: id });
        return coupon;
    }

    async deleteCoupon(id: string): Promise<any> {
        try {
            const deleted = await CouponModel.deleteOne({ _id: id });
            if (deleted) return true;
            return false;
        } catch (error) {
            return false;
        }
    }

    async findByNameForCheckout(name: string): Promise<any> {
        try {
            const coupon = await CouponModel.findOne({ name });
            if (coupon) return coupon;
            return false;
        } catch (error) {
            return false;
        }
    }

    async applyCoupon(userId: string, name: string): Promise<boolean> {
        try {
            const coupon = await CouponModel.updateOne(
                { name },
                { $push: { users: userId } }
            );
            if (coupon) return true;
            return false;
        } catch (error) {
            return false;
        }
    }

    async findAvailableCoupons(): Promise<{}[]> {
        const currDate = new Date();
        let coupons = await CouponModel.find({
            $and: [
                { startingDate: { $lte: currDate } },
                { endingDate: { $gte: currDate } }
            ]
        });
        coupons = coupons.filter((coupon) => !coupon.isLoyalty);
        return coupons;
    }

    // loyalty coupons
    async findAllCouponsForLoyalty(): Promise<any> {
        const coupons = await CouponModel.find();
        return coupons;
    }

    async findUserAvailableLoyaltyCoupons(userId: string): Promise<any> {
        try {
            let coupons = await CouponModel.find({
                isLoyalty: true, loyaltyId: userId.toString(), endingDate: { $gt: new Date() }
            });
            return coupons;
        } catch (error) {
            return [];
        }
    }

    async applyLoyaltyCoupon(name: string): Promise<boolean> {
        try {
            const coupon = await CouponModel.deleteOne(
                { name }
            );
            if (coupon) return true;
            return false;
        } catch (error) {
            return false;
        }
    }

}
export default CouponRepository;
