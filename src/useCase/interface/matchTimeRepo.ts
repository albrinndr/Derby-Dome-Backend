import MatchTime from "../../domain/matchTime";

interface MatchTimeRepo {
    save(time: MatchTime): Promise<MatchTime>;
    findByTime(time:string):Promise<MatchTime | null>;
    // findById(_id: string): Promise<MatchTime | null>;
    // findAll(): Promise<{}[] | null>;
}
export default MatchTimeRepo;
