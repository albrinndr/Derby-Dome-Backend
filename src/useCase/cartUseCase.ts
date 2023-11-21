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

        
        const totalSeats = bookingData.section == 'premium' ?
            this.GenerateSeats.generateSeatNumbers(
                'C', sectionData.C.count || 0, 'D', sectionData.D.count || 0, bookingData.ticketCount,
                sectionData.C.seats, sectionData.D.seats) : this.GenerateSeats.generateSeatNumbers(
                    'E', sectionData.E.count || 0, 'F', sectionData.F.count || 0, bookingData.ticketCount,
                    sectionData.E.seats, sectionData.F.seats);

        
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

    async addToCartPremium(bookingData: CartI) {
        const seatsPrices = await this.StadiumRepository.getSeatPrices();
        const stadiumStandPrice = seatsPrices[bookingData.stand as keyof typeof seatsPrices];
        const stadiumSeatPrice = stadiumStandPrice[bookingData.section];
        const cartData = {
            userId: bookingData.userId,
            fixtureId: bookingData.fixtureId,
            stand: bookingData.stand,
            section: bookingData.section,
            seats: bookingData.seats,
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
