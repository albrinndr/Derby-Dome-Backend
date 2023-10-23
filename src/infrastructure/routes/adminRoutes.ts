import express from 'express';
import AdminController from '../../adapters/controllers/adminController';
import AdminRepository from '../repository/adminRepository';
import UserRepository from '../repository/userRepository';
import AdminUseCase from '../../useCase/adminUseCase';
import JWTToken from '../utils/generateToken';
import Encrypt from '../utils/bcryptPassword';

const encrypt = new Encrypt();
const jwt = new JWTToken();
const adminRepository = new AdminRepository();
const userRepository = new UserRepository();

const adminCase = new AdminUseCase(adminRepository, encrypt, jwt, userRepository);
const controller = new AdminController(adminCase);

const router = express.Router();

router.post('/login', (req, res) => controller.login(req, res));
router.post('/logout', (req, res) => controller.logout(req, res));

router.get('/users', (req, res) => controller.getUsers(req, res));
router.put('/users/action', (req, res) => controller.blockUser(req, res));

export default router;
