import { getChromeDriver } from '../helpers/configurations.js';
import { getTestData } from '../helpers/excelReader.js';
import { By, until } from 'selenium-webdriver';
import { Select } from 'selenium-webdriver/lib/select.js';




export const bulk_order_creation = async (bulk_action_file,worksheet,fileName) => {
    // log in 
    try {
        const { testData, locators } = await getTestData('Test_Login_Valid_Details', 'LoginData'); // Pass test case name and sheet name
       
        // Check if required test data exists
        if (!testData.username || !testData.password) {
          console.log('Test data for username or password not found.');
          return;
        }
    
        // Check if required locators exist
        if (!locators.usernameLocator || !locators.passwordLocator || !locators.loginButtonLocator) {
          console.log('Locators for username, password, or login button not found.');
          return;
        }
    
        const driver = await getChromeDriver();
        await driver.get('https://uat.rapidshyp.com/');
    
        // Locate the elements using the dynamically fetched locators
        let usernameField = await driver.findElement(By.css(locators.usernameLocator)); // Using CSS locator
        let passwordField = await driver.findElement(By.xpath(locators.passwordLocator)); // Using XPath locator
        await usernameField.sendKeys(testData.username);
        await passwordField.sendKeys(testData.password);
    
        let loginButton = await driver.findElement(By.xpath(locators.loginButtonLocator)); // Using XPath locator
        await loginButton.click();
    
        // await driver.wait(until.titleIs('Dashboard'), 10000);
    
        console.log('Login Test Passed: Successfully logged in.');

        // Open Bulk Action page
       // Wait for the element to be present in the DOM
    await driver.wait(until.elementLocated(By.xpath("//html/body/div[3]/div/aside")), 10000); // Wait for up to 10 seconds

    // Now find the element
    let loc_menu = await driver.findElement(By.xpath("//html/body/div[3]/div/aside"));

    // Create an Actions object
    const actions = driver.actions({ async: true });

    // Move to the menu element to simulate mouse hover
    await actions.move({ origin: loc_menu }).perform();
    console.log('Mouse hovered over the menu');


    //Click On tools
    let loc_menu_tools = driver.findElement(By.xpath("//html/body/div[3]/div/aside/ul/li[9]"));
    await driver.executeScript('arguments[0].scrollIntoView({behavior: "smooth", block: "center"})', loc_menu_tools);
    // Wait for the element to be clickable before performing click
    await driver.wait(until.elementIsVisible(loc_menu_tools), 10000); // Wait for the element to be visible
    await driver.wait(until.elementIsEnabled(loc_menu_tools), 10000); // Wait for the element to be enabled
    
    // Click on the tools element
    await actions.move({ origin: loc_menu_tools }).click().perform();
    console.log('Clicked on the tools menu item');

    // click on bulk actions
    const loc_bulk_actions = driver.findElement(By.xpath("//a[div[@class='text-truncate menu-length' and text()='Bulk Import']]"));

    await driver.executeScript('arguments[0].scrollIntoView({behavior: "smooth", block: "center"})', loc_bulk_actions);
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    // Usage
    await sleep(2000);
    await driver.wait(until.elementIsVisible(loc_bulk_actions), 10000); // Wait for the element to be visible
    await driver.wait(until.elementIsEnabled(loc_bulk_actions), 10000); // Wait for the element to be enabled

    await loc_bulk_actions.click();

    // select the Order Creation Option in the dropdown
    // Wait until the dropdown is visible
    const dropdown = await driver.wait(
        until.elementLocated(By.id('mySelect')),
        5000
      );
  
      // Click to open the dropdown
      await dropdown.click();
      
      // Initialize the Select object to work with the dropdown
      const select = new Select(dropdown);
  
      // Select the option by visible text
      await select.selectByVisibleText('Order Creation');

     // click on second dropdown and select create

     const dropdown_second = await driver.wait(
        until.elementLocated(By.xpath("(//select[@id='mySelect'])[2]")),
        5000
      );
  
      // Click to open the dropdown
      await dropdown_second.click();
      
      // Initialize the Select object to work with the dropdown
      const select_second = new Select(dropdown_second);
     
      // Select the option by visible text
      await select_second.selectByVisibleText('Create');

      
      let fileInput = await driver.findElement(By.id('fileInput'));

      // Specify the full file path to the file you want to upload
      let filePath = 'C:/Users/anmol.dhama/Downloads/sample_bulk_order_creation (4).csv'; // Make sure to provide the correct file path

      // Send the file path to the hidden input field
      await fileInput.sendKeys(filePath);

      // click on upload button

      const loc_upload_file = driver.findElement(By.xpath("//button[contains(text(),'Upload File')]"));
      
      await driver.executeScript('arguments[0].scrollIntoView({behavior: "smooth", block: "center"})', loc_upload_file);

      await loc_upload_file.click();
      
      // Click on Activity Log and verify data
      

    // await driver.quit();
      } catch (error) {
        console.error('Error during login test execution:', error);
      }
};
