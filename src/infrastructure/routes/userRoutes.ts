import express from 'express';

import UserController from '../../adapters/controllers/userController';
import UserUseCase from '../../useCase/userUseCase';
import UserRepository from '../repository/userRepository';
import Encrypt from '../../utils/bcryptPassword';

const repository = new UserRepository();
const encrypt = new Encrypt();
const userCase = new UserUseCase(repository, encrypt);
const controller = new UserController(userCase);

const router = express.Router();

router.post('/signUp', (req, res) => controller.signup(req, res));

export default router;
