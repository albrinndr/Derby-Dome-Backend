"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = require("../middleware/multer");
const userController_1 = __importDefault(require("../../adapters/controllers/userController"));
const userUseCase_1 = __importDefault(require("../../useCase/userUseCase"));
const userRepository_1 = __importDefault(require("../repository/userRepository"));
const bcryptPassword_1 = __importDefault(require("../services/bcryptPassword"));
const generateToken_1 = __importDefault(require("../services/generateToken"));
const sendMail_1 = __importDefault(require("../services/sendMail"));
const generateOtp_1 = __importDefault(require("../services/generateOtp"));
const userAuth_1 = require("../middleware/userAuth");
const bannerRepository_1 = __importDefault(require("../repository/bannerRepository"));
const bannerUseCase_1 = __importDefault(require("../../useCase/bannerUseCase"));
const bannerController_1 = __importDefault(require("../../adapters/controllers/bannerController"));
const cloudinaryUpload_1 = __importDefault(require("../utils/cloudinaryUpload"));
const fixtureRepository_1 = __importDefault(require("../repository/fixtureRepository"));
const stadiumRepository_1 = __importDefault(require("../repository/stadiumRepository"));
const clubRepository_1 = __importDefault(require("../repository/clubRepository"));
const chatRepository_1 = __importDefault(require("../repository/chatRepository"));
const chatUseCase_1 = __importDefault(require("../../useCase/chatUseCase"));
const chatController_1 = __importDefault(require("../../adapters/controllers/chatController"));
const cartController_1 = __importDefault(require("../../adapters/controllers/cartController"));
const cartUseCase_1 = __importDefault(require("../../useCase/cartUseCase"));
const generateSeats_1 = __importDefault(require("../services/generateSeats"));
const cartRepository_1 = __importDefault(require("../repository/cartRepository"));
const scheduleTask_1 = __importDefault(require("../services/scheduleTask"));
const ticketController_1 = __importDefault(require("../../adapters/controllers/ticketController"));
const ticketUseCase_1 = __importDefault(require("../../useCase/ticketUseCase"));
const ticketRepository_1 = __importDefault(require("../repository/ticketRepository"));
const generateQrCode_1 = __importDefault(require("../services/generateQrCode"));
const paymentRepository_1 = __importDefault(require("../repository/paymentRepository"));
const couponRepository_1 = __importDefault(require("../repository/couponRepository"));
const couponUseCase_1 = __importDefault(require("../../useCase/couponUseCase"));
const couponController_1 = __importDefault(require("../../adapters/controllers/couponController"));
const stadiumUseCase_1 = __importDefault(require("../../useCase/stadiumUseCase"));
const stadiumController_1 = __importDefault(require("../../adapters/controllers/stadiumController"));
const generateCoupon_1 = __importDefault(require("../services/generateCoupon"));
const loyaltyOfferRepository_1 = __importDefault(require("../repository/loyaltyOfferRepository"));
const loyaltyOfferUseCase_1 = __importDefault(require("../../useCase/loyaltyOfferUseCase"));
const loyaltyOfferController_1 = __importDefault(require("../../adapters/controllers/loyaltyOfferController"));
const encrypt = new bcryptPassword_1.default();
const jwt = new generateToken_1.default();
const otp = new generateOtp_1.default();
const email = new sendMail_1.default();
const cloudinary = new cloudinaryUpload_1.default();
const generateSeats = new generateSeats_1.default();
const scheduleTask = new scheduleTask_1.default();
const generateQrCode = new generateQrCode_1.default();
const generateEmail = new sendMail_1.default();
const generateCoupon = new generateCoupon_1.default();
const repository = new userRepository_1.default();
const bannerRepository = new bannerRepository_1.default();
const fixtureRepository = new fixtureRepository_1.default();
const stadiumRepository = new stadiumRepository_1.default();
const clubRepository = new clubRepository_1.default();
const chatRepository = new chatRepository_1.default();
const cartRepository = new cartRepository_1.default();
const ticketRepository = new ticketRepository_1.default();
const paymentRepository = new paymentRepository_1.default();
const couponRepository = new couponRepository_1.default();
const loyaltyOfferRepository = new loyaltyOfferRepository_1.default();
const userCase = new userUseCase_1.default(repository, encrypt, jwt, bannerRepository, fixtureRepository, stadiumRepository, clubRepository, cartRepository, couponRepository, ticketRepository);
const bannerCase = new bannerUseCase_1.default(bannerRepository);
const chatCase = new chatUseCase_1.default(chatRepository);
const cartCase = new cartUseCase_1.default(generateSeats, stadiumRepository, fixtureRepository, cartRepository, scheduleTask);
const ticketCase = new ticketUseCase_1.default(ticketRepository, fixtureRepository, cartRepository, generateQrCode, paymentRepository, repository, generateEmail, couponRepository);
const couponCase = new couponUseCase_1.default(couponRepository);
const stadiumCase = new stadiumUseCase_1.default(stadiumRepository, scheduleTask, fixtureRepository);
const loyaltyOfferCase = new loyaltyOfferUseCase_1.default(loyaltyOfferRepository, couponRepository, generateCoupon, repository);
const controller = new userController_1.default(userCase, email, otp, cloudinary);
const bannerController = new bannerController_1.default(bannerCase, cloudinary);
const chatController = new chatController_1.default(chatCase);
const cartController = new cartController_1.default(cartCase);
const ticketController = new ticketController_1.default(ticketCase);
const couponController = new couponController_1.default(couponCase);
const stadiumController = new stadiumController_1.default(stadiumCase);
const loyaltyOfferController = new loyaltyOfferController_1.default(loyaltyOfferCase);
const router = express_1.default.Router();
router.post('/signUp', (req, res) => controller.signUp(req, res));
router.post('/verify', (req, res) => controller.userVerification(req, res));
router.post('/resendOtp', (req, res) => controller.resendOtp(req, res));
router.post('/login', (req, res) => controller.login(req, res));
router.post('/logout', (req, res) => controller.logout(req, res));
router.get('/profile', userAuth_1.protect, (req, res) => controller.profile(req, res));
router.put('/profile', userAuth_1.protect, multer_1.ImageUpload.single('profilePic'), (req, res) => controller.updateProfile(req, res));
router.get('/home', (req, res) => controller.userHomeContent(req, res));
router.get('/fixtures', (req, res) => controller.fixtureContent(req, res));
router.get('/search', (req, res) => controller.userSearch(req, res));
router.get('/fixtureDetails', (req, res) => controller.fixtureDetails(req, res));
router.get('/clubDetails', (req, res) => controller.clubDetails(req, res));
router.post('/message', userAuth_1.protect, (req, res) => chatController.sendMessage(req, res));
router.get('/message', userAuth_1.protect, (req, res) => chatController.getMessages(req, res));
router.get('/booking', userAuth_1.protect, (req, res) => controller.bookingPage(req, res));
router.post('/addToCart', userAuth_1.protect, (req, res) => cartController.addToCart(req, res));
router.get('/checkout', userAuth_1.protect, (req, res) => controller.checkoutPage(req, res));
router.post('/ticket', userAuth_1.protect, (req, res) => ticketController.createMatchTicket(req, res));
router.get('/myTickets', userAuth_1.protect, (req, res) => ticketController.getUserTickets(req, res));
router.put('/cancelTicket', userAuth_1.protect, (req, res) => ticketController.cancelTicket(req, res));
router.post('/validateCoupon', userAuth_1.protect, (req, res) => couponController.validateCoupon(req, res));
router.post('/review', userAuth_1.protect, (req, res) => stadiumController.addUpdateReview(req, res));
router.delete('/review', userAuth_1.protect, (req, res) => stadiumController.deleteReview(req, res));
router.get('/review', (req, res) => controller.allReviews(req, res));
router.get('/userReview', userAuth_1.protect, (req, res) => controller.userReview(req, res));
router.post('/followClub', userAuth_1.protect, (req, res) => controller.followClub(req, res));
router.get('/notifications', userAuth_1.protect, (req, res) => controller.userNotifications(req, res));
router.get('/notificationCount', userAuth_1.protect, (req, res) => controller.notificationCount(req, res));
router.put('/readNotification', userAuth_1.protect, (req, res) => controller.readNotification(req, res));
router.post('/forgotPassword', (req, res) => controller.forgotPassword(req, res));
router.post('/validateForgotOtp', (req, res) => controller.forgotOtpVerify(req, res));
router.put('/forgotPassword', (req, res) => controller.forgotChangePassword(req, res));
router.get('/followedClubs', userAuth_1.protect, (req, res) => controller.allFollowedClubs(req, res));
router.post('/clientToken', userAuth_1.protect, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return controller.setUserBrowserToken(req, res); }));
router.get('/getOffers', userAuth_1.protect, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return loyaltyOfferController.allOffers(req, res); }));
router.get('/userRedeem', userAuth_1.protect, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return loyaltyOfferController.userCoinRedeem(req, res); }));
router.post('/createUserCoupon', userAuth_1.protect, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return loyaltyOfferController.createUserCoupon(req, res); }));
exports.default = router;
