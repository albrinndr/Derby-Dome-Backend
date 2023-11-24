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
        const coupons = await CouponModel.find();
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
}
export default CouponRepository;