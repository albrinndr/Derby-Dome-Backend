import express from 'express';

import UserController from '../../adapters/controllers/userController';
import UserUseCase from '../../useCase/userUseCase';
import UserRepository from '../repository/userRepository';
import Encrypt from '../utils/bcryptPassword';
import JWTToken from '../utils/generateToken';


const repository = new UserRepository();
const encrypt = new Encrypt();
const jwt = new JWTToken();
const userCase = new UserUseCase(repository, encrypt, jwt);
const controller = new UserController(userCase);

const router = express.Router();

router.post('/signUp', (req, res) => controller.signup(req, res));
router.post('/login', (req, res) => controller.login(req, res));

export default router;
