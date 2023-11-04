import Stadium, { Time } from "../../domain/stadium";

interface StadiumRepo {
    saveTime(time: Time): Promise<Stadium>;
    findByTime(time: string): Promise<Stadium | null>;
    findAllTime(): Promise<{}[] | null>;
    updateNewPrice(id: string, price: number): Promise<any>;
    updatePrice(id: string, price: number): Promise<any>;
    findTimeById(id: string): Promise<Stadium | null>;
    setMatchDelete(id: string): Promise<any>;
    deleteMatchTime(id: string): Promise<any>;
    seatPriceSave(name: string, price: number): Promise<any>;
}
export default StadiumRepo;
