import express from 'express';
import AdminController from '../../adapters/controllers/adminController';
import AdminRepository from '../repository/adminRepository';
import UserRepository from '../repository/userRepository';
import ClubRepository from '../repository/clubRepository';
import AdminUseCase from '../../useCase/adminUseCase';
import JWTToken from '../utils/generateToken';
import Encrypt from '../utils/bcryptPassword';
import { protect } from '../middleware/adminAuth';

const encrypt = new Encrypt();
const jwt = new JWTToken();
const adminRepository = new AdminRepository();
const userRepository = new UserRepository();
const clubRepository = new ClubRepository();

const adminCase = new AdminUseCase(adminRepository, encrypt, jwt, userRepository, clubRepository);
const controller = new AdminController(adminCase);

const router = express.Router();

router.post('/login', (req, res) => controller.login(req, res));
router.post('/logout', (req, res) => controller.logout(req, res));

router.get('/users', protect, (req, res) => controller.getUsers(req, res));
router.put('/users/action', protect, (req, res) => controller.blockUser(req, res));

router.get('/clubs', protect, (req, res) => controller.getClubs(req, res));
router.put('/clubs/action', protect, (req, res) => controller.blockClub(req, res));

export default router;
