import Club, { Manager, Player, Team } from "../../domain/club";


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
}

export default ClubRepo;
