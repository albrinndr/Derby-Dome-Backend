import LoyaltyOfferI from "../../domain/loyaltyOffer";

interface LoyaltyRepo {
    save(offer: LoyaltyOfferI): Promise<any>;
    findById(id: string): Promise<any>;
    findAll(): Promise<{}[]>;
    deleteOne(id: string): Promise<boolean>;
}

export default LoyaltyRepo;
