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
Object.defineProperty(exports, "__esModule", { value: true });
class UserController {
    constructor(userCase, GenerateEmail, GenerateOtp, CloudinaryUpload) {
        this.userCase = userCase;
        this.GenerateOtp = GenerateOtp;
        this.GenerateEmail = GenerateEmail;
        this.CloudinaryUpload = CloudinaryUpload;
    }
    signUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const verifyUser = yield this.userCase.signUp(req.body.email);
                if (verifyUser.data.status === true && req.body.isGoogle) {
                    const user = yield this.userCase.verifyUser(req.body);
                    res.status(user.status).json(user.data);
                }
                else if (verifyUser.data.status === true) {
                    req.app.locals.userData = req.body;
                    const otp = this.GenerateOtp.createOtp();
                    req.app.locals.otp = otp;
                    this.GenerateEmail.sendMail(req.body.email, otp);
                    console.log(otp);
                    setTimeout(() => {
                        req.app.locals.otp = this.GenerateOtp.createOtp();
                    }, 3 * 60000);
                    res.status(verifyUser.status).json(verifyUser.data);
                }
                else {
                    res.status(verifyUser.status).json(verifyUser.data);
                }
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    userVerification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.body.otp == req.app.locals.otp) {
                    const user = yield this.userCase.verifyUser(req.app.locals.userData);
                    req.app.locals.userData = null;
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
                req.app.locals.otp = otp;
                this.GenerateEmail.sendMail(req.app.locals.userData.email, otp);
                console.log(otp);
                setTimeout(() => {
                    req.app.locals.otp = this.GenerateOtp.createOtp();
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
                const user = yield this.userCase.login(req.body);
                if (user.data.token != '') {
                    res.cookie('userJWT', user.data.token, {
                        httpOnly: true,
                        sameSite: 'strict',
                        secure: process.env.NODE_ENV !== 'development',
                        maxAge: 30 * 24 * 60 * 60 * 1000
                    });
                }
                res.status(user.status).json(user.data);
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
                res.cookie('userJWT', '', {
                    httpOnly: true,
                    expires: new Date(0)
                });
                res.status(200).json({ message: 'User logged out' });
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
                // const userId = req.query.id as string;
                const userId = req.userId || '';
                const user = yield this.userCase.profile(userId);
                res.status(user.status).json(user.data);
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
                    const img = yield this.CloudinaryUpload.upload(req.file.path, 'profile-picture');
                    const imgUrl = img.secure_url;
                    console.log(imgUrl);
                    const data = req.body;
                    data.profilePic = imgUrl;
                    const user = yield this.userCase.updateProfile(req.userId || '', data, req.body.newPassword);
                    res.status(user.status).json(user.data);
                }
                else {
                    const user = yield this.userCase.updateProfile(req.userId || '', req.body, req.body.newPassword);
                    res.status(user.status).json(user.data);
                }
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    userHomeContent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userCase.userHome();
                res.status(result.status).json(result.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    fixtureContent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userCase.allFixtures();
                res.status(result.status).json(result.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    userSearch(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userCase.userSearch();
                res.status(result.status).json(result.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    fixtureDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.query.id;
                const result = yield this.userCase.fixtureDetails(id);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    clubDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.query.id;
                const result = yield this.userCase.clubDetails(id);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    bookingPage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.query.id;
                const userId = req.userId || '';
                const result = yield this.userCase.bookingPage(id, userId);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    checkoutPage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.userId || '';
                const result = yield this.userCase.getCartDataForCheckout(id);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    allReviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userCase.allReviews();
                res.status(result.status).json(result.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    userReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId || '';
                const result = yield this.userCase.singleUserReview(userId);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    followClub(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId || '';
                const clubId = req.query.clubId;
                const result = yield this.userCase.followClub(userId, clubId);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    userNotifications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId || '';
                const notifications = yield this.userCase.userNotifications(userId);
                res.status(notifications.status).json(notifications.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    notificationCount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId || '';
                const count = yield this.userCase.newNotificationCount(userId);
                res.status(count.status).json(count.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    readNotification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId || '';
                const count = yield this.userCase.readNotification(userId);
                res.status(count.status).json(count.data);
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
                const result = yield this.userCase.forgotPassword(email);
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
                const result = yield this.userCase.forgotPasswordChange(forgotEmail, password);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    allFollowedClubs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId || '';
                const result = yield this.userCase.allFollowedClubs(userId);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    setUserBrowserToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId || '';
                const browserToken = req.body.token;
                const result = yield this.userCase.setBrowserToken(userId, browserToken);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
}
exports.default = UserController;
