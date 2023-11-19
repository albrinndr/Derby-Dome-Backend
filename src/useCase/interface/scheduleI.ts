interface ScheduleI {
    scheduleTimePrice(execFn: () => any): Promise<any>;
    removeFromCart(execFn: () => any): Promise<any>;
}
export default ScheduleI;
