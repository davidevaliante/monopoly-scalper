import axios from 'axios'
import { Spin } from '../models/Spin'
import { Symbol } from '../models/Symbol'
import { DiceTable } from './../models/DiceTable';

const API_ROOT = 'https://monopoly.spike-realtime-api.eu/api'

// const API_ROOT = 'http://localhost:5002/api'


export const pushRows = async (rows : Spin[]) => {
    const write = await axios.post(`${API_ROOT}/write-spins`, rows)

    console.log(write.data)

    // console.log(results.map(r => r.data))
}

export const pushTable = async (lowTable : DiceTable, midTable : DiceTable, highTable : DiceTable) => {

    console.log('pushing')
    const write = await axios.post(`${API_ROOT}/write-table`, [lowTable, midTable, highTable])
}

export const updateHourlySpinForSymbol = async (symbol : Symbol) => {

}