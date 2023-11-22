import express from 'express';
import PaymentController from '../../adapters/controllers/paymentController';
import ClubRepository from '../repository/clubRepository';
import FixtureRepository from '../repository/fixtureRepository';
import StadiumRepository from '../repository/stadiumRepository';
import PaymentRepository from '../repository/paymentRepository';
import FixtureUseCase from '../../useCase/fixtureUseCase';
import GenerateQRCode from '../services/generateQrCode';
import TicketRepository from '../repository/ticketRepository';
import CartRepository from '../repository/cartRepository';
import TicketUseCase from '../../useCase/ticketUseCase';
import GenerateEmail from '../services/sendMail';
import UserRepository from '../repository/userRepository';

const generateQrCode = new GenerateQRCode();
const generateEmail = new GenerateEmail();

const clubRepository = new ClubRepository();
const fixtureRepository = new FixtureRepository();
const stadiumRepository = new StadiumRepository();
const paymentRepository = new PaymentRepository();

const ticketRepository = new TicketRepository();
const cartRepository = new CartRepository();
const userRepository = new UserRepository()


const fixtureCase = new FixtureUseCase(fixtureRepository, clubRepository, stadiumRepository, paymentRepository);
const ticketCase = new TicketUseCase(ticketRepository, fixtureRepository, cartRepository, generateQrCode, paymentRepository,userRepository,generateEmail);


const controller = new PaymentController(fixtureCase, ticketCase);


const router = express.Router();

router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => controller.verifyPayment(req, res));
export default router;