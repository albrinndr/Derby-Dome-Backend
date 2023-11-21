import GenSeats from "../../useCase/interface/genSeats";

class GenerateSeats implements GenSeats {
    private baseValue: number;
    constructor() {
        this.baseValue = 100;
    }
    generateSeatNumbers(row1: string, row1Count: number, row2: string, row2Count: number, ticketCount: number,
        row1Array: number[], row2Array: number[]): [] {

        let tickets: any = [];

        if (row1Count >= ticketCount) {

            let arr: any = [];
            let start = 1;
            if (arr.length) start = Math.max(...arr);
            for (let i = start; i <= this.baseValue; i++) {
                if (!row1Array.includes(i) && !arr.includes(i)) {
                    arr.push(i);
                }
                if (arr.length === ticketCount) break;
            }

            tickets = [{
                row: row1,
                userSeats: [...arr]
            }];


        } else if (row2Count >= ticketCount) {
            let arr: any = [];
            let start = 1;
            if (arr.length) start = Math.max(...arr);
            for (let i = start; i <= this.baseValue; i++) {
                if (!row2Array.includes(i) && !arr.includes(i)) {
                    arr.push(i);
                }
                if (arr.length === ticketCount) break;
            }

            tickets = [{
                row: row2,
                userSeats: [...arr]
            }];

        } else {
            let firstSet = row1Count;
            let arr1: any = [];

            let start1 = 1;
            if (arr1.length) start1 = Math.max(...arr1);
            for (let i = start1; i <= this.baseValue; i++) {
                if (!row2Array.includes(i) && !arr1.includes(i)) {
                    arr1.push(i);
                }
                if (arr1.length === firstSet) break;
            }


            let secondSet = ticketCount - arr1.length;
            let arr2: any = [];
            let start2 = 1;
            if (arr2.length) start2 = Math.max(...arr2);
            for (let i = start2; i <= this.baseValue; i++) {
                if (!row2Array.includes(i) && !arr2.includes(i)) {
                    arr2.push(i);
                }
                if (arr2.length === secondSet) break;
            }

            tickets = [{
                row: row1,
                userSeats: [...arr1]
            }, {
                row: row2,
                userSeats: [...arr2]
            }
            ];
        }
        return tickets;
    }
}
export default GenerateSeats;
