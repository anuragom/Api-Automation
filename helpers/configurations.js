// config.js
import { Builder } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

export const getChromeDriver = async () => {
  // Set Chrome options (optional)
  let options = new chrome.Options();
  options.addArguments('start-maximized'); // Start browser maximized
//   options.addArguments('headless'); // To run tests without opening the browser window (optional)

  // Create a new WebDriver instance for Chrome
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
  
  return driver;
};
