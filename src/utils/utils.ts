export async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

export enum SlotResultSymbols {
    one='one',
    two='two',
    five='five',
    ten='ten',
    cashhunt='cashhunt',
    pachinko='pachinko',
    coinflip='coinflip',
    crazytime='crazytime'
}

export enum SpinResultSymbols {
    one='one',
    two='two',
    five='five',
    ten='ten',
    tworolls='tworolls',
    fourrolls='fourrolls',
    chance='chance'
}

export const spinResultImageToSymbol = (imageValue : string) : SpinResultSymbols => {
    const options = {
        'ico-monopoly-1' : SpinResultSymbols.one,
        'ico-monopoly-2' : SpinResultSymbols.two,
        'ico-monopoly-5' : SpinResultSymbols.five,
        'ico-monopoly-10' : SpinResultSymbols.ten,
        'ico-monopoly-chance' : SpinResultSymbols.chance,
        'ico-monopoly-2r' : SpinResultSymbols.tworolls,
        'ico-monopoly-4r' : SpinResultSymbols.fourrolls,
    }

    return options[imageValue]
}

export const spinResultImageNameToSymbol = (imageValue : string) : SpinResultSymbols => {
    const options = {
        'ico-crazytime-1' : SlotResultSymbols.one,
        'ico-crazytime-2' : SlotResultSymbols.two,
        'ico-crazytime-5' : SlotResultSymbols.five,
        'ico-crazytime-10' : SlotResultSymbols.ten,
        'ico-crazytime-ch' : SlotResultSymbols.cashhunt,
        'ico-crazytime-pa' : SlotResultSymbols.pachinko,
        'ico-crazytime-cf' : SlotResultSymbols.coinflip,
        'ico-crazytime-ct' : SlotResultSymbols.crazytime
    }

    return options[imageValue]
}