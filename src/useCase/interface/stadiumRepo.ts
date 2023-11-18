import Stadium, { Time } from "../../domain/stadium";

interface StadiumRepo {
    saveTime(time: Time): Promise<Stadium>;
    findByTime(time: string): Promise<Stadium | null>;
    findAllTime(): Promise<{}[] | null>;
    updatePrice(id: string, price: number): Promise<any>;
    findTimeById(id: string): Promise<Stadium | null>;
    deleteMatchTime(id: string): Promise<any>;
    seatPriceSave(stand:string,seatName: string, price: number): Promise<any>;
    getAllSeats(): Promise<[]>;
}
export default StadiumRepo;
