import express from 'express';

import ClubController from '../../adapters/controllers/clubController';
import ClubRepository from '../repository/clubRepository';
import ClubUseCase from '../../useCase/clubUseCase';
import JWTToken from '../utils/generateToken';
import Encrypt from '../utils/bcryptPassword';

const repository = new ClubRepository();
const encrypt = new Encrypt();
const token = new JWTToken();

const clubCase = new ClubUseCase(repository, encrypt, token);
const controller = new ClubController(clubCase);

const router = express.Router();

router.post('/signup', (req, res) => controller.signup(req, res));
router.post('/login', (req, res) => controller.login(req, res));

export default router;
