interface Fixture {
    id: string;
    clubId: string;
    awayTeamId?: string;
    awayTeam?: string;
    date: Date;
    time: string;
    poster: string;
    dateTime?: Date;
}

export default Fixture;
