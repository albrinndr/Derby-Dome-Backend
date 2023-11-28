import AdminRepository from "../infrastructure/repository/adminRepository";
import UserRepository from "../infrastructure/repository/userRepository";
import ClubRepository from "../infrastructure/repository/clubRepository";
import Admin from "../domain/admin";
import Encrypt from "../infrastructure/services/bcryptPassword";
import JWTToken from "../infrastructure/services/generateToken";
import FixtureRepository from "../infrastructure/repository/fixtureRepository";
import TicketRepository from "../infrastructure/repository/ticketRepository";

type UserType = {
    _id: string;
    name: string;
    email: string;
    phone: string;
    isBlocked: boolean;
    createdAt: string | Date;
    image?: string;
    isGoogle?: boolean;
    profilePic?: string;
};

class AdminUseCase {
    private AdminRepository: AdminRepository;
    private UserRepository: UserRepository;
    private ClubRepository: ClubRepository;
    private Encrypt: Encrypt;
    private JWTToken: JWTToken;
    private FixtureRepository: FixtureRepository;
    private TicketRepository: TicketRepository;

    constructor(
        AdminRepository: AdminRepository,
        Encrypt: Encrypt, JWTToken: JWTToken,
        UserRepository: UserRepository,
        ClubRepository: ClubRepository,
        FixtureRepository: FixtureRepository,
        TicketRepository: TicketRepository
    ) {

        this.AdminRepository = AdminRepository;
        this.UserRepository = UserRepository;
        this.ClubRepository = ClubRepository;
        this.Encrypt = Encrypt;
        this.JWTToken = JWTToken;
        this.FixtureRepository = FixtureRepository;
        this.TicketRepository = TicketRepository;
    }

    async login(admin: Admin) {
        const adminData = await this.AdminRepository.findByEmail(admin.email);
        if (adminData) {
            const passwordMatch = await this.Encrypt.compare(admin.password, adminData.password);
            if (passwordMatch) {
                const token = this.JWTToken.generateToken(adminData._id);
                return {
                    status: 200,
                    data: {
                        message: 'Logged In',
                        token
                    }
                };
            } else {
                return {
                    status: 400,
                    data: {
                        message: 'Invalid email or password!',
                        token: null
                    }
                };
            }
        } else {
            return {
                status: 400,
                data: {
                    message: 'Invalid email or password!',
                    token: null
                }
            };
        }
    }

    async getUsers() {
        const usersList = await this.UserRepository.findAllUsers();
        let filteredUsersList: UserType[] = [];
        if (usersList) {
            filteredUsersList = usersList.map((user: any) => {
                const date = new Date(user.createdAt as string);
                const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
                const formattedDate = date.toLocaleDateString('en-US', options);
                return {
                    _id: user._id || '',
                    name: user.name || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    isBlocked: user.isBlocked || false,
                    isGoogle: user.isGoogle,
                    createdAt: formattedDate,
                    profilePic: user.profilePic
                };
            });
        }

        return {
            status: 200,
            data: filteredUsersList
        };
    }

    async blockUser(_id: string) {
        const user = await this.UserRepository.findById(_id);
        if (user) {
            user.isBlocked = !user.isBlocked;
            const updatedUser = await this.UserRepository.save(user);
            return {
                status: 200,
                data: updatedUser
            };
        } else {
            return {
                status: 400,
                data: { message: 'User not found!' }
            };
        }
    }

    async getClubs() {
        const clubsList = await this.ClubRepository.findAllClubs();
        let filteredClubsList: UserType[] = [];
        if (clubsList) {
            filteredClubsList = clubsList.map((club: any) => {
                const date = new Date(club.createdAt as string);
                const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
                const formattedDate = date.toLocaleDateString('en-US', options);
                return {
                    _id: club._id || '',
                    name: club.name || '',
                    email: club.email || '',
                    phone: club.phone || '',
                    isBlocked: club.isBlocked || false,
                    createdAt: formattedDate,
                    image: club.image
                };
            });
        }

        return {
            status: 200,
            data: filteredClubsList
        };
    }

    async blockClub(_id: string) {
        const club = await this.ClubRepository.findById(_id);
        if (club) {
            club.isBlocked = !club.isBlocked;
            const updatedClub = await this.ClubRepository.save(club);
            return {
                status: 200,
                data: updatedClub
            };
        } else {
            return {
                status: 400,
                data: { message: 'Club not found!' }
            };
        }
    }

    async dashboardSlotSaleData(year?: string) {
        const salesData = await this.FixtureRepository.slotSaleAdminDashboard(year);
        return {
            status: 200,
            data: {
                years: salesData.displayYears,
                profits: salesData.totalPrices
            }
        };
    };

    async dashboardChartAndCardContent() {
        const seatSections = await this.TicketRepository.sectionSelectionCountAdminDashboard();
        const users = await this.UserRepository.findAllUsers();
        const clubs = await this.ClubRepository.findAllClubs();
        const tickets = await this.TicketRepository.ticketsNotCancelled();
        const fixtures = await this.FixtureRepository.findAllFixturesNotCancelled();
        const totalSales = fixtures.reduce((acc: any, curr: any) => acc += curr.price, 0);

        return {
            status: 200,
            data: {
                sectionData: seatSections,
                users: users?.length || 0,
                clubs: clubs?.length || 0,
                tickets: tickets.length || 0,
                totalSales
            }
        };
    }

    async dashboardTicketSoldData(year?: string) {
        const ticketsSoldData = await this.TicketRepository.ticketSalesDataAdminDashboard(year);
        return {
            status: 200,
            data: {
                years: ticketsSoldData.displayYears,
                count: ticketsSoldData.totalCounts
            }
        };
    }
}

export default AdminUseCase;
