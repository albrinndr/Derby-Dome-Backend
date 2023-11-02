export interface Time {
    id: string;
    time: string,
    price: number,
    delete?: boolean,
    newPrice?: number,
    changeDate?: Date;
}

interface Stadium {
    timings: [{
        time: string,
        price: number,
        delete?: boolean,
        newPrice?: number,
        changeDate?: Date;
    }];
}
export default Stadium;
