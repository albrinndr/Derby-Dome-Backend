import ScheduleI from "../../useCase/interface/scheduleI";
import schedule from 'node-schedule';

class ScheduleTask implements ScheduleI {
    async scheduleTimePrice(execFn: () => Promise<any>): Promise<any> {
        const currentDate = new Date();
        const futureDate = new Date(currentDate.setDate(currentDate.getDate() + 12));

        // const tempDate = new Date();
        // tempDate.setMinutes(tempDate.getMinutes() + 1);

        schedule.scheduleJob(futureDate, async () => {
            await execFn();
        });
    }
}
export default ScheduleTask;
