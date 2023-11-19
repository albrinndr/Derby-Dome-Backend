import GenSeats from "../../useCase/interface/genSeats";

class GenerateSeats implements GenSeats{
    private baseValue: number;
    constructor() {
        this.baseValue = 101;
    }
    generateSeatNumbers(row1: string, row1Count: number, row2: string, row2Count: number, ticketCount: number):[] {
        let tickets: any = [];
        if (row1Count >= ticketCount) {
            let arr = [];
            for (let i = 1; i <= ticketCount; i++) {
                arr.push(this.baseValue - row1Count);
                row1Count--;
            }
            tickets = [{
                row: row1,
                userSeats: [...arr]
            }];

        } else if (row2Count >= ticketCount) {
            let arr = [];
            for (let i = 1; i <= ticketCount; i++) {
                arr.push(this.baseValue - row2Count);
                row2Count--;
            }
            tickets = [{
                row: row2,
                userSeats: [...arr]
            }];
        } else {
            let firstSet = row1Count;
            let arr1 = [];

            for (let i = 0; i < firstSet; i++) {
                arr1.push(this.baseValue - row1Count);
                row1Count--;
            }

            let secondSet = ticketCount - arr1.length;
            let arr2 = [];
            for (let j = 0; j < secondSet; j++) {
                arr2.push(this.baseValue - row2Count);
                row2Count--;
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
