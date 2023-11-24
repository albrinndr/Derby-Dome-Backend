import CouponI from "../domain/coupon";
import CouponRepository from "../infrastructure/repository/couponRepository";

class CouponUseCase {
    private CouponRepository: CouponRepository;
    constructor(CouponRepository: CouponRepository) {
        this.CouponRepository = CouponRepository;
    }

    async addCoupon(data: CouponI) {
        const couponExist = await this.CouponRepository.findByName(data.name);
        if (!couponExist) {
            const coupon = await this.CouponRepository.save(data);
            return {
                status: 200,
                data: coupon
            };
        } else {
            return {
                status: 400,
                data: { message: 'Coupon Already Exists!' }
            };
        }

    }

    async findAllCoupons() {
        const coupons = await this.CouponRepository.findAllCoupons();
        return {
            status: 200,
            data: coupons
        };
    }

    async editCoupon(data: CouponI) {
        if (data.id) {
            const couponExist = await this.CouponRepository.findByNameForEdit(data.name, data.id);
            if (!couponExist) {
                const coupon: CouponI = await this.CouponRepository.findById(data.id);
                if (coupon) {
                    coupon.name = data.name || coupon.name;
                    coupon.desc = data.desc || coupon.desc;
                    coupon.discount = data.discount || coupon.discount;
                    coupon.minPrice = data.minPrice || coupon.minPrice;
                    coupon.startingDate = data.startingDate || coupon.startingDate;
                    coupon.endingDate = data.endingDate || coupon.endingDate;

                    const updatedCoupon = await this.CouponRepository.save(coupon);
                    return {
                        status: 200,
                        data: updatedCoupon
                    };
                } else {
                    return {
                        status: 400,
                        data: { message: 'An error occurred! Please try again!' }
                    };
                }
            } else {
                return {
                    status: 400,
                    data: { message: 'Coupon name already exists!' }
                };
            }
        } else {
            return {
                status: 400,
                data: { message: 'An error occurred! Please try again!' }
            };
        }
    }

    async deleteCoupon(id: string) {
        const deleted = await this.CouponRepository.deleteCoupon(id);
        if (deleted) {
            return {
                status: 200,
                data: 'Coupon Deleted'
            };
        } else {
            return {
                status: 400,
                data: { message: 'An error occurred! Please try again!' }
            };
        }
    }
}
export default CouponUseCase;
