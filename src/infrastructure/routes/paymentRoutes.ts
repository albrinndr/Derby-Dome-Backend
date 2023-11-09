import express from 'express';
import PaymentController from '../../adapters/controllers/paymentController';
import ClubRepository from '../repository/clubRepository';
import FixtureRepository from '../repository/fixtureRepository';
import StadiumRepository from '../repository/stadiumRepository';
import PaymentRepository from '../repository/paymentRepository';
import FixtureUseCase from '../../useCase/fixtureUseCase';


const clubRepository = new ClubRepository();
const fixtureRepository = new FixtureRepository();
const stadiumRepository = new StadiumRepository();
const paymentRepository = new PaymentRepository();

const fixtureCase = new FixtureUseCase(fixtureRepository, clubRepository, stadiumRepository, paymentRepository);
const controller = new PaymentController(fixtureCase);


const router = express.Router();

router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => controller.verifyPayment(req, res));
export default router;