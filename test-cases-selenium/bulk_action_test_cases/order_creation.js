import { bulk_import_actions } from "../generic_functions/bulk_actions.js";
import {
  assertElementText,
  validateDataAgainstUI,
  downloadSuccessResponseFile,
  navigate_to_orders_page,
  click_filer_insert_order_id
} from '../generic_functions/helper_functions.js';
import { getTestData } from '../../helpers/excelReader.js';
import { By, until } from 'selenium-webdriver';
import assert from 'assert';
import dotenv from 'dotenv';

dotenv.config();

let all_locators;
let driver;


export const testCase_Create_order_with_one_success_one_error_invalid_shipping_address = async (loginResult) => {
  driver = loginResult.driver;
  all_locators = loginResult.locators;

  if (!driver) {
    console.error("Login failed, stopping further actions.");
    return;
  }

  const testCaseName = "testCaseOne";
  const excelName = process.env.EXCEL_NAME || "testData.xlsx";
  const worksheetName = "BulkActions";
  const fileName = "Order Creation";
  const data_file_path = process.env.BULK_ORDER_UPLOAD_FILE_PATH || "C:/Users/anmol.dhama/Downloads/sample_bulk_order_creation (4).csv";
  const import_option = "Create";

  // Retrieve bulk data from Excel
  const { testData } = await getTestData(testCaseName, excelName, worksheetName);

  // Perform bulk import action
  const { upload_time } = await bulk_import_actions(all_locators, driver, fileName, data_file_path, import_option);
  console.log("Upload Time:", upload_time);

  let assertionsErrors = [];

  // Validate the fileName
  const file_name_text = await driver.findElement(By.xpath(all_locators.Bulkimport_FileName)).getText();
  const trimmed_text = file_name_text.substring(5, 11);
  if (trimmed_text !== upload_time) {
    assertionsErrors.push("Uploaded file does not match the activity log.");
  } else {
    assert.equal(trimmed_text, upload_time, "Uploaded file does not match the activity log.");
  }

  // Download the success file
  const success_file_data = await downloadSuccessResponseFile(all_locators, driver);

  try {
    // Validate the imported data counts
    await assertElementText(driver, all_locators.Bulkimport_Import_Info, testData.import_info, 'Import info text does not match.', assertionsErrors);
    await assertElementText(driver, all_locators.Bulkimport_Import_Count, `${testData.import_counts}`, 'Import counts do not match.', assertionsErrors);
    await assertElementText(driver, all_locators.Bulkimport_Sucess, `${testData.success}`, 'Success count does not match.', assertionsErrors);
    await assertElementText(driver, all_locators.Bulkimport_Errors, testData.errors.toString(), 'Error count does not match.', assertionsErrors);
  } catch {

  }
  // Fetch data from the CSV
  // const { validHeaders, validData } = await FetchExcelData("C:/Users/anmol.dhama/Downloads/sample_bulk_order_creation (4).csv");


  // Go to the order screen

  try {
    //navigate to orders page
    await navigate_to_orders_page(all_locators, driver);

    for (let i = 0; i < success_file_data.validData.length; i++) {
      const row = success_file_data.validData[i];
      const orderId = row["seller_order_id*"];

      if (i >= 1) {
        const backToMainGridButton = await driver.findElement(By.xpath(all_locators.Orders_Details_Page_Back_BT));
        await driver.executeScript('arguments[0].scrollIntoView({ behavior: "smooth", block: "center" });', backToMainGridButton);
        await driver.sleep(2000);
        await driver.wait(until.elementIsVisible(backToMainGridButton), 10000);
        await backToMainGridButton.click();
      }

      //click on more filter button
      await click_filer_insert_order_id(all_locators, driver, orderId);

      await driver.sleep(1000);
      const elementXPath = `(//b[contains(., '${orderId}')])[1]`;
      const mainOrderId = await driver.findElement(By.xpath(elementXPath));
      await driver.sleep(2000);


      await driver.executeScript('arguments[0].scrollIntoView({ behavior: "smooth", block: "center" });', mainOrderId);

      await driver.wait(until.elementIsVisible(mainOrderId), 10000);


      try {
        console.log(`Order ${orderId} found successfully!`);
        await mainOrderId.click();
      } catch (error) {
        console.error(`Failed to click on Order ${orderId}:`, error);
      }

      await validateDataAgainstUI(driver, row, assertionsErrors);
    }

  } catch (error) {
    console.error('Error occurred:', error);
  } finally {
    if (assertionsErrors.length > 0) {
      console.error('Assertions errors found:', assertionsErrors);
    }

    // await driver.quit();
  }
  return assertionsErrors;
};

// export const testCase_upload_bulk_order_creation_excel_multi_error_file = async () =>{

//   const testCaseName = "testCaseOne";
//   const excelName = process.env.EXCEL_NAME || "testData.xlsx";
//   const worksheetName = "BulkActions";
//   const fileName = "Order Creation";
//   const data_file_path = process.env.BULK_ORDER_UPLOAD_FILE_PATH_ERRORS || "C:/Users/anmol.dhama/Downloads/sample_bulk_order_creation (4).csv";
//   const import_option = "Create";

//   // Perform bulk import action
//   const { upload_time } = await bulk_import_actions(all_locators, driver, fileName, data_file_path, import_option);
// }



