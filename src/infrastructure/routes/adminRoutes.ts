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
import JWTToken from '../utils/generateToken';
import Encrypt from '../utils/bcryptPassword';
import CloudinaryUpload from '../utils/cloudinaryUpload';
import { protect } from '../middleware/adminAuth';
import { ImageUpload } from '../middleware/multer';
import ScheduleTask from '../utils/scheduleTask';
import FixtureRepository from '../repository/fixtureRepository';

const encrypt = new Encrypt();
const jwt = new JWTToken();
const cloudinary = new CloudinaryUpload();
const schedule = new ScheduleTask();
const adminRepository = new AdminRepository();
const userRepository = new UserRepository();
const clubRepository = new ClubRepository();
const bannerRepository = new BannerRepository();
const stadiumRepository = new StadiumRepository();
const fixtureRepository = new FixtureRepository();

const adminCase = new AdminUseCase(adminRepository, encrypt, jwt, userRepository, clubRepository);
const bannerCase = new BannerUseCase(bannerRepository);
const stadiumCase = new StadiumUseCase(stadiumRepository, schedule, fixtureRepository);

const controller = new AdminController(adminCase);
const bannerController = new BannerController(bannerCase, cloudinary);
const stadiumController = new StadiumController(stadiumCase);
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


export default router;
