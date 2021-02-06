const edge = require('selenium-webdriver/edge')
const {By, until} = require('selenium-webdriver')
let driver
const timeout = 20000
const waitTimeout = 1500
jest.setTimeout(timeout)
let checkedURL
let yearValuesArray
let pricesToCheckArray
const webpage = 'https://www.autohero.com/de/search/'
const screen = {
    width: 3840,
    height: 2160
}

async function pageUrl() {
    checkedURL = await driver.getCurrentUrl()
    return checkedURL
}

describe('Example Selenium/js test', () => {
    beforeAll(async () => {
        let options = new edge.Options()
        options.setEdgeChromium(true)
        options.windowSize(screen)
        options.addArguments('headless')
        driver = edge.Driver.createSession(options)
    })

    afterAll(async ()=>{
    driver.quit()
    })

test('Check registration date', async()=> {
    await driver.get(webpage)
    await expect(driver.findElement(By.id('yearFilter'))).toBeVisible
    await driver.findElement(By.id('yearFilter')).click()
    await driver.wait(until.elementIsVisible(driver.findElement(By.xpath('//*[@id="yearFilter"]/..//*[@id="rangeStart"]'))), waitTimeout)
    await expect(driver.findElement(By.xpath('//*[@id="yearFilter"]/..//*[@id="rangeStart"]'))).toBeVisible
    await driver.findElement(By.xpath('//*[@id="yearFilter"]/..//*[@id="rangeStart"]')).click()
    await expect(driver.findElement(By.xpath('//*[@data-qa-selector-value=2015]'))).toBeVisible
    await driver.findElement(By.xpath('//*[@data-qa-selector-value=2015]')).click()
    await pageUrl()
    await expect(checkedURL).toMatch(webpage+'?yearMin=2015')
    await expect(driver.findElement(By.id('sortBy'))).toBeVisible
    await driver.findElement(By.id('sortBy')).click()
    await expect(driver.findElement(By.xpath('//*[@data-qa-selector-value="offerPrice.amountMinorUnits.desc"]'))).toBeVisible
    await driver.findElement(By.xpath('//*[@data-qa-selector-value="offerPrice.amountMinorUnits.desc"]')).click()
    await pageUrl()
    await expect(checkedURL).toMatch(webpage+'?sort=PRICE_DESC&yearMin=2015')
    await driver.sleep(750)
    await driver.wait(until.elementIsVisible(driver.findElement(By.xpath('//*[@data-qa-selector="ad-items"]'))), waitTimeout)
    await driver.wait(until.elementIsVisible(driver.findElement(By.xpath('//*[@data-qa-selector="spec-list"]//*[@data-qa-selector="spec"][1]'))), waitTimeout)
    yearValuesArray = await driver.findElements(By.xpath('//*[@data-qa-selector="spec-list"]//*[@data-qa-selector="spec"][1]'))
    let iterator = yearValuesArray.values()
    let yearArray = new Array()
    for(i=0 ;i<yearValuesArray.length-1; i++)
    {
        yearArray[i] = await iterator.next().value.getText()
        yearArray[i] = Number(yearArray[i])
        expect(yearArray[i]).toBeGreaterThanOrEqual(2015)
    }
    await driver.wait(until.elementIsVisible(driver.findElement(By.xpath('//*[@data-qa-selector="price"]'))), waitTimeout)
    pricesToCheckArray = await driver.findElements(By.xpath('//*[@data-qa-selector="price"][1]'))
    iterator = pricesToCheckArray.values()
    let pricesArray = new Array()
    for(i=0 ;i<pricesToCheckArray.length-1; i++)
    {
        pricesArray[i] = await iterator.next().value.getText()

        if (i<1)
        {
            pricesArray[i] = parseFloat(pricesArray[i])
        }
            else
        {
            pricesArray[i] = parseFloat(pricesArray[i])
            expect(pricesArray[i]).toBeLessThanOrEqual(pricesArray[i-1])
        }
    }
})
})
