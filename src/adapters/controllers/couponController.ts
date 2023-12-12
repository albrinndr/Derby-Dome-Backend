import { Request, Response } from "express";
import CouponUseCase from "../../useCase/couponUseCase";

class CouponController {
    private CouponCase: CouponUseCase;
    constructor(CouponCase: CouponUseCase) {
        this.CouponCase = CouponCase;
    }

    async addCoupon(req: Request, res: Response) {
        try {
            const result = await this.CouponCase.addCoupon(req.body);
            res.status(result.status).json(result.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async getAllCoupons(req: Request, res: Response) {
        try {
            const result = await this.CouponCase.findAllCoupons();
            res.status(result.status).json(result.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async editCoupon(req: Request, res: Response) {
        try {
            const result = await this.CouponCase.editCoupon(req.body);
            res.status(result.status).json(result.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async deleteCoupon(req: Request, res: Response) {
        try {
            const result = await this.CouponCase.deleteCoupon(req.params.id);
            res.status(result.status).json(result.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }

    async validateCoupon(req: Request, res: Response) {
        try {
            const userId = req.userId || '';
            const { coupon, price } = req.body;
            const result = await this.CouponCase.couponValidateForCheckout(userId, coupon, price);
            res.status(result.status).json(result.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }
}
export default CouponController;
