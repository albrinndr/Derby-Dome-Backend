import express from 'express';
import UserController from '../../adapters/controllers/userController';
import UserUseCase from '../../useCase/userUseCase';
import UserRepository from '../repository/userRepository';
import Encrypt from '../utils/bcryptPassword';
import JWTToken from '../utils/generateToken';
import GenerateEmail from '../utils/sendMail';
import GenerateOtp from '../utils/generateOtp';
import { protect } from '../middleware/userAuth';
import BannerRepository from '../repository/bannerRepository';
import BannerUseCase from '../../useCase/bannerUseCase';
import BannerController from '../../adapters/controllers/bannerController';
import CloudinaryUpload from '../utils/cloudinaryUpload';


const repository = new UserRepository();
const encrypt = new Encrypt();
const jwt = new JWTToken();
const otp = new GenerateOtp();
const email = new GenerateEmail();
const bannerRepository = new BannerRepository();
const cloudinary = new CloudinaryUpload();

const userCase = new UserUseCase(repository, encrypt, jwt);
const bannerCase = new BannerUseCase(bannerRepository);

const controller = new UserController(userCase, email, otp);
const bannerController = new BannerController(bannerCase, cloudinary);


const router = express.Router();

router.post('/signUp', (req, res) => controller.signUp(req, res));
router.post('/verify', (req, res) => controller.userVerification(req, res));
router.post('/resendOtp', (req, res) => controller.resendOtp(req, res));
router.post('/login', (req, res) => controller.login(req, res));
router.post('/logout', (req, res) => controller.logout(req, res));

router.get('/profile', protect, (req, res) => controller.profile(req, res));
router.put('/profile', protect, (req, res) => controller.updateProfile(req, res));

router.get('/banner', (req, res) => bannerController.getBanners(req,res));

export default router;
