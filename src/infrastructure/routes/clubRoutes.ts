import express from 'express';
import { ImageUpload } from '../middleware/multer';

import ClubController from '../../adapters/controllers/clubController';
import ClubRepository from '../repository/clubRepository';
import ClubUseCase from '../../useCase/clubUseCase';
import JWTToken from '../services/generateToken';
import Encrypt from '../services/bcryptPassword';
import GenerateEmail from '../services/sendMail';
import GenerateOtp from '../services/generateOtp';
import CloudinaryUpload from '../utils/cloudinaryUpload';
import { protect } from '../middleware/clubAuth';
import FixtureRepository from '../repository/fixtureRepository';
import StadiumRepository from '../repository/stadiumRepository';
import FixtureUseCase from '../../useCase/fixtureUseCase';
import FixtureController from '../../adapters/controllers/fixtureController';
import PaymentRepository from '../repository/paymentRepository';
import ScheduleTask from '../services/scheduleTask';
import TicketRepository from '../repository/ticketRepository';
import UserRepository from '../repository/userRepository';

const repository = new ClubRepository();
const fixtureRepository = new FixtureRepository();
const stadiumRepository = new StadiumRepository();
const paymentRepository = new PaymentRepository();
const ticketRepository = new TicketRepository();
const userRepository = new UserRepository();

const encrypt = new Encrypt();
const token = new JWTToken();
const otp = new GenerateOtp();
const email = new GenerateEmail();
const cloudinary = new CloudinaryUpload();
const schedule = new ScheduleTask();

const clubCase = new ClubUseCase(repository, encrypt, token, fixtureRepository, ticketRepository);
const fixtureCase = new FixtureUseCase(fixtureRepository, repository, stadiumRepository, paymentRepository, schedule,userRepository);

const controller = new ClubController(clubCase, email, otp, cloudinary);
const fixtureController = new FixtureController(fixtureCase, cloudinary);

const router = express.Router();

router.post('/signup', ImageUpload.single('image'), (req, res) => controller.signup(req, res));
router.post('/verify', (req, res) => controller.clubVerification(req, res));
router.post('/resendOtp', (req, res) => controller.resendOtp(req, res));
router.post('/login', (req, res) => controller.login(req, res));
router.post('/logout', (req, res) => controller.logout(req, res));

router.get('/profile', protect, (req, res) => controller.profile(req, res));
router.put('/profile', protect, ImageUpload.single('image'), (req, res) => controller.updateProfile(req, res));
router.put('/background', protect, ImageUpload.single('image'), (req, res) => controller.updateBackgroundImg(req, res));

router.post('/fixtureFormContent', protect, (req, res) => fixtureController.getFixtureFormContent(req, res));
router.post('/createNewFixture', protect, ImageUpload.single('image'), (req, res) => fixtureController.createNewFixture(req, res));

router.get('/getFixtures', protect, (req, res) => fixtureController.getClubFixtures(req, res));
router.put('/cancelFixture/:id', protect, (req, res) => fixtureController.cancelFixture(req, res));

router.get('/getTeam', protect, (req, res) => controller.getTeamData(req, res));
router.post('/addManager', protect, ImageUpload.single('image'), (req, res) => controller.addTeamManager(req, res));
router.put('/editManager', protect, ImageUpload.single('image'), (req, res) => controller.editTeamManager(req, res));
router.post('/addPlayer', protect, ImageUpload.single('image'), (req, res) => controller.addNewPlayer(req, res));
router.put('/editPlayer', protect, ImageUpload.single('image'), (req, res) => controller.editPlayer(req, res));
router.delete('/deletePlayer/:id', protect, (req, res) => controller.deletePlayer(req, res));
router.put('/changeXI/:p1Id/:p2Id', protect, (req, res) => controller.changeStartingXI(req, res));

router.get('/dashboard', protect, (req, res) => controller.dashboardProfitAndExpenseContent(req, res));
router.get('/dashboard2', protect, (req, res) => controller.dashboardContent(req, res));

router.post('/forgotPassword', (req, res) => controller.forgotPassword(req, res));
router.post('/validateForgotOtp', (req, res) => controller.forgotOtpVerify(req, res));
router.put('/forgotPassword', (req, res) => controller.forgotChangePassword(req, res));

export default router;
