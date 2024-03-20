export class CabinLayout {
    constructor(
        public layoutId: string,
        public width: number,
        public length: number,
        public rows: Row[],
        public version: number
    ) { }
}

export class Row {
    constructor(
        public seatType: string,
        public seatGroups: number[],
        public extraSpace: number
    ) { }
}
