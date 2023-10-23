import express from 'express';
import AdminController from '../../adapters/controllers/adminController';
import AdminRepository from '../repository/adminRepository';
import AdminUseCase from '../../useCase/adminUseCase';
import JWTToken from '../utils/generateToken';
import Encrypt from '../utils/bcryptPassword';

const encrypt = new Encrypt();
const jwt = new JWTToken();
const repository = new AdminRepository();
const adminCase = new AdminUseCase(repository, encrypt, jwt);
const controller = new AdminController(adminCase);

const router = express.Router();

router.post('/login', (req, res) => controller.login(req, res));

export default router;
