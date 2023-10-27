import express from 'express';
import { ImageUpload } from '../config/multer';

import ClubController from '../../adapters/controllers/clubController';
import ClubRepository from '../repository/clubRepository';
import ClubUseCase from '../../useCase/clubUseCase';
import JWTToken from '../utils/generateToken';
import Encrypt from '../utils/bcryptPassword';
import GenerateEmail from '../utils/sendMail';
import GenerateOtp from '../utils/generateOtp';
import CloudinaryUpload from '../utils/cloudinaryUpload';


const repository = new ClubRepository();
const encrypt = new Encrypt();
const token = new JWTToken();
const otp = new GenerateOtp();
const email = new GenerateEmail();
const cloudinary = new CloudinaryUpload();

const clubCase = new ClubUseCase(repository, encrypt, token);
const controller = new ClubController(clubCase, email, otp, cloudinary);

const router = express.Router();

router.post('/signup', ImageUpload.single('image'), (req, res) => controller.signup(req, res));
router.post('/verify', (req, res) => controller.clubVerification(req, res));
router.post('/resendOtp', (req, res) => controller.resendOtp(req, res));
router.post('/login', (req, res) => controller.login(req, res));

export default router;
