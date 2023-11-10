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


const encrypt = new Encrypt();
const jwt = new JWTToken();
const otp = new GenerateOtp();
const email = new GenerateEmail();
const cloudinary = new CloudinaryUpload();

const repository = new UserRepository();
const bannerRepository = new BannerRepository();
const fixtureRepository = new FixtureRepository();
const stadiumRepository = new StadiumRepository();

const userCase = new UserUseCase(repository, encrypt, jwt, bannerRepository, fixtureRepository,stadiumRepository);
const bannerCase = new BannerUseCase(bannerRepository);

const controller = new UserController(userCase, email, otp, cloudinary);
const bannerController = new BannerController(bannerCase, cloudinary);


const router = express.Router();

router.post('/signUp', (req, res) => controller.signUp(req, res));
router.post('/verify', (req, res) => controller.userVerification(req, res));
router.post('/resendOtp', (req, res) => controller.resendOtp(req, res));
router.post('/login', (req, res) => controller.login(req, res));
router.post('/logout', (req, res) => controller.logout(req, res));

router.get('/profile', protect, (req, res) => controller.profile(req, res));
router.put('/profile', protect, ImageUpload.single('profilePic'), (req, res) => controller.updateProfile(req, res));

router.get('/banner', (req, res) => bannerController.getBanners(req, res));
router.get('/home', (req, res) => controller.userHomeContent(req, res));

export default router;
