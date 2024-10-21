// helper_functions.js
import { By, until, Key } from 'selenium-webdriver';
import assert from 'assert';
import {FetchExcelData, getMostRecentFile} from '../../helpers/excelReader.js';
// import assert from 'assert';

// Sleep function
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Assert element text helper function
export const assertElementText = async (driver, locator, expectedText, errorMessage, assertionsErrors) => {
    try {
        let elementText = await driver.findElement(By.xpath(locator)).getText();

        if (locator === "//tbody/tr[1]/td[2]") {
            const slicedElementText = elementText.slice(0, 14);
            assert.equal(slicedElementText, expectedText, errorMessage);
            console.log(`Assertion passed: ${errorMessage} for sliced text.`);
        } else {
            assert.equal(elementText, expectedText, errorMessage);
            const screenshotData = await driver.takeScreenshot();
            console.log(`Assertion passed: ${errorMessage}`);
        }
    } catch (error) {
        assertionsErrors.push(`${error.message}`);
        console.error(`Assertion failed for ${errorMessage}:`, error);
    }
};

// Validate Data Against UI
export const validateDataAgainstUI = async (driver, row, assertionsErrors) => {
    try {
        await driver.sleep(2000);
        const shipNameElement = await driver.wait(until.elementLocated(By.xpath('/html/body/div[3]/div/div/div[2]/div/form/div/div[2]/div[2]/div[1]/div[2]/div[2]/input')), 10000);
        const shipEmailElement = await driver.wait(until.elementLocated(By.xpath('(//input[@class="form-control mb-2 tbl-date"])[2]')), 10000);
        
        await driver.wait(until.elementIsVisible(shipNameElement), 10000);
        await driver.wait(until.elementIsVisible(shipEmailElement), 10000);

        let shipuiName = (await shipNameElement.getAttribute('value')).trim();
        let shipuiEmail = (await shipEmailElement.getAttribute('value')).trim();

        console.log('Ship UI Name:', shipuiName);
        console.log('Ship UI Email:', shipuiEmail);

        try {
            assert.equal(
                row['buyer_shipping_name*'].trim(), 
                shipuiName, 
                `Row ${row['seller_order_id*']}: buyer_shipping_name does not match. Excel: ${row['buyer_shipping_name*'].trim()}, UI: ${shipuiName}`
            );
        } catch (error) {
            assertionsErrors.push(`Row ${row['seller_order_id*']}: buyer_shipping_name assertion failed. ${error.message}`);
        }

        try {
            assert.equal(row['buyer_shipping_email'].trim(),
                shipuiEmail, `Row ${row['seller_order_id*']}: buyer_shipping_email does not match. Excel: ${row['buyer_shipping_email']}, UI: ${shipuiEmail}`);
        } catch (error) {
            assertionsErrors.push(`Row ${row['seller_order_id*']}: buyer_shipping_email assertion failed. ${error.message}`);
        }
    } catch (error) {
        assertionsErrors.push(`UI Validation Error: ${error.message}`);
    }
};

//download the success file
export const downloadSuccessResponseFile = async (all_locators,driver)=>{
    const success_file_button = await driver.wait(until.elementLocated(By.xpath(all_locators.BulkAction_Activity_Log_Success_BT)), 10000);
    await success_file_button.click();
    await driver.sleep(1000);

    const most_recent_success_file = await getMostRecentFile("C:/Users/anmol.dhama/Desktop/Api-Automation/data/downloads");
    const success_file_data = await FetchExcelData(most_recent_success_file);
    return success_file_data;
}

export const navigate_to_orders_page = async (all_locators,driver)=>{
    try{
    await driver.wait(until.elementLocated(By.xpath(all_locators.Main_Menu_Items)), 20000);
    let menuItems = await driver.findElement(By.xpath(all_locators.Main_Menu_Orders_Dropdown));
    let actions = driver.actions({ async: true });
    await actions.move({ origin: menuItems }).perform();

    await driver.wait(until.elementLocated(By.xpath(all_locators.Main_Menu_Orders_Dropdown)), 20000);
    let orderDropdown = await driver.findElement(By.xpath(all_locators.Main_Menu_Orders_Dropdown));
    await actions.move({ origin: orderDropdown }).perform();

    await driver.sleep(2000);

    let orderPage = await driver.findElement(By.xpath(all_locators.Main_Menu_Orders_Dropdown_Orders_Page));
    await orderPage.click();

    await driver.wait(until.elementLocated(By.xpath(all_locators.Main_Menu_Orders_Dropdown_Orders_Page_Select_Orders)), 20000);
    let selectOrders = await driver.findElement(By.xpath(all_locators.Main_Menu_Orders_Dropdown_Orders_Page_Select_Orders));
    await actions.move({ origin: selectOrders }).perform();
    await selectOrders.click();


    await driver.wait(until.elementLocated(By.xpath(all_locators.Orders_Page_Create_Orders)), 10000);
    let createOrderElement = await driver.findElement(By.xpath(all_locators.Orders_Page_Create_Orders));
    await actions.move({ origin: createOrderElement }).perform();
    }catch(err){
        throw err;
    }
}

export const click_filer_insert_order_id = async(all_locators,driver,orderId)=>{
    try{
    const more_filter_event = await driver.findElement(By.xpath(all_locators.Orders_Page_More_Filers_BT));
    await more_filter_event.click();
    
    const inputElement = await driver.wait(until.elementLocated(By.xpath(all_locators.Orders_Page_Inside_Filters_Order_ID)), 10000);
    await inputElement.sendKeys(orderId);
    await inputElement.sendKeys(Key.ENTER);
    }catch(err){
        throw err;
    }
}
