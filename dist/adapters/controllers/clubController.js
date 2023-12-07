"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
class ClubController {
    constructor(clubCase, GenerateEmail, GenerateOtp, CloudinaryUpload) {
        this.clubCase = clubCase;
        this.GenerateOtp = GenerateOtp;
        this.GenerateEmail = GenerateEmail;
        this.CloudinaryUpload = CloudinaryUpload;
    }
    signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const verifyClub = yield this.clubCase.signUp(req.body.email);
                if (req.file) {
                    req.app.locals.image = req.file.path;
                }
                if (verifyClub.data.status === true) {
                    req.app.locals.clubData = req.body;
                    const otp = this.GenerateOtp.createOtp();
                    req.app.locals.clubOtp = otp;
                    this.GenerateEmail.sendMail(req.body.email, otp);
                    console.log(otp);
                    setTimeout(() => {
                        req.app.locals.clubOtp = this.GenerateOtp.createOtp();
                    }, 3 * 60000);
                    res.status(verifyClub.status).json(verifyClub.data);
                }
                else {
                    if (req.file) {
                        fs_1.default.unlink(req.file.path, (err) => {
                            if (err) {
                                console.error('Error deleting file:', err);
                            }
                        });
                    }
                    res.status(verifyClub.status).json(verifyClub.data);
                }
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    clubVerification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.body.otp == req.app.locals.clubOtp) {
                    const img = yield this.CloudinaryUpload.upload(req.app.locals.image, 'club-logos');
                    const clubData = req.app.locals.clubData;
                    clubData.image = img.secure_url;
                    const user = yield this.clubCase.verifyClub(clubData);
                    req.app.locals.clubData = null;
                    req.app.locals.image = null;
                    res.status(user.status).json(user.data);
                }
                else {
                    res.status(400).json({ status: false, message: 'Invalid otp' });
                }
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    resendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otp = this.GenerateOtp.createOtp();
                req.app.locals.clubOtp = otp;
                this.GenerateEmail.sendMail(req.app.locals.clubData.email, otp);
                console.log(otp);
                setTimeout(() => {
                    req.app.locals.clubOtp = this.GenerateOtp.createOtp();
                }, 3 * 60000);
                res.status(200).json({ message: 'Otp has been sent!' });
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const club = yield this.clubCase.login(req.body);
                if (club.data.token != '') {
                    res.cookie('clubJWT', club.data.token, {
                        httpOnly: true,
                        sameSite: 'none',
                        secure: process.env.NODE_ENV !== 'development',
                        maxAge: 30 * 24 * 60 * 60 * 1000
                    });
                }
                res.status(club.status).json(club.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.cookie('clubJWT', '', {
                    httpOnly: true,
                    expires: new Date(0)
                });
                res.status(200).json({ message: 'Club logged out' });
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    profile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const clubId = req.clubId || '';
                const club = yield this.clubCase.profile(clubId);
                res.status(club.status).json(club.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    updateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.file) {
                    const img = yield this.CloudinaryUpload.upload(req.file.path, 'club-logos');
                    const imgUrl = img.secure_url;
                    const data = {
                        name: req.body.name,
                        phone: req.body.phone,
                        email: req.body.email,
                        password: req.body.password,
                        image: imgUrl,
                        _id: req.clubId || '',
                        address: req.body.address,
                        contactPerson: req.body.contactPerson,
                        description: req.body.description
                    };
                    const club = yield this.clubCase.updateProfile(req.clubId || '', data, req.body.newPassword);
                    res.status(club.status).json(club.data);
                }
                else {
                    const club = yield this.clubCase.updateProfile(req.clubId || '', req.body, req.body.newPassword);
                    res.status(club.status).json(club.data);
                }
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    updateBackgroundImg(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.clubId || '';
                if (req.file) {
                    const img = yield this.CloudinaryUpload.upload(req.file.path, 'club-banners');
                    const backgroundUrl = img.secure_url;
                    const updated = yield this.clubCase.backgroundUpdate(id, backgroundUrl);
                    res.status(updated.status).json(updated.data);
                }
                else {
                    res.status(400).json({ message: 'Upload a banner image!' });
                }
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    getTeamData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.clubId || '';
                const team = yield this.clubCase.getTeamData(id);
                res.status(team.status).json(team.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    addTeamManager(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.file) {
                    const img = yield this.CloudinaryUpload.upload(req.file.path, 'team');
                    const managerImg = img.secure_url;
                    const data = { name: req.body.name, image: managerImg };
                    const id = req.clubId || '';
                    const result = yield this.clubCase.addClubManager(id, data);
                    res.status(result.status).json(result.data);
                }
                else {
                    res.status(400).json({ message: 'Upload manager photo' });
                }
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    editTeamManager(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = { name: req.body.name, image: '' };
                const id = req.clubId || '';
                if (req.file) {
                    const img = yield this.CloudinaryUpload.upload(req.file.path, 'team');
                    const managerImg = img.secure_url;
                    data.image = managerImg;
                }
                const result = yield this.clubCase.editClubManager(id, data);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    addNewPlayer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.clubId || '';
                const data = Object.assign(Object.assign({}, req.body), { image: '' });
                if (req.file) {
                    const img = yield this.CloudinaryUpload.upload(req.file.path, 'team');
                    const player = img.secure_url;
                    data.image = player;
                }
                const result = yield this.clubCase.addNewPlayer(id, data);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    editPlayer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.clubId || '';
                const playerId = req.body.id;
                const data = {
                    name: req.body.name,
                    shirtNo: req.body.shirtNo,
                    position: req.body.position
                };
                if (req.file) {
                    const img = yield this.CloudinaryUpload.upload(req.file.path, 'team');
                    const playerImg = img.secure_url;
                    const playerData = Object.assign(Object.assign({}, data), { image: playerImg });
                    const result = yield this.clubCase.editPlayer(id, playerId, playerData);
                    res.status(result.status).json(result.data);
                }
                else {
                    const result = yield this.clubCase.editPlayer(id, playerId, data);
                    res.status(result.status).json(result.data);
                }
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    deletePlayer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const clubId = req.clubId || '';
                const result = yield this.clubCase.deleteClubPlayer(clubId, req.params.id);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    changeStartingXI(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const clubId = req.clubId || "";
                const p1Id = req.params.p1Id;
                const p2Id = req.params.p2Id;
                const result = yield this.clubCase.changeStartingXI(clubId, p1Id, p2Id);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    dashboardProfitAndExpenseContent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const clubId = req.clubId || "";
                const year = req.query.year;
                const result = yield this.clubCase.clubDashboardSalesAndExpense(clubId, year);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    dashboardContent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const clubId = req.clubId || "";
                const result = yield this.clubCase.clubDashboardContent(clubId);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.body.email;
                const result = yield this.clubCase.forgotPassword(email);
                if (result.data.status) {
                    req.session.forgotEmail = email;
                    const otp = this.GenerateOtp.createOtp();
                    req.session.forgotOtp = otp;
                    console.log(req.session.forgotOtp);
                    this.GenerateEmail.sendMail(email, otp);
                }
                res.status(result.status).json(result.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    forgotOtpVerify(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const forgotOtp = req.session.forgotOtp;
                const otp = req.body.otp;
                if (forgotOtp == otp) {
                    res.status(200).json('Success');
                }
                else {
                    res.status(400).json({ message: "Invalid OTP!" });
                }
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    forgotChangePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const forgotEmail = req.session.forgotEmail;
                const password = req.body.password;
                const result = yield this.clubCase.forgotPasswordChange(forgotEmail, password);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
}
exports.default = ClubController;
