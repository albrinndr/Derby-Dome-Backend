import { Request, Response } from "express";
import CartUseCase from "../../useCase/cartUseCase";
import CartI from "../../domain/cart";

class CartController {
    private cartCase: CartUseCase;
    constructor(cartCase: CartUseCase) {
        this.cartCase = cartCase;
    }

    async addToCart(req: Request, res: Response) {
        try {
            const data: CartI = {
                userId: req.userId || '',
                fixtureId: req.body.fixtureId,
                stand: req.body.stand,
                section: req.body.section,
                ticketCount: req.body.ticketCount
            };

            const result = await this.cartCase.addToCart(data);
            res.status(result.status).json(result.data);
        } catch (error) {
            const err: Error = error as Error;
            res.status(400).json(err.message);
        }
    }
}

export default CartController;
