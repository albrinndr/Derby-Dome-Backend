import CouponI from "../domain/coupon";
import LoyaltyOfferI from "../domain/loyaltyOffer";
import CouponRepository from "../infrastructure/repository/couponRepository";
import LoyaltyOfferRepository from "../infrastructure/repository/loyaltyOfferRepository";
import UserRepository from "../infrastructure/repository/userRepository";
import GenerateCoupon from "../infrastructure/services/generateCoupon";

class LoyaltyOfferUseCase {
    private LoyaltyOfferRepository: LoyaltyOfferRepository;
    private UserRepository: UserRepository;
    private CouponRepository: CouponRepository;
    private GenerateCoupon: GenerateCoupon;
    constructor(
        LoyaltyOfferRepository: LoyaltyOfferRepository,
        CouponRepository: CouponRepository,
        GenerateCoupon: GenerateCoupon,
        UserRepository: UserRepository
    ) {
        this.LoyaltyOfferRepository = LoyaltyOfferRepository;
        this.CouponRepository = CouponRepository;
        this.GenerateCoupon = GenerateCoupon;
        this.UserRepository = UserRepository;
    }

    async addNewOffer(offer: LoyaltyOfferI) {
        const newOffer = await this.LoyaltyOfferRepository.save(offer);
        return {
            status: 200,
            data: newOffer
        };
    }

    async editOffer(id: string, discount?: number, coins?: number, minPrice?: number) {
        const currOffer: LoyaltyOfferI = await this.LoyaltyOfferRepository.findById(id);
        if (currOffer) {
            currOffer.minPrice = minPrice || currOffer.minPrice;
            currOffer.coins = coins || currOffer.coins;
            currOffer.discount = discount || currOffer.discount;
            const updatedOffer = await this.LoyaltyOfferRepository.save(currOffer);
            return {
                status: 200,
                data: updatedOffer
            };
        } else {
            return {
                status: 200,
                data: { message: 'Invalid operation' }
            };
        }
    }

    async deleteOffer(id: string) {
        const deleted = await this.LoyaltyOfferRepository.deleteOne(id);
        if (deleted) {
            return {
                status: 200,
                data: 'Offer removed!'
            };
        } else {
            return {
                status: 200,
                data: { message: 'Invalid operation' }
            };
        }
    }


    async allOffers() {
        const offers = await this.LoyaltyOfferRepository.findAll();
        return {
            status: 200,
            data: offers
        };
    }

    async createOfferCoupon(userId: string, offerId: string) {
        const coupons = await this.CouponRepository.findAllCouponsForLoyalty();
        const name = await this.GenerateCoupon.createUniqueCoupon(coupons);
        const offer = await this.LoyaltyOfferRepository.findById(offerId);
        const user = await this.UserRepository.findById(userId);
        if (user && user.loyaltyCoins >= offer.coins) {

            const startingDate = new Date();
            startingDate.setHours(0, 0, 0, 0);

            const endingDate = new Date(startingDate.getTime() + 20 * 24 * 60 * 60 * 1000);

            const newCoupon: CouponI = {
                name,
                desc: `₹${offer.discount} OFF on purchase above ${offer.minPrice}`,
                minPrice: offer.minPrice,
                discount: offer.discount,
                startingDate,
                endingDate,
                isLoyalty: true,
                loyaltyId: userId.toString(),
                loyaltyUsed: false
            };

            const coupon = await this.CouponRepository.save(newCoupon);
            const user = await this.UserRepository.findById(userId);
            if (user) {
                user.loyaltyCoins = user.loyaltyCoins - offer.coins;
                await this.UserRepository.save(user);
            }
            return {
                status: 200,
                data: coupon
            };
        } else {
            return {
                status: 400,
                data: { message: 'Insufficient derby coins!' }
            };
        }
    }

    async userCoinRedeem(userId: string) {
        const coupons = await this.CouponRepository.findUserAvailableLoyaltyCoupons(userId);
        const offers = await this.LoyaltyOfferRepository.findAll();
        return {
            status: 200,
            data: {
                offers,
                coupons
            }
        };
    }

}

export default LoyaltyOfferUseCase;
