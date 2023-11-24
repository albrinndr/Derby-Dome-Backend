import CouponI from "../../domain/coupon";

interface CouponRepo {
    save(data: CouponI): Promise<CouponI>;
    findByName(name: string): Promise<boolean>;
    findAllCoupons(): Promise<{}[]>;
    findByNameForEdit(name: string, id: string): Promise<boolean>;
    findById(id: string): Promise<any>;
    deleteCoupon(id: string): Promise<any>;
}
export default CouponRepo;
