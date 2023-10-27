import express from 'express';

import UserController from '../../adapters/controllers/userController';
import UserUseCase from '../../useCase/userUseCase';
import UserRepository from '../repository/userRepository';
import Encrypt from '../utils/bcryptPassword';
import JWTToken from '../utils/generateToken';
import GenerateEmail from '../utils/sendMail';
import GenerateOtp from '../utils/generateOtp';


const repository = new UserRepository();
const encrypt = new Encrypt();
const jwt = new JWTToken();
const otp = new GenerateOtp();
const email = new GenerateEmail();
const userCase = new UserUseCase(repository, encrypt, jwt);
const controller = new UserController(userCase, email, otp);

const router = express.Router();

router.post('/signUp', (req, res) => controller.signUp(req, res));
router.post('/verify', (req, res) => controller.userVerification(req, res));
router.post('/resendOtp', (req, res) => controller.resendOtp(req, res));
router.post('/login', (req, res) => controller.login(req, res));
router.post('/logout', (req, res) => controller.logout(req, res));

router.get('/profile', (req, res) => controller.profile(req, res));
router.put('/profile', (req, res) => controller.updateProfile(req, res));

export default router;
