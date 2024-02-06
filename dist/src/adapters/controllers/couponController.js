"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class CouponController {
    constructor(CouponCase) {
        this.CouponCase = CouponCase;
    }
    addCoupon(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.CouponCase.addCoupon(req.body);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    getAllCoupons(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.CouponCase.findAllCoupons();
                res.status(result.status).json(result.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    editCoupon(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.CouponCase.editCoupon(req.body);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    deleteCoupon(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.CouponCase.deleteCoupon(req.params.id);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    validateCoupon(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId || '';
                const { coupon, price } = req.body;
                const result = yield this.CouponCase.couponValidateForCheckout(userId, coupon, price);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
}
exports.default = CouponController;
