import CartRepo from "../../useCase/interface/cartRepo";
import CartModel from "../db/cartModel";

type StandType = 'north' | 'south' | 'east' | 'west';

interface SectionCounts {
    vip: number;
    economy: number;
    premium: number;
}

interface StandCounts {
    [key: string]: SectionCounts;
}

class CartRepository implements CartRepo {
    async save(data: any): Promise<{}> {
        const cart = new CartModel(data);
        await cart.save();
        return cart;
    }

    async cartDataForBooking(userId: string, fixtureId: string): Promise<any> {
        //normal finding for the total counting
        const documents = await CartModel.find({ userId: { $ne: userId }, fixtureId })
            .select('stand section ticketCount seats')
            .lean()
            .exec();

        const standCounts: StandCounts = {
            north: { vip: 0, economy: 0, premium: 0 },
            south: { vip: 0, economy: 0, premium: 0 },
            east: { vip: 0, economy: 0, premium: 0 },
            west: { vip: 0, economy: 0, premium: 0 },
        };

        documents.forEach((doc) => {
            const { stand, section, ticketCount }: { stand: StandType; section: keyof SectionCounts; ticketCount: number; } = doc as {
                stand: StandType;
                section: keyof SectionCounts;
                ticketCount: number;
            };
            if (standCounts[stand]) {
                standCounts[stand][section] += ticketCount;
            }
        });


        const vipDocuments = await CartModel.find({ userId: { $ne: userId }, fixtureId })
            .select('stand section seats')
            .lean()
            .exec();

        const vipCartSeats: Record<string, any> = {
            north: { A: [], B: [] },
            south: { A: [], B: [] },
            east: { A: [], B: [] },
            west: { A: [], B: [] },
        };

        vipDocuments.forEach((doc: any) => {
            const { stand, section, seats } = doc;

            if (stand === 'north') {
                seats.forEach((seat: any) => {
                    if (seat.row === 'A') vipCartSeats.north.A = seat.userSeats;
                    if (seat.row === 'B') vipCartSeats.north.B = seat.userSeats;
                });
            }
            if (stand === 'east') {
                seats.forEach((seat: any) => {
                    if (seat.row === 'A') vipCartSeats.east.A = seat.userSeats;
                    if (seat.row === 'B') vipCartSeats.east.B = seat.userSeats;
                });
            }
            if (stand === 'south') {
                seats.forEach((seat: any) => {
                    if (seat.row === 'A') vipCartSeats.south.A = seat.userSeats;
                    if (seat.row === 'B') vipCartSeats.south.B = seat.userSeats;
                });
            }
            if (stand === 'west') {
                seats.forEach((seat: any) => {
                    if (seat.row === 'A') vipCartSeats.west.A = seat.userSeats;
                    if (seat.row === 'B') vipCartSeats.west.B = seat.userSeats;
                });
            }
        });


        return { standCounts, vipCartSeats };
    }


    async deleteByUserId(userId: string): Promise<any> {
        try {
            const userCart = await CartModel.findOne({ userId });
            if (userCart) {
                await CartModel.deleteOne({ userId });
            }
        } catch (error) {

        }
    }

    async deleteByCartId(id: any): Promise<any> {
        try {
            const cart = await CartModel.findOne({ _id: id });
            if (cart) {
                await CartModel.deleteOne({ _id: id });
            }
        } catch (error) {

        }
    }
}

export default CartRepository;
