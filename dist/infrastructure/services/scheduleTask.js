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
const node_schedule_1 = __importDefault(require("node-schedule"));
const firebaseNotification_1 = __importDefault(require("./firebaseNotification"));
const firebaseNotification = new firebaseNotification_1.default();
class ScheduleTask {
    scheduleTimePrice(execFn) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentDate = new Date();
            const futureDate = new Date(currentDate.setDate(currentDate.getDate() + 17));
            // const tempDate = new Date();
            // tempDate.setMinutes(tempDate.getMinutes() + 1);
            node_schedule_1.default.scheduleJob(futureDate, () => __awaiter(this, void 0, void 0, function* () {
                yield execFn();
            }));
        });
    }
    removeFromCart(execFn) {
        return __awaiter(this, void 0, void 0, function* () {
            const execTime = new Date();
            execTime.setMinutes(execTime.getMinutes() + 10);
            node_schedule_1.default.scheduleJob(execTime, () => __awaiter(this, void 0, void 0, function* () {
                yield execFn();
            }));
        });
    }
    notificationManagement(date1, date2, execFn1, execFn2, notificationArray) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('inside notification timer');
            // const execTime1 = new Date();
            // const execTime2 = new Date();
            // execTime1.setMinutes(execTime1.getMinutes() + 1);
            // execTime2.setMinutes(execTime2.getMinutes() + 5);
            const execTime1 = new Date(date1);
            const execTime2 = new Date(date2);
            node_schedule_1.default.scheduleJob(execTime1, () => __awaiter(this, void 0, void 0, function* () {
                // console.log('working one');
                firebaseNotification.sendWebPushNotification(notificationArray);
                yield execFn1();
            }));
            node_schedule_1.default.scheduleJob(execTime2, () => __awaiter(this, void 0, void 0, function* () {
                // console.log('working two');
                yield execFn2();
            }));
        });
    }
}
exports.default = ScheduleTask;
