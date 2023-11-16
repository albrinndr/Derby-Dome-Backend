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


const encrypt = new Encrypt();
const jwt = new JWTToken();
const otp = new GenerateOtp();
const email = new GenerateEmail();
const cloudinary = new CloudinaryUpload();

const repository = new UserRepository();
const bannerRepository = new BannerRepository();
const fixtureRepository = new FixtureRepository();
const stadiumRepository = new StadiumRepository();
const clubRepository = new ClubRepository();
const chatRepository = new ChatRepository();

const userCase = new UserUseCase(repository, encrypt, jwt, bannerRepository, fixtureRepository, stadiumRepository, clubRepository);
const bannerCase = new BannerUseCase(bannerRepository);
const chatCase = new ChatUseCase(chatRepository);

const controller = new UserController(userCase, email, otp, cloudinary);
const bannerController = new BannerController(bannerCase, cloudinary);
const chatController = new ChatController(chatCase);

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

export default router;
