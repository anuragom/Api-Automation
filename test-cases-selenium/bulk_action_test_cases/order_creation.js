import { bulk_import_actions } from "../generic_functions/bulk_actions.js";
import { login } from '../generic_functions/login.js';
import { getTestData,FetchExcelData } from '../../helpers/excelReader.js';
import { By, until } from 'selenium-webdriver';
import assert from 'assert';

let all_locators;
let driver; 
// let loginResult;
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const assertElementText = async (driver, locator, expectedText, errorMessage) => {
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
      const screenshotData = await driver.takeScreenshot();
      console.error(`Assertion failed for ${errorMessage}:`, error);
      throw error;
    }
  };

// export const loginTest = async ()=>{
//     loginResult = await login();
//     console.log('loginTestResult',loginResult);

// }

export const testCase_Create_order_with_one_success_one_error_invalid_shipping_address = async (loginResult) => {
  driver = loginResult.driver;
  all_locators = loginResult.locators;

  if (!driver) {
      console.error("Login failed, stopping further actions.");
      return;
  }

  const testCaseName = "testCaseOne";
  const excelName = "testData.xlsx";
  const worksheetName = "BulkActions";
  const fileName = "Order Creation";
  const data_file_path = process.env.BULK_ORDER_FILE_PATH || "C:/Users/anmol.dhama/Downloads/sample_bulk_order_creation (4).csv";
  const import_option = "Create";

  // Retrieve bulk data from Excel
  const { testData } = await getTestData(testCaseName, excelName, worksheetName);

  // Perform bulk import action
  await bulk_import_actions(all_locators, driver, fileName, data_file_path, import_option);

  // Dynamic wait for the file upload info
  await driver.wait(until.elementLocated(By.xpath(all_locators.Bulkimport_Import_Info)), 10000);

  // Validate the imported data counts
  await assertElementText(driver, all_locators.Bulkimport_Import_Info, testData.import_info, 'Import info text does not match.');
  await assertElementText(driver, all_locators.Bulkimport_Import_Count, `${testData.import_counts}`, 'Import counts do not match.');
  await assertElementText(driver, all_locators.Bulkimport_Sucess, `${testData.success}`, 'Success count does not match.');
  await assertElementText(driver, all_locators.Bulkimport_Errors, testData.errors.toString(), 'Error count does not match.');

  // Fetch data from the CSV
  const { validHeaders, validData } = await FetchExcelData("C:/Users/anmol.dhama/Downloads/sample_bulk_order_creation (4).csv");

  // Go to the order screen
  const LOC_MENU_ITEMS = '//html/body/div[3]/div/aside';
  const LOC_ORDER_DROPDOWN = '//html/body/div[3]/div/aside/ul/li[3]';
  const LOC_ORDER_PAGE = '//*[@id="layout-menu"]/ul/li[3]/a/div';
  const LOC_SELECT_ORDERS = '//html/body/div[3]/div/aside/ul/li[3]/ul/li[1]/a';

  try {

      await driver.wait(until.elementLocated(By.xpath(LOC_MENU_ITEMS)), 20000);

      let menuItems = await driver.findElement(By.xpath(LOC_MENU_ITEMS));
      let actions = driver.actions({ async: true });
      await actions.move({ origin: menuItems }).perform();


      await driver.wait(until.elementLocated(By.xpath(LOC_ORDER_DROPDOWN)), 20000);

   
      let orderDropdown = await driver.findElement(By.xpath(LOC_ORDER_DROPDOWN));
      await actions.move({ origin: orderDropdown }).perform();

      await driver.sleep(2000);

      // Click on the ORDER PAGE link
      let orderPage = await driver.findElement(By.xpath(LOC_ORDER_PAGE));
      await orderPage.click();

      // Wait until the SELECT ORDERS element is present
      await driver.wait(until.elementLocated(By.xpath(LOC_SELECT_ORDERS)), 20000);

      // Hover over the SELECT ORDERS
      let selectOrders = await driver.findElement(By.xpath(LOC_SELECT_ORDERS));
      await actions.move({ origin: selectOrders }).perform();

      // Click on SELECT ORDERS
      await selectOrders.click();
      
      // Build the XPath for 'Create Single Order' button
      const createOrderXPath = `//button[@title='Create Single Order' and contains(@class, 'btn-primary')]`;

      // Wait for the 'Create Single Order' button to be clickable
      await driver.wait(until.elementLocated(By.xpath(createOrderXPath)), 10000);
      let createOrderElement = await driver.findElement(By.xpath(createOrderXPath));

      
      await actions.move({ origin: createOrderElement }).perform();

      for (let i = 0; i < validData.length; i++) {
          const row = validData[i];
          const orderId = row["seller_order_id*"];
          
          if(i>=1){
            const backToMainGridButton = await driver.findElement(By.xpath("//button[contains(text(),'Back')]"));

            // Scroll into view smoothly and center the element
            await driver.executeScript('arguments[0].scrollIntoView({ behavior: "smooth", block: "center" });', backToMainGridButton);
            await driver.sleep(2000);
            // Wait for the element to be located and visible
            await driver.wait(until.elementIsVisible(backToMainGridButton), 10000);
            
            // Click on the "Back" button once it is visible
            await backToMainGridButton.click();
            
          }

          // Build the XPath dynamically using the seller_order_id* value
          const elementXPath = `(//b[contains(., '${orderId}')])[1]`;
          
          // Wait for the element to be located and visible (using the dynamic XPath)
          await driver.wait(until.elementLocated(By.xpath(elementXPath)), 10000);
          await driver.wait(until.elementIsVisible(driver.findElement(By.xpath(elementXPath))), 10000); // Wait for visibility

          // Find the element and click on it
          let bElement = await driver.findElement(By.xpath(elementXPath));
          await actions.move({ origin: bElement }).perform();
          console.log(`Order ${orderId} found successfully!`);
          await bElement.click();

          // Validate data against UI for each order
          await validateDataAgainstUI(driver, row);
      }
  } catch (error) {
      // Handle any errors that occur during the execution of the above code
      console.error('Error occurred:', error);
  } finally{
    await driver.quit();
  }
};
async function validateDataAgainstUI(driver, row) {
  // Locate the elements first and store them
  const shipNameElement = await driver.wait(until.elementLocated(By.xpath('/html/body/div[3]/div/div/div[2]/div/form/div/div[2]/div[2]/div[1]/div[2]/div[2]/input')), 10000);
  const shipEmailElement = await driver.wait(until.elementLocated(By.xpath('(//input[@class="form-control mb-2 tbl-date"])[2]')), 10000);

  // Wait for both elements to be visible
  await driver.wait(until.elementIsVisible(shipNameElement), 10000);
  await driver.wait(until.elementIsVisible(shipEmailElement), 10000);

  // Retrieve the values of the elements
  let shipuiName = await shipNameElement.getAttribute('value');
  let shipuiEmail = await shipEmailElement.getAttribute('value');

  // Logging the values for debugging
  console.log('Ship UI Name:', shipuiName);
  console.log('Ship UI Email:', shipuiEmail);

  // Compare Excel data to UI data
  assert.equal(row['buyer_shipping_name*'], shipuiName, `Row ${row['seller_order_id*']}: buyer_shipping_name does not match. Excel: ${row['buyer_shipping_name*']}, UI: ${shipuiName}`);
  assert.equal(row['buyer_shipping_email'], shipuiEmail, `Row ${row['seller_order_id*']}: buyer_shipping_email does not match. Excel: ${row['buyer_shipping_email']}, UI: ${shipuiEmail}`);
}








//validate pop up
//correct screenshot
//correct the assertion
