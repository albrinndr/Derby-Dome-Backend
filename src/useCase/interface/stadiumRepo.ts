import Stadium, { Time } from "../../domain/stadium";

interface StadiumRepo {
    saveTime(time: Time): Promise<Stadium>;
    findByTime(time: string): Promise<Stadium | null>;
    findAllTime(): Promise<{}[] | null>;
    updatePrice(id: string, price: number): Promise<any>;
    findTimeById(id: string): Promise<Stadium | null>;
    deleteMatchTime(id: string): Promise<any>;
    seatPriceSave(stand: string, seatName: string, price: number): Promise<any>;
    getAllSeats(): Promise<[]>;
    getSeatPrices(): Promise<{}>;
    userReview(userId: string, rating: number, review: string): Promise<any>;
    removeReview(userId: string): Promise<boolean>;
    allReviews(): Promise<{}[]>;
    singleUserReview(userId: string): Promise<[any]>;
}
export default StadiumRepo;
