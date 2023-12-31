import express from 'express';
import AdminRepository from '../repository/adminRepository';
import UserRepository from '../repository/userRepository';
import ClubRepository from '../repository/clubRepository';
import BannerRepository from '../repository/bannerRepository';
import StadiumRepository from '../repository/stadiumRepository';
import AdminUseCase from '../../useCase/adminUseCase';
import BannerUseCase from '../../useCase/bannerUseCase';
import StadiumUseCase from '../../useCase/stadiumUseCase';
import AdminController from '../../adapters/controllers/adminController';
import BannerController from '../../adapters/controllers/bannerController';
import StadiumController from '../../adapters/controllers/stadiumController';
import JWTToken from '../services/generateToken';
import Encrypt from '../services/bcryptPassword';
import CloudinaryUpload from '../utils/cloudinaryUpload';
import { protect } from '../middleware/adminAuth';
import { ImageUpload } from '../middleware/multer';
import ScheduleTask from '../services/scheduleTask';
import FixtureRepository from '../repository/fixtureRepository';
import CouponRepository from '../repository/couponRepository';
import CouponUseCase from '../../useCase/couponUseCase';
import CouponController from '../../adapters/controllers/couponController';
import TicketRepository from '../repository/ticketRepository';
import TicketUseCase from '../../useCase/ticketUseCase';
import CartRepository from '../repository/cartRepository';
import GenerateQRCode from '../services/generateQrCode';
import PaymentRepository from '../repository/paymentRepository';
import GenerateEmail from '../services/sendMail';
import TicketController from '../../adapters/controllers/ticketController';
import GenerateCoupon from '../services/generateCoupon';
import LoyaltyOfferRepository from '../repository/loyaltyOfferRepository';
import LoyaltyOfferUseCase from '../../useCase/loyaltyOfferUseCase';
import LoyaltyOfferController from '../../adapters/controllers/loyaltyOfferController';

const encrypt = new Encrypt();
const jwt = new JWTToken();
const cloudinary = new CloudinaryUpload();
const schedule = new ScheduleTask();
const generateQrCode = new GenerateQRCode();
const generateEmail = new GenerateEmail();
const generateCoupon = new GenerateCoupon();

const adminRepository = new AdminRepository();
const userRepository = new UserRepository();
const clubRepository = new ClubRepository();
const bannerRepository = new BannerRepository();
const stadiumRepository = new StadiumRepository();
const fixtureRepository = new FixtureRepository();
const couponRepository = new CouponRepository();
const ticketRepository = new TicketRepository();
const cartRepository = new CartRepository();
const paymentRepository = new PaymentRepository();
const loyaltyOfferRepository = new LoyaltyOfferRepository();

const adminCase = new AdminUseCase(adminRepository, encrypt, jwt, userRepository, clubRepository, fixtureRepository, ticketRepository);
const bannerCase = new BannerUseCase(bannerRepository);
const stadiumCase = new StadiumUseCase(stadiumRepository, schedule, fixtureRepository);
const couponCase = new CouponUseCase(couponRepository);
const ticketCase = new TicketUseCase(ticketRepository, fixtureRepository, cartRepository, generateQrCode, paymentRepository, userRepository, generateEmail, couponRepository);
const loyaltyOfferCase = new LoyaltyOfferUseCase(loyaltyOfferRepository, couponRepository, generateCoupon,userRepository);

const controller = new AdminController(adminCase);
const bannerController = new BannerController(bannerCase, cloudinary);
const stadiumController = new StadiumController(stadiumCase);
const couponController = new CouponController(couponCase);
const ticketController = new TicketController(ticketCase);
const loyaltyOfferController = new LoyaltyOfferController(loyaltyOfferCase);

const router = express.Router();

router.post('/login', (req, res) => controller.login(req, res));
router.post('/logout', (req, res) => controller.logout(req, res));

router.get('/users', protect, (req, res) => controller.getUsers(req, res));
router.put('/users/action', protect, (req, res) => controller.blockUser(req, res));

router.get('/clubs', protect, (req, res) => controller.getClubs(req, res));
router.put('/clubs/action', protect, (req, res) => controller.blockClub(req, res));

router.get('/banner', protect, (req, res) => bannerController.getBanners(req, res));
router.put('/banner', protect, ImageUpload.single('image'), (req, res) => bannerController.updateBanner(req, res));

router.post('/matchTime', protect, (req, res) => stadiumController.addNewTime(req, res));
router.get('/matchTimes', protect, (req, res) => stadiumController.getAllTimes(req, res));
router.put('/updateTimePrice', protect, (req, res) => stadiumController.updateTimePrice(req, res));
router.put('/deleteMatchPrice/:id', protect, (req, res) => stadiumController.deleteMatchTime(req, res));

router.post('/seatPrice', protect, (req, res) => stadiumController.setSeatPrice(req, res));
router.get('/getSeats', protect, (req, res) => stadiumController.getAllSeats(req, res));

router.post('/coupon', protect, (req, res) => couponController.addCoupon(req, res));
router.get('/coupons', protect, (req, res) => couponController.getAllCoupons(req, res));
router.put('/editCoupon', protect, (req, res) => couponController.editCoupon(req, res));
router.delete('/coupon/:id', protect, (req, res) => couponController.deleteCoupon(req, res));

router.get('/dashboardSlotSales', protect, (req, res) => controller.slotSaleDashboardData(req, res));
router.get('/dashboardStaticContent', protect, (req, res) => controller.staticChartAndCardDashboardData(req, res));
router.get('/dashboardTicketContend', protect, (req, res) => controller.ticketsSoldDashboardData(req, res));

router.get('/allFixtures', protect, (req, res) => controller.allFixtures(req, res));
router.get('/allTickets', protect, (req, res) => ticketController.getAllTickets(req, res));

router.post('/addOffer', protect, (req, res) => loyaltyOfferController.addNewOffer(req, res));
router.put('/editOffer', protect, (req, res) => loyaltyOfferController.editOffer(req, res));
router.delete('/deleteOffer/:id', protect, (req, res) => loyaltyOfferController.deleteOffer(req, res));
router.get('/allOffers', protect, (req, res) => loyaltyOfferController.allOffers(req, res));

export default router;
