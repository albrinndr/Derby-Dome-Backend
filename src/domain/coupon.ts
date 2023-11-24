interface CouponI {
    id?: string;
    name: string,
    desc: string;
    minPrice: number;
    discount: number;
    startingDate: Date;
    endingDate: Date;
    users?: string[];
}
export default CouponI;
