import { getChromeDriver } from '../helpers/configurations.js';
import { getTestData } from '../helpers/excelReader.js';
import { By, until } from 'selenium-webdriver';

// Helper function to perform login action
// const performLogin = async (loginData, driver) => {
//   await driver.get('https://uat.rapidshyp.com/');
  
//   let usernameField = await driver.findElement(By.id('email'));
//   let passwordField = await driver.findElement(By.xpath("//input[@type='password']"));
//   await usernameField.sendKeys(loginData.username);
//   await passwordField.sendKeys(loginData.password);

//   let loginButton = await driver.findElement(By.xpath("//button[contains(text(),'Sign in')]"));
//   await loginButton.click();
// };

// Test case 1: Successful login
export const successfulLoginTest = async () => {
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
  
      await driver.wait(until.titleIs('Dashboard'), 10000);
  
      console.log('Login Test Passed: Successfully logged in.');
      await driver.quit();
    } catch (error) {
      console.error('Error during login test execution:', error);
    }
  };
  

// Test case 2: Invalid login (wrong credentials)
export const invalidLoginTest = async () => {
    try {
      // Get invalid login data and locators from Excel
      const { testData, locators } = await getTestData('Test_Login_Invalid_Details', 'LoginData'); // Dynamically pass the test case name
      console.log('Invalid Login Test Data:', testData);
    
      // Check if data for username or password is missing
      if (!testData.username || !testData.password) {
        throw new Error('Test data for username or password not found.'); // Explicit failure if data is missing
      }
  
      // Check if required locators are missing
      if (!locators.usernameLocator || !locators.passwordLocator || !locators.loginButtonLocator) {
        throw new Error('Locators for username, password, or login button not found.'); // Explicit failure if locators are missing
      }
    
      // Initialize the Chrome driver
      const driver = await getChromeDriver();
      
      // Navigate to the login page
      await driver.get('https://uat.rapidshyp.com/');
    
      // Find the username, password, and login button elements using locators
      let usernameField = await driver.findElement(By.css(locators.usernameLocator));
      let passwordField = await driver.findElement(By.xpath(locators.passwordLocator));
      await usernameField.sendKeys(testData.username);
      await passwordField.sendKeys(testData.password);
    
      let loginButton = await driver.findElement(By.xpath(locators.loginButtonLocator));
      await loginButton.click();
    
      // Wait for the page to load and ensure that the title is not 'Dashboard' (indicating invalid login)
      await driver.wait(async function () {
        const title = await driver.getTitle();
        return title !== 'Dashboard'; // Ensure the title is not 'Dashboard' after invalid login attempt
      }, 10000);  // Wait up to 10 seconds for the page to not have 'Dashboard' as the title
    
      console.log('Invalid login test passed. Login attempt was correctly rejected.');
      
      // Quit the driver after the test
      await driver.quit();
    } catch (error) {
      console.error('Error during invalid login test execution:', error);
      throw error; // Rethrow error to fail the test
    }
  };
  
  

// Test case 3: Empty fields (both username and password are blank)
export const emptyFieldsLoginTest = async () => {
  try {
    const {testData, locators} = await getTestData('Empty_Fields_Login','LoginData'); // Dynamically pass the test case name
    console.log('emptyFieldsLoginTest',emptyData);
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
  
    let usernameField = await driver.findElement(By.css(locators.usernameLocator));
    let passwordField = await driver.findElement(By.xpath(locators.passwordLocator));
    await usernameField.sendKeys(emptyData.username);
    await passwordField.sendKeys(emptyData.password);
  
    let loginButton = await driver.findElement(By.xpath(locators.loginButtonLocator));
    await loginButton.click();

    // Check if an error message appears about empty fields
    const errorMessage = await driver.findElement(By.xpath("//div[contains(@class, 'error-message')]"));
    await driver.wait(until.elementIsVisible(errorMessage), 5000);

    console.log('Empty Fields Login Test Passed: Error message appeared as expected.');
    await driver.quit();
  } catch (error) {
    console.error('Error during empty fields login test execution:', error);
  }
};
