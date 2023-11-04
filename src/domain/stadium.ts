export interface Time {
    id: string;
    time: string,
    price: number,
    delete?: boolean,
    newPrice?: number,
    changeDate?: Date;
}

export interface Seats {
    stand: string,
    price: number;
}

interface Stadium {
    timings: [{
        time: string,
        price: number,
        delete?: boolean,
        newPrice?: number,
        changeDate?: Date;
    }],
    seats: [{
        stand: string,
        price: number;
    }];
}
export default Stadium;
