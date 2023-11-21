export interface SeatData {
    seats: number[],
    count: 50;
}
export interface NormalSeatData {
    seats: number[];
    count: 100;
}

export interface StandSeats {
    vip: {
        A: SeatData;
        B: SeatData;
    };
    premium: {
        C: NormalSeatData;
        D: NormalSeatData;
    };
    economy: {
        E: NormalSeatData;
        F: NormalSeatData;
    };
}

export interface FixtureSeats {
    north: StandSeats;
    south: StandSeats;
    east: StandSeats;
    west: {
        vip: {
            A: SeatData;
            B: SeatData;
        };
        premium: {
            C: NormalSeatData;
            D: NormalSeatData;
        };
    };
}

interface Fixture {
    title?: string;
    clubId?: string;
    awayTeamId?: string;
    awayTeam?: string;
    awayTeamLogo?: string;
    date?: Date;
    time?: string;
    dateTime?: Date;
    poster?: string;
    status?: string;
    rescheduled?: boolean;
    price?: number;
    checkDate?: Date;
    seats?: FixtureSeats;
}

export default Fixture;
