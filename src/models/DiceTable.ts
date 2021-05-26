export class DiceTable {
    constructor(
        public id : string,
        public type : 'low' | 'mid' | 'high',
        public timeOfSpin : number,
        public rows : DiceRollRow[]
    ){}
}

export const createEmptyLowTierDiceTable = () => {
    return new DiceTable(
        'default_id',
        'low',
        0,
        []
    )
}

export interface DiceRollRow {
    rowPosition : number
    percentage : number,
    lands : number,
    total : number
}