import CartRepo from "../../useCase/interface/cartRepo";
import CartModel from "../db/cartModel";

class CartRepository implements CartRepo {
    async save(data: any): Promise<{}> {
        const cart = new CartModel(data);
        await cart.save();
        return cart;
    }
}

export default CartRepository;
