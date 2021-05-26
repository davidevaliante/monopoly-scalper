import axios from 'axios'
import express from 'express'
import { parse, Node, HTMLElement } from 'node-html-parser';
import puppeteer from 'puppeteer'
import cron from 'node-cron'
import { scrapStats, scrapTable } from './data/scraping';
import { pushRows, pushTable } from './data/push'
import { asyncForEach } from './utils/utils'
import { createEmptyLowTierDiceTable, DiceRollRow, DiceTable } from './models/DiceTable'

const PORT = 4001

const app = express()


const scrap = async (browser : puppeteer.Browser) => {
    const page = await browser.newPage()

    await page.goto('https://tracksino.com/monopoly', { waitUntil: 'networkidle0' })

    const p = await page.evaluate(() => document.querySelector('*').outerHTML)

    await page.close()

    const root = parse(p)

    const tableRows = root.querySelectorAll('#spin-history')[0].querySelector('tbody').childNodes

    const formattedRows = await scrapTable(tableRows, browser)  


    const tables = await Promise.all([scrapLowDiceRollsTable(root), scrapMidDiceRollsTable(root), scrapHighDiceRollsTable(root)])

    const lowTable = tables.find((it : DiceTable) => it.type === 'low')
    const midTable = tables.find((it : DiceTable) => it.type === 'mid')
    const highTable = tables.find((it : DiceTable) => it.type === 'high')

    pushTable(lowTable, midTable, highTable)
    pushRows(formattedRows)
}

const scrapLowDiceRollsTable = async (root : HTMLElement) => {
    const lowTierDiceRollsTBody = root.querySelectorAll('#__BVID__210')[0].childNodes[0]
    const listOfRows = lowTierDiceRollsTBody.childNodes.filter((it : any) => it.rawTagName === 'tr')

    const rows : DiceRollRow[] = []

    await asyncForEach(listOfRows, async (row : Node, index : number) => {
        const percentageCol = row.childNodes[2]
        const percentageValue = parseFloat(percentageCol.childNodes[0].rawText.trim().replace('%',''))

        const landsColText = row.childNodes[4].rawText.replace('Rolls', '').trim()
        
        const splittedLandsText = landsColText.split('/')

        const lands = parseInt(splittedLandsText[0].trim())
        const total = parseInt(splittedLandsText[splittedLandsText.length-1].trim())

        const _row : DiceRollRow = {
            rowPosition : index,
            percentage : percentageValue,
            lands : lands,
            total : total
        }


        rows.push(_row)
    })

    const time = new Date().getTime()

    return new DiceTable(
        `${time.toString()}_low`,
        'low',
        time,
        rows
    )
}

const scrapMidDiceRollsTable = async (root : HTMLElement) => {
    const midTierDiceRollsTBody = root.querySelectorAll('#__BVID__232')[0].childNodes[0]
    const listOfRows = midTierDiceRollsTBody.childNodes.filter((it : any) => it.rawTagName === 'tr')
        

    const rows : DiceRollRow[] = []

    await asyncForEach(listOfRows, async (row : Node, index : number) => {
        const percentageCol = row.childNodes[2]
        const percentageValue = parseFloat(percentageCol.childNodes[0].rawText.trim().replace('%',''))

        const landsColText = row.childNodes[4].rawText.replace('Rolls', '').trim()
        
        const splittedLandsText = landsColText.split('/')

        const lands = parseInt(splittedLandsText[0].trim())
        const total = parseInt(splittedLandsText[splittedLandsText.length-1].trim())

        const _row : DiceRollRow = {
            rowPosition : index,
            percentage : percentageValue,
            lands : lands,
            total : total
        }
        
        rows.push(_row)
    })

    const time = new Date().getTime()

    return new DiceTable(
        `${time.toString()}_mid`,
        'mid',
        time,
        rows
    )
}

const scrapHighDiceRollsTable = async (root : HTMLElement) => {
    const midTierDiceRollsTBody = root.querySelectorAll('#__BVID__254')[0].childNodes[0]
    const listOfRows = midTierDiceRollsTBody.childNodes.filter((it : any) => it.rawTagName === 'tr')
        

    const rows : DiceRollRow[] = []

    await asyncForEach(listOfRows, async (row : Node, index : number) => {
        const percentageCol = row.childNodes[2]
        const percentageValue = parseFloat(percentageCol.childNodes[0].rawText.trim().replace('%',''))

        const landsColText = row.childNodes[4].rawText.replace('Rolls', '').trim()
        
        const splittedLandsText = landsColText.split('/')

        const lands = parseInt(splittedLandsText[0].trim())
        const total = parseInt(splittedLandsText[splittedLandsText.length-1].trim())

        const _row : DiceRollRow = {
            rowPosition : index,
            percentage : percentageValue,
            lands : lands,
            total : total
        }
        
        rows.push(_row)
    })

    const time = new Date().getTime()

    return new DiceTable(
        `${time.toString()}_high`,
        'high',
        time,
        rows
    )
}

let scrapingCount = 1

const options = {
    headless: true
}

app.listen(PORT, async ()  => {
    console.log(`Monopoly scraper running on ${PORT}`)

    process.on('warning', e => console.warn(e.stack))

    puppeteer.launch(options).then(browser => {
        // scrap(browser)

        cron.schedule('*/10 * * * * *', async () => {
            console.log(`Scraping Count ${scrapingCount}`)
            scrapingCount++
            await scrap(browser)
        })
    })
})


