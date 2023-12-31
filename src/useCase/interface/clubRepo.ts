import Club, { Manager, NotificationI, Player, Team } from "../../domain/club";


interface ClubRepo {
    save(club: Club): Promise<Club>;
    findByEmail(email: string): Promise<Club | null>;
    findById(_id: string): Promise<Club | null>;
    findAllClubs(): Promise<{}[] | null>;
    findTeamById(clubId: string): Promise<Team | {}>;
    addManager(clubId: string, data: Manager): Promise<any>;
    editManager(clubId: string, data: Manager): Promise<any>;
    addPlayer(clubId: string, data: Player): Promise<any>;
    editPlayer(clubId: string, playerId: string, data: Player): Promise<any>;
    deletePlayer(clubId: string, playerId: string): Promise<any>;
    swapStartingXI(clubId: string, player1Id: string, player2Id: string): Promise<any>;
    findTeamPlayerCount(clubId: string): Promise<boolean>;
    followClub(userId: string, clubId: string): Promise<any>;
    sendNotification(clubId: string, notification: NotificationI): Promise<any>;
    removeNotification(fixtureId: string, clubId: string): Promise<any>;
    findUserNotifications(userId: string): Promise<{}[]>;
    readNotification(userId: string): Promise<any>;
    userFollowedClubs(userId: string): Promise<any>
}

export default ClubRepo;
