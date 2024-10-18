// import { getTestData } from '../../helpers/excelReader.js';
import { By, until } from 'selenium-webdriver';
import { Select } from 'selenium-webdriver/lib/select.js';


const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const bulk_import_actions = async (all_locators, driver, fileName, data_file_path, import_option) => {
  try {
    console.log('kdjkfjkdj', all_locators);
    // Interactions after login
    await driver.wait(until.elementLocated(By.xpath(all_locators.Main_Menu_LT)), 10000);
    let loc_menu = await driver.findElement(By.xpath(all_locators.Main_Menu_LT));
    const actions = driver.actions({ async: true });

    // Simulate mouse hover and other actions
    await actions.move({ origin: loc_menu }).perform();
    console.log('Mouse hovered over the menu');

    let loc_menu_tools = await driver.findElement(By.xpath(all_locators.Main_Menu_Tool_Item));
    // await driver.executeScript('arguments[0].scrollIntoView({behavior: "smooth", block: "center"})', loc_menu_tools);
    await driver.wait(until.elementIsVisible(loc_menu_tools), 10000);
    await driver.wait(until.elementIsEnabled(loc_menu_tools), 10000);

    await actions.move({ origin: loc_menu_tools }).click().perform();
    console.log('Clicked on the tools menu item');

    const loc_bulk_actions = await driver.findElement(By.xpath(all_locators.Main_Menu_Tool_Item_BulkAction_Item));
    await driver.executeScript('arguments[0].scrollIntoView({behavior: "smooth", block: "center"})', loc_bulk_actions);
    await driver.wait(until.elementIsVisible(loc_bulk_actions), 10000);
    await driver.wait(until.elementIsEnabled(loc_bulk_actions), 10000);
    await loc_bulk_actions.click();

    const dropdown = await driver.wait(until.elementLocated(By.id('mySelect')), 5000);
    await dropdown.click();
    const select = new Select(dropdown);
    await select.selectByVisibleText(fileName);// Order Creation

    const dropdown_second = await driver.wait(until.elementLocated(By.xpath("(//select[@id='mySelect'])[2]")), 5000);
    await dropdown_second.click();
    const select_second = new Select(dropdown_second);
    await select_second.selectByVisibleText(import_option); //'Create'

    let fileInput = await driver.findElement(By.id('fileInput'));
    let filePath = data_file_path;  //'C:/Users/anmol.dhama/Downloads/sample_bulk_order_creation (4).csv'
    await fileInput.sendKeys(filePath);

    const loc_upload_file = await driver.findElement(By.xpath(all_locators.Bulkimport_Upload_File_BT));

    // Scroll to the element using JavaScript
    await driver.executeScript('arguments[0].scrollIntoView({behavior: "smooth", block: "center", inline: "end"})', loc_upload_file);
    
    // // Perform the click using actions, with retry mechanism
    await sleep(2000);
    // await actions.move({ origin: loc_upload_file }).perform();
    await loc_upload_file.click();
    
    


    // //varify the pop message for success
    // const getCurrentEpochInIST = () => {
    //   const currentTime = new Date();
    //   const istOffset = 5 * 60 * 60 * 1000 + 30 * 60 * 1000; // 5 hours 30 minutes in milliseconds
    //   const currentTimeInIST = new Date(currentTime.getTime() + istOffset);
      
    //   // Convert IST time to epoch (seconds since January 1, 1970)
    //   return Math.floor(currentTimeInIST.getTime() / 1000);
    // };
    // // store the upload time
    // const upload_time = getCurrentEpochInIST();
    // console.log('upload_time',upload_time);

    // click on activity log button
// Wait for the element to be present
const loc_activity_log = await driver.wait(until.elementLocated(By.xpath("//a[contains(text(),'Activity Log')]")), 10000);

// Scroll to the element using JavaScript
await driver.executeScript('arguments[0].scrollIntoView({behavior: "smooth", block: "center", inline: "end"})', loc_activity_log);

// Wait for the element to be visible
await driver.wait(until.elementIsVisible(loc_activity_log), 10000);

// Optionally, add a short sleep to let any animations complete
await sleep(2000);

// Click the element once it's visible and ready
await loc_activity_log.click();

//  return { upload_time };
  } catch (error) {
    console.error('Error during bulk order creation:', error);
  }
};

// export const validate_bulk_upload_data = async (testCaseName,)=>{
  
// }
