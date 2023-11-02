interface ScheduleI {
    scheduleTimePrice(execFn: () => any): Promise<any>;
}
export default ScheduleI;
