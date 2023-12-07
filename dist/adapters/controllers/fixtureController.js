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
class FixtureController {
    constructor(FixtureCase, CloudinaryUpload) {
        this.FixtureCase = FixtureCase;
        this.CloudinaryUpload = CloudinaryUpload;
    }
    getFixtureFormContent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // let date = new Date(req.body.date);
                // date.setDate(date.getDate() + 1);    
                const fixtureData = yield this.FixtureCase.fixtureContent(req.body.date, req.clubId || '');
                res.status(fixtureData.status).json(fixtureData.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    createNewFixture(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.file) {
                    const imageUrl = yield this.CloudinaryUpload.upload(req.file.path, 'matchday-posters');
                    const formData = Object.assign(Object.assign({}, req.body), { clubId: req.clubId, poster: imageUrl.secure_url });
                    req.app.locals.paymentDataClub = {
                        user: 'club',
                        data: formData
                    };
                    const fixture = yield this.FixtureCase.paymentGenerate(formData);
                    res.status(fixture.status).json(fixture.data);
                }
                else {
                    res.status(400).json({ message: 'Upload a matchday Poster' });
                }
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    getClubFixtures(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.clubId || '';
                const fixtures = yield this.FixtureCase.clubFixtures(id);
                res.status(fixtures.status).json(fixtures.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
    cancelFixture(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const result = yield this.FixtureCase.cancelFixture(id);
                res.status(result.status).json(result.data);
            }
            catch (error) {
                const err = error;
                res.status(400).json(err.message);
            }
        });
    }
}
exports.default = FixtureController;
