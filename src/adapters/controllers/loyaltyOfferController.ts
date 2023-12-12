import { Request, Response } from "express";
import LoyaltyOfferUseCase from "../../useCase/loyaltyOfferUseCase";

class LoyaltyOfferController {
    private LoyaltyOfferCase: LoyaltyOfferUseCase;
    constructor(LoyaltyOfferCase: LoyaltyOfferUseCase) {
        this.LoyaltyOfferCase = LoyaltyOfferCase;
    }

    async addNewOffer(req: Request, res: Response) {
        try {
            const offer = await this.LoyaltyOfferCase.addNewOffer(req.body);
            res.status(offer.status).json(offer.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async editOffer(req: Request, res: Response) {
        try {
            const { id, discount, coins, minPrice } = req.body;
            const offer = await this.LoyaltyOfferCase.editOffer(id, discount, coins, minPrice);
            res.status(offer.status).json(offer.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async deleteOffer(req: Request, res: Response) {
        try {
            const offer = await this.LoyaltyOfferCase.deleteOffer(req.params.id);
            res.status(offer.status).json(offer.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async allOffers(req: Request, res: Response) {
        try {
            const offer = await this.LoyaltyOfferCase.allOffers();
            res.status(offer.status).json(offer.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async userCoinRedeem(req: Request, res: Response) {
        try {
            const result = await this.LoyaltyOfferCase.userCoinRedeem(req.userId as string);
            res.status(result.status).json(result.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    };

    async createUserCoupon(req: Request, res: Response) {
        try {
            const coupon = await this.LoyaltyOfferCase.createOfferCoupon(req.userId as string, req.body.id);
            res.status(coupon.status).json(coupon.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

}

export default LoyaltyOfferController;
