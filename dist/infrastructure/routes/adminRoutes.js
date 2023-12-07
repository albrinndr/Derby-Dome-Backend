"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminRepository_1 = __importDefault(require("../repository/adminRepository"));
const userRepository_1 = __importDefault(require("../repository/userRepository"));
const clubRepository_1 = __importDefault(require("../repository/clubRepository"));
const bannerRepository_1 = __importDefault(require("../repository/bannerRepository"));
const stadiumRepository_1 = __importDefault(require("../repository/stadiumRepository"));
const adminUseCase_1 = __importDefault(require("../../useCase/adminUseCase"));
const bannerUseCase_1 = __importDefault(require("../../useCase/bannerUseCase"));
const stadiumUseCase_1 = __importDefault(require("../../useCase/stadiumUseCase"));
const adminController_1 = __importDefault(require("../../adapters/controllers/adminController"));
const bannerController_1 = __importDefault(require("../../adapters/controllers/bannerController"));
const stadiumController_1 = __importDefault(require("../../adapters/controllers/stadiumController"));
const generateToken_1 = __importDefault(require("../services/generateToken"));
const bcryptPassword_1 = __importDefault(require("../services/bcryptPassword"));
const cloudinaryUpload_1 = __importDefault(require("../utils/cloudinaryUpload"));
const adminAuth_1 = require("../middleware/adminAuth");
const multer_1 = require("../middleware/multer");
const scheduleTask_1 = __importDefault(require("../services/scheduleTask"));
const fixtureRepository_1 = __importDefault(require("../repository/fixtureRepository"));
const couponRepository_1 = __importDefault(require("../repository/couponRepository"));
const couponUseCase_1 = __importDefault(require("../../useCase/couponUseCase"));
const couponController_1 = __importDefault(require("../../adapters/controllers/couponController"));
const ticketRepository_1 = __importDefault(require("../repository/ticketRepository"));
const ticketUseCase_1 = __importDefault(require("../../useCase/ticketUseCase"));
const cartRepository_1 = __importDefault(require("../repository/cartRepository"));
const generateQrCode_1 = __importDefault(require("../services/generateQrCode"));
const paymentRepository_1 = __importDefault(require("../repository/paymentRepository"));
const sendMail_1 = __importDefault(require("../services/sendMail"));
const ticketController_1 = __importDefault(require("../../adapters/controllers/ticketController"));
const encrypt = new bcryptPassword_1.default();
const jwt = new generateToken_1.default();
const cloudinary = new cloudinaryUpload_1.default();
const schedule = new scheduleTask_1.default();
const generateQrCode = new generateQrCode_1.default();
const generateEmail = new sendMail_1.default();
const adminRepository = new adminRepository_1.default();
const userRepository = new userRepository_1.default();
const clubRepository = new clubRepository_1.default();
const bannerRepository = new bannerRepository_1.default();
const stadiumRepository = new stadiumRepository_1.default();
const fixtureRepository = new fixtureRepository_1.default();
const couponRepository = new couponRepository_1.default();
const ticketRepository = new ticketRepository_1.default();
const cartRepository = new cartRepository_1.default();
const paymentRepository = new paymentRepository_1.default();
const adminCase = new adminUseCase_1.default(adminRepository, encrypt, jwt, userRepository, clubRepository, fixtureRepository, ticketRepository);
const bannerCase = new bannerUseCase_1.default(bannerRepository);
const stadiumCase = new stadiumUseCase_1.default(stadiumRepository, schedule, fixtureRepository);
const couponCase = new couponUseCase_1.default(couponRepository);
const ticketCase = new ticketUseCase_1.default(ticketRepository, fixtureRepository, cartRepository, generateQrCode, paymentRepository, userRepository, generateEmail, couponRepository);
const controller = new adminController_1.default(adminCase);
const bannerController = new bannerController_1.default(bannerCase, cloudinary);
const stadiumController = new stadiumController_1.default(stadiumCase);
const couponController = new couponController_1.default(couponCase);
const ticketController = new ticketController_1.default(ticketCase);
const router = express_1.default.Router();
router.post('/login', (req, res) => controller.login(req, res));
router.post('/logout', (req, res) => controller.logout(req, res));
router.get('/users', adminAuth_1.protect, (req, res) => controller.getUsers(req, res));
router.put('/users/action', adminAuth_1.protect, (req, res) => controller.blockUser(req, res));
router.get('/clubs', adminAuth_1.protect, (req, res) => controller.getClubs(req, res));
router.put('/clubs/action', adminAuth_1.protect, (req, res) => controller.blockClub(req, res));
router.get('/banner', adminAuth_1.protect, (req, res) => bannerController.getBanners(req, res));
router.put('/banner', adminAuth_1.protect, multer_1.ImageUpload.single('image'), (req, res) => bannerController.updateBanner(req, res));
router.post('/matchTime', adminAuth_1.protect, (req, res) => stadiumController.addNewTime(req, res));
router.get('/matchTimes', adminAuth_1.protect, (req, res) => stadiumController.getAllTimes(req, res));
router.put('/updateTimePrice', adminAuth_1.protect, (req, res) => stadiumController.updateTimePrice(req, res));
router.put('/deleteMatchPrice/:id', adminAuth_1.protect, (req, res) => stadiumController.deleteMatchTime(req, res));
router.post('/seatPrice', adminAuth_1.protect, (req, res) => stadiumController.setSeatPrice(req, res));
router.get('/getSeats', adminAuth_1.protect, (req, res) => stadiumController.getAllSeats(req, res));
router.post('/coupon', adminAuth_1.protect, (req, res) => couponController.addFixture(req, res));
router.get('/coupons', adminAuth_1.protect, (req, res) => couponController.getAllCoupons(req, res));
router.put('/editCoupon', adminAuth_1.protect, (req, res) => couponController.editCoupon(req, res));
router.delete('/coupon/:id', adminAuth_1.protect, (req, res) => couponController.deleteCoupon(req, res));
router.get('/dashboardSlotSales', adminAuth_1.protect, (req, res) => controller.slotSaleDashboardData(req, res));
router.get('/dashboardStaticContent', adminAuth_1.protect, (req, res) => controller.staticChartAndCardDashboardData(req, res));
router.get('/dashboardTicketContend', adminAuth_1.protect, (req, res) => controller.ticketsSoldDashboardData(req, res));
router.get('/allFixtures', adminAuth_1.protect, (req, res) => controller.allFixtures(req, res));
router.get('/allTickets', adminAuth_1.protect, (req, res) => ticketController.getAllTickets(req, res));
exports.default = router;
