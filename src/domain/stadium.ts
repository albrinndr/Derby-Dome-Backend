export interface Time {
    id: string;
    time: string,
    price: number,
    showDate?: Date;
}

export interface Seats {
    // vip: number;
    // premium: number;
    // economy: number;
    stand: string,
    price: {
        vip: number;
        premium: number;
        economy: number;
    };
}

interface Stadium {
    timings: [{
        time: string,
        price: number,
        showDate?: Date;
    }],
    // seats: {
    //     north: Seats;
    //     south: Seats;
    //     east: Seats;
    //     west: {
    //         vip: number;
    //         premium: number;
    //     };
    // };
    seats: [{
        stand: string,
        price: {
            vip: number;
            premium: number;
            economy: number;
        };
    }];
}
export default Stadium;
