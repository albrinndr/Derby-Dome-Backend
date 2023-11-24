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

    async couponValidateForCheckout(userId: string, name: string, price: number) {
        const coupon: CouponI = await this.CouponRepository.findByNameForCheckout(name);
        if (coupon) {
            if ((new Date(coupon.startingDate) > new Date()) || (new Date() > new Date(coupon.endingDate))) {
                return {
                    status: 400,
                    data: { message: 'Coupon expired!' }
                };
            }
            else if (coupon.users && coupon.users.includes(userId)) {
                return {
                    status: 400,
                    data: { message: 'Coupon already used!' }
                };
            } else if (price < coupon.minPrice) {
                return {
                    status: 400,
                    data: { message: `Minimum purchase should be ₹${coupon.minPrice}` }
                };
            } else {
                return {
                    status: 200,
                    data: coupon
                };
            }
        } else {
            return {
                status: 400,
                data: { message: "Coupon doesn't exist!" }
            };
        }
    }
}
export default CouponUseCase;
