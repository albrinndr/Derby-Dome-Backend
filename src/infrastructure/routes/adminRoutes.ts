import express from 'express';
import AdminController from '../../adapters/controllers/adminController';
import AdminRepository from '../repository/adminRepository';
import UserRepository from '../repository/userRepository';
import ClubRepository from '../repository/clubRepository';
import AdminUseCase from '../../useCase/adminUseCase';
import JWTToken from '../utils/generateToken';
import Encrypt from '../utils/bcryptPassword';
import { protect } from '../middleware/adminAuth';
import BannerRepository from '../repository/bannerRepository';
import BannerUseCase from '../../useCase/bannerUseCase';
import BannerController from '../../adapters/controllers/bannerController';
import { ImageUpload } from '../config/multer';
import CloudinaryUpload from '../utils/cloudinaryUpload';

const encrypt = new Encrypt();
const jwt = new JWTToken();
const adminRepository = new AdminRepository();
const userRepository = new UserRepository();
const clubRepository = new ClubRepository();
const bannerRepository = new BannerRepository();
const cloudinary = new CloudinaryUpload();


const adminCase = new AdminUseCase(adminRepository, encrypt, jwt, userRepository, clubRepository);
const bannerCase = new BannerUseCase(bannerRepository);

const controller = new AdminController(adminCase);
const bannerController = new BannerController(bannerCase,cloudinary);
const router = express.Router();

router.post('/login', (req, res) => controller.login(req, res));
router.post('/logout', (req, res) => controller.logout(req, res));

router.get('/users', protect, (req, res) => controller.getUsers(req, res));
router.put('/users/action', protect, (req, res) => controller.blockUser(req, res));

router.get('/clubs', protect, (req, res) => controller.getClubs(req, res));
router.put('/clubs/action', protect, (req, res) => controller.blockClub(req, res));

router.get('/banner', protect, (req, res) => bannerController.getBanners(req, res));
router.put('/banner', protect, ImageUpload.single('image'),(req, res) => bannerController.updateBanner(req, res));

export default router;
