import express from 'express';
import { ImageUpload } from '../middleware/multer';

import UserController from '../../adapters/controllers/userController';
import UserUseCase from '../../useCase/userUseCase';
import UserRepository from '../repository/userRepository';
import Encrypt from '../services/bcryptPassword';
import JWTToken from '../services/generateToken';
import GenerateEmail from '../services/sendMail';
import GenerateOtp from '../services/generateOtp';
import { protect } from '../middleware/userAuth';
import BannerRepository from '../repository/bannerRepository';
import BannerUseCase from '../../useCase/bannerUseCase';
import BannerController from '../../adapters/controllers/bannerController';
import CloudinaryUpload from '../utils/cloudinaryUpload';
import FixtureRepository from '../repository/fixtureRepository';
import StadiumRepository from '../repository/stadiumRepository';
import ClubRepository from '../repository/clubRepository';
import ChatRepository from '../repository/chatRepository';
import ChatUseCase from '../../useCase/chatUseCase';
import ChatController from '../../adapters/controllers/chatController';
import CartController from '../../adapters/controllers/cartController';
import CartUseCase from '../../useCase/cartUseCase';
import GenerateSeats from '../services/generateSeats';
import CartRepository from '../repository/cartRepository';
import ScheduleTask from '../services/scheduleTask';
import TicketController from '../../adapters/controllers/ticketController';
import TicketUseCase from '../../useCase/ticketUseCase';
import TicketRepository from '../repository/ticketRepository';
import GenerateQRCode from '../services/generateQrCode';
import PaymentRepository from '../repository/paymentRepository';
import CouponRepository from '../repository/couponRepository';
import CouponUseCase from '../../useCase/couponUseCase';
import CouponController from '../../adapters/controllers/couponController';
import StadiumUseCase from '../../useCase/stadiumUseCase';
import StadiumController from '../../adapters/controllers/stadiumController';
import FirebaseNotification from '../services/firebaseNotification';


const encrypt = new Encrypt();
const jwt = new JWTToken();
const otp = new GenerateOtp();
const email = new GenerateEmail();
const cloudinary = new CloudinaryUpload();
const generateSeats = new GenerateSeats();
const scheduleTask = new ScheduleTask();
const generateQrCode = new GenerateQRCode();
const generateEmail = new GenerateEmail();

const repository = new UserRepository();
const bannerRepository = new BannerRepository();
const fixtureRepository = new FixtureRepository();
const stadiumRepository = new StadiumRepository();
const clubRepository = new ClubRepository();
const chatRepository = new ChatRepository();
const cartRepository = new CartRepository();
const ticketRepository = new TicketRepository();
const paymentRepository = new PaymentRepository();
const couponRepository = new CouponRepository();

const userCase = new UserUseCase(repository, encrypt, jwt, bannerRepository, fixtureRepository, stadiumRepository, clubRepository, cartRepository, couponRepository, ticketRepository);
const bannerCase = new BannerUseCase(bannerRepository);
const chatCase = new ChatUseCase(chatRepository);
const cartCase = new CartUseCase(generateSeats, stadiumRepository, fixtureRepository, cartRepository, scheduleTask);
const ticketCase = new TicketUseCase(ticketRepository, fixtureRepository, cartRepository, generateQrCode, paymentRepository, repository, generateEmail, couponRepository);
const couponCase = new CouponUseCase(couponRepository);
const stadiumCase = new StadiumUseCase(stadiumRepository, scheduleTask, fixtureRepository);

const controller = new UserController(userCase, email, otp, cloudinary);
const bannerController = new BannerController(bannerCase, cloudinary);
const chatController = new ChatController(chatCase);
const cartController = new CartController(cartCase);
const ticketController = new TicketController(ticketCase);
const couponController = new CouponController(couponCase);
const stadiumController = new StadiumController(stadiumCase);

const router = express.Router();

router.post('/signUp', (req, res) => controller.signUp(req, res));
router.post('/verify', (req, res) => controller.userVerification(req, res));
router.post('/resendOtp', (req, res) => controller.resendOtp(req, res));
router.post('/login', (req, res) => controller.login(req, res));
router.post('/logout', (req, res) => controller.logout(req, res));

router.get('/profile', protect, (req, res) => controller.profile(req, res));
router.put('/profile', protect, ImageUpload.single('profilePic'), (req, res) => controller.updateProfile(req, res));

router.get('/home', (req, res) => controller.userHomeContent(req, res));
router.get('/fixtures', (req, res) => controller.fixtureContent(req, res));
router.get('/search', (req, res) => controller.userSearch(req, res));
router.get('/fixtureDetails', (req, res) => controller.fixtureDetails(req, res));
router.get('/clubDetails', (req, res) => controller.clubDetails(req, res));

router.post('/message', protect, (req, res) => chatController.sendMessage(req, res));
router.get('/message', protect, (req, res) => chatController.getMessages(req, res));

router.get('/booking', protect, (req, res) => controller.bookingPage(req, res));

router.post('/addToCart', protect, (req, res) => cartController.addToCart(req, res));
router.get('/checkout', protect, (req, res) => controller.checkoutPage(req, res));

router.post('/ticket', protect, (req, res) => ticketController.createMatchTicket(req, res));
router.get('/myTickets', protect, (req, res) => ticketController.getUserTickets(req, res));
router.put('/cancelTicket', protect, (req, res) => ticketController.cancelTicket(req, res));

router.post('/validateCoupon', protect, (req, res) => couponController.validateCoupon(req, res));

router.post('/review', protect, (req, res) => stadiumController.addUpdateReview(req, res));
router.delete('/review', protect, (req, res) => stadiumController.deleteReview(req, res));

router.get('/review', (req, res) => controller.allReviews(req, res));
router.get('/userReview', protect, (req, res) => controller.userReview(req, res));

router.post('/followClub', protect, (req, res) => controller.followClub(req, res));
router.get('/notifications', protect, (req, res) => controller.userNotifications(req, res));
router.get('/notificationCount', protect, (req, res) => controller.notificationCount(req, res));
router.put('/readNotification', protect, (req, res) => controller.readNotification(req, res));

router.post('/forgotPassword', (req, res) => controller.forgotPassword(req, res));
router.post('/validateForgotOtp', (req, res) => controller.forgotOtpVerify(req, res));
router.put('/forgotPassword', (req, res) => controller.forgotChangePassword(req, res));

router.get('/followedClubs', protect, (req, res) => controller.allFollowedClubs(req, res));

router.post('/clientToken', protect, async (req, res) => controller.setUserBrowserToken(req, res));

export default router;
