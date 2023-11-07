import express from 'express';
import { ImageUpload } from '../middleware/multer';

import ClubController from '../../adapters/controllers/clubController';
import ClubRepository from '../repository/clubRepository';
import ClubUseCase from '../../useCase/clubUseCase';
import JWTToken from '../utils/generateToken';
import Encrypt from '../utils/bcryptPassword';
import GenerateEmail from '../utils/sendMail';
import GenerateOtp from '../utils/generateOtp';
import CloudinaryUpload from '../utils/cloudinaryUpload';
import { protect } from '../middleware/clubAuth';
import FixtureRepository from '../repository/fixtureRepository';
import StadiumRepository from '../repository/stadiumRepository';
import FixtureUseCase from '../../useCase/fixtureUseCase';
import FixtureController from '../../adapters/controllers/fixtureController';


const repository = new ClubRepository();
const fixtureRepository = new FixtureRepository();
const stadiumRepository = new StadiumRepository();

const encrypt = new Encrypt();
const token = new JWTToken();
const otp = new GenerateOtp();
const email = new GenerateEmail();
const cloudinary = new CloudinaryUpload();

const clubCase = new ClubUseCase(repository, encrypt, token);
const fixtureCase = new FixtureUseCase(fixtureRepository, repository, stadiumRepository);

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

export default router;
