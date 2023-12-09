import ScheduleI from "../../useCase/interface/scheduleI";
import schedule from 'node-schedule';
import FirebaseNotification from "./firebaseNotification";
import { TokenI } from "../../useCase/interface/notificationI";

const firebaseNotification = new FirebaseNotification();

class ScheduleTask implements ScheduleI {
    async scheduleTimePrice(execFn: () => Promise<any>): Promise<any> {
        const currentDate = new Date();
        const futureDate = new Date(currentDate.setDate(currentDate.getDate() + 17));

        // const tempDate = new Date();
        // tempDate.setMinutes(tempDate.getMinutes() + 1);

        schedule.scheduleJob(futureDate, async () => {
            await execFn();
        });
    }
    async removeFromCart(execFn: () => Promise<any>): Promise<any> {
        const execTime = new Date();
        execTime.setMinutes(execTime.getMinutes() + 10);
        schedule.scheduleJob(execTime, async () => {
            await execFn();
        });
    }

    async notificationManagement(date1: Date, date2: Date, execFn1: () => Promise<any>, execFn2: () => Promise<any>,notificationArray:TokenI[]): Promise<any> {
        // console.log('inside notification timer');

        // const execTime1 = new Date();
        // const execTime2 = new Date();
        // execTime1.setMinutes(execTime1.getMinutes() + 1);
        // execTime2.setMinutes(execTime2.getMinutes() + 5);
        const execTime1 = new Date(date1);
        const execTime2 = new Date(date2);

        schedule.scheduleJob(execTime1, async () => {
            // console.log('working one');
            firebaseNotification.sendWebPushNotification(notificationArray);
            await execFn1();
        });

        schedule.scheduleJob(execTime2, async () => {
            // console.log('working two');
            await execFn2();
        });
    }
}
export default ScheduleTask;
