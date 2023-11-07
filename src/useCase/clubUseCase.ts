import Club, { Manager, Player } from "../domain/club";
import ClubRepository from "../infrastructure/repository/clubRepository";
import JWTToken from "../infrastructure/utils/generateToken";
import Encrypt from "../infrastructure/utils/bcryptPassword";

class ClubUseCase {
    private ClubRepository: ClubRepository;
    private Encrypt: Encrypt;
    private JWTToken: JWTToken;
    constructor(ClubRepository: ClubRepository, Encrypt: Encrypt, JWTToken: JWTToken) {
        this.ClubRepository = ClubRepository;
        this.Encrypt = Encrypt;
        this.JWTToken = JWTToken;
    }


    async signUp(email: string) {
        const clubExists = await this.ClubRepository.findByEmail(email);
        if (clubExists) {
            return {
                status: 400,
                data: {
                    status: false,
                    message: "Club already exists!"
                }
            };
        }
        return {
            status: 200,
            data: {
                status: true,
                message: 'Verification otp sent to your email!'
            }
        };
    }

    async verifyClub(club: Club) {
        const hashedPassword = await this.Encrypt.generateHash(club.password);
        const newClub = { ...club, password: hashedPassword };
        await this.ClubRepository.save(newClub);
        return {
            status: 200,
            data: {
                message: "Club registration successful!"
            }
        };
    }

    async login(club: Club) {
        const clubData = await this.ClubRepository.findByEmail(club.email);
        let token = '';
        if (clubData) {
            if (clubData.isBlocked) {
                return {
                    status: 400,
                    data: {
                        message: 'Club is blocked by admin!',
                        token: ''
                    }
                };
            }

            const passwordMatch = await this.Encrypt.compare(club.password, clubData.password);
            if (passwordMatch) {
                const clubId = clubData?._id;
                if (clubId) token = this.JWTToken.generateToken(clubId);
                return {
                    status: 200,
                    data: {
                        club: clubData,
                        token
                    }
                };
            } else {
                return {
                    status: 400,
                    data: {
                        message: 'Invalid email or password!',
                        token: ''
                    }
                };
            }
        } else {
            return {
                status: 400,
                data: {
                    message: 'Invalid email or password!',
                    token: ''
                }
            };
        }
    }

    async profile(_id: string) {
        const club = await this.ClubRepository.findById(_id);
        if (club) {
            return {
                status: 200,
                data: club
            };
        } else {
            return {
                status: 400,
                data: { message: 'Club not found' }
            };
        }
    }

    async updateProfile(id: string, club: Club, newPassword?: string) {
        const clubData = await this.ClubRepository.findById(id);
        if (clubData) {
            clubData.name = club.name || clubData.name;
            clubData.phone = club.phone || clubData.phone;
            clubData.image = club.image || clubData.image;
            clubData.address = club.address || clubData.address;
            clubData.contactPerson = club.contactPerson || clubData.contactPerson;
            clubData.description = club.description || clubData.description;
            if (club.password) {
                const passwordMatch = await this.Encrypt.compare(club.password, clubData.password);
                if (passwordMatch && newPassword) {
                    clubData.password = await this.Encrypt.generateHash(newPassword);
                } else {
                    return {
                        status: 400,
                        data: { message: 'Password does not match!' }
                    };
                }
            }
            const updatedClub = await this.ClubRepository.save(clubData);
            return {
                status: 200,
                data: updatedClub
            };
        } else {
            return {
                status: 400,
                data: { message: 'Club not found' }
            };
        }
    }

    async backgroundUpdate(id: string, bgImg: string) {
        const clubData = await this.ClubRepository.findById(id);
        if (clubData) {
            clubData.bgImg = bgImg;
            const updatedClub = await this.ClubRepository.save(clubData);
            return {
                status: 200,
                data: { bgImg: updatedClub.bgImg }
            };
        } else {
            return {
                status: 400,
                data: { message: 'Club not found' }
            };
        }
    }

    async getTeamData(id: string) {
        const team = await this.ClubRepository.findTeamById(id);
        return {
            status: 200,
            data: team
        };
    }

    async addClubManager(id: string, data: Manager) {
        const manager = await this.ClubRepository.addManager(id, data);
        return {
            status: 200,
            data: manager
        };
    }

    async editClubManager(id: string, data: Manager) {
        const manager = await this.ClubRepository.editManager(id, data);
        return {
            status: 200,
            data: manager
        };
    }

    // async addNewPlayer(id: string, data: Player) {
    //     const result = await this.ClubRepository.addPlayer(id, data);
    //     if (!result) {
    //         return {
    //             status: 400,
    //             data: { message: "Shirt no. already exists!" }
    //         };
    //     } else {
    //         return {
    //             status: 200,
    //             data: result
    //         };
    //     }
    // }
}

export default ClubUseCase;
