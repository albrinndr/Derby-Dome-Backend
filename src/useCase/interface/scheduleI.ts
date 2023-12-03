interface ScheduleI {
    scheduleTimePrice(execFn: () => any): Promise<any>;
    removeFromCart(execFn: () => any): Promise<any>;
    notificationManagement(date1: Date, date2: Date, execFn: () => Promise<any>, execFn2: () => Promise<any>, notificationArray: {}[]): Promise<any>;
}
export default ScheduleI;
