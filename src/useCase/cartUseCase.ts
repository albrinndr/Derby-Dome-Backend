import CartI from "../domain/cart";
import CartRepository from "../infrastructure/repository/cartRepository";
import FixtureRepository from "../infrastructure/repository/fixtureRepository";
import StadiumRepository from "../infrastructure/repository/stadiumRepository";
import GenerateSeats from "../infrastructure/services/generateSeats";
import ScheduleTask from "../infrastructure/services/scheduleTask";

interface FixtureSeatCount {
    row1?: string;
    count1?: number;
    row2?: string;
    count2?: number;
}

class CartUseCase {
    private GenerateSeats: GenerateSeats;
    private StadiumRepository: StadiumRepository;
    private FixtureRepository: FixtureRepository;
    private CartRepository: CartRepository;
    private ScheduleTask: ScheduleTask;
    constructor(
        GenerateSeats: GenerateSeats,
        StadiumRepository: StadiumRepository,
        FixtureRepository: FixtureRepository,
        CartRepository: CartRepository,
        ScheduleTask: ScheduleTask
    ) {
        this.GenerateSeats = GenerateSeats;
        this.StadiumRepository = StadiumRepository;
        this.FixtureRepository = FixtureRepository;
        this.CartRepository = CartRepository;
        this.ScheduleTask = ScheduleTask;
    }


    async addToCart(bookingData: CartI) {
        const seatsPrices = await this.StadiumRepository.getSeatPrices();
        const fixtureFullData = await this.FixtureRepository.findByIdNotCancelled(bookingData.fixtureId);
        const fixtureData = fixtureFullData.seats;
        const sectionData = fixtureData[bookingData.stand][bookingData.section];

        //setting up the seats
        const fixtureSeat: FixtureSeatCount = {};
        let count = 1 as 1 | 2;
        for (const row in sectionData) {
            if (sectionData.hasOwnProperty(row)) {
                const key = count === 1 ? `row1` : `row2`;
                const value = count === 1 ? `count1` : `count2`;
                fixtureSeat[key] = row;
                fixtureSeat[value] = sectionData[row];
                count++;
            }
        }

        const totalSeats = this.GenerateSeats.generateSeatNumbers(
            fixtureSeat.row1 || 'A', fixtureSeat.count1 || 0,
            fixtureSeat.row2 || 'B', fixtureSeat.count2 || 0, bookingData.ticketCount);


        //user seat price
        const stadiumStandPrice = seatsPrices[bookingData.stand as keyof typeof seatsPrices];
        const stadiumSeatPrice = stadiumStandPrice[bookingData.section];

        const cartData = {
            userId: bookingData.userId,
            fixtureId: bookingData.fixtureId,
            stand: bookingData.stand,
            section: bookingData.section,
            seats: totalSeats,
            ticketCount: bookingData.ticketCount,
            price: bookingData.ticketCount * stadiumSeatPrice
        };

        await this.CartRepository.deleteByUserId(bookingData.userId);
        const cart: any = await this.CartRepository.save(cartData);
        await this.ScheduleTask.removeFromCart(() => this.CartRepository.deleteByCartId(cart._id));

        return {
            status: 200,
            data: cart
        };
    }
}

export default CartUseCase;
