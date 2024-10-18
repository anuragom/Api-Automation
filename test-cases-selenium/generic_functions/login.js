import { getChromeDriver } from '../../helpers/configurations.js';
import { getTestData, getLocators } from '../../helpers/excelReader.js';
import { By, until } from 'selenium-webdriver';


let locators = await getLocators('testData.xlsx');
console.log('locators',locators);

export const login = async () => {
  try {
    const { testData } = await getTestData('Test_Login_Valid_Details', 'testData.xlsx', 'LoginData');
    
    if (!testData.Username_IN || !testData.Password_IN) {
      console.log('Test data for username or password not found.');
      return;
    }

    if (!locators.LoginPage_Username_IN  || !locators.LoginPage_Password_IN  || !locators.LoginPage_Signin_BT) {
      console.log('Locators for username, password, or login button not found.');
      return;
    }

    const driver = await getChromeDriver(); // Initialize driver once
    await driver.get('https://uat.rapidshyp.com/');

    // Locate and interact with login fields
    let usernameField = await driver.findElement(By.css(locators.LoginPage_Username_IN));
    let passwordField = await driver.findElement(By.xpath(locators.LoginPage_Password_IN));
    await usernameField.sendKeys(testData.Username_IN);
    await passwordField.sendKeys(testData.Password_IN);

    let loginButton = await driver.findElement(By.xpath(locators.LoginPage_Signin_BT));
    await loginButton.click();

    console.log('Login Test Passed: Successfully logged in.');
    
    return {driver, locators}; // Return the driver instance
  } catch (error) {
    console.error('Error during login test execution:', error);
  }
};
