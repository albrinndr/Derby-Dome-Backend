import LoyaltyOffer from "../../domain/loyaltyOffer";
import LoyaltyRepo from "../../useCase/interface/loyaltyRepo";
import LoyaltyOfferModel from "../db/loyaltyOfferModel";

class LoyaltyOfferRepository implements LoyaltyRepo {
    async save(offer: LoyaltyOffer): Promise<any> {
        const newOffer = new LoyaltyOfferModel(offer);
        await newOffer.save();
        return newOffer;
    }

    async findById(id: string): Promise<any> {
        try {
            const offer = await LoyaltyOfferModel.findOne({ _id: id });
            if (offer) return offer;
            return false;
        } catch (error) {
            return false;
        }
    }

    async findAll(): Promise<{}[]> {
        try {
            const offers = await LoyaltyOfferModel.find();
            return offers;
        } catch (error) {
            return [];
        }
    }

    async deleteOne(id: string): Promise<boolean> {
        try {
            const deleted = await LoyaltyOfferModel.deleteOne({ _id: id });
            if (deleted) return true;
            return false;
        } catch (error) {
            return false;
        }
    }
}

export default LoyaltyOfferRepository;
