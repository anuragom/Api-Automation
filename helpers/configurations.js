import { Builder } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import path from 'path';

export const getChromeDriver = async () => {
  // Set Chrome options
  let options = new chrome.Options();

  // Set user preferences to configure download behavior
  options.setUserPreferences({
    'download.default_directory': path.resolve("C:/Users/anmol.dhama/Desktop/Api-Automation/data/downloads"), // Specify custom download directory
    'download.prompt_for_download': false, // No download prompt
    'download.directory_upgrade': true,    // Automatically upgrade directory
    'safebrowsing.enabled': false,         // Disable safe browsing to avoid blocking
    'profile.default_content_settings.popups': 0, // Disable popups
    'profile.default_content_settings.automatic_downloads': 1, // Allow automatic downloads
    'profile.content_settings.exceptions.automatic_downloads.*.setting': 1, // Allow all automatic downloads
    'profile.content_settings.pattern_pairs.*.multiple-automatic-downloads': 1, // Allow multiple automatic downloads
    'profile.download.manager.showWhenStarting': false, // Disable showing the "Save As" dialog
    'profile.download.manager.showNever': true, // Never show download manager
    'download.behavior': 'allow' // Explicitly set behavior to 'allow'
  });

  // Add Chrome-specific arguments to further restrict new windows
  options.addArguments('start-maximized'); // Maximize browser window
  // options.addArguments('--disable-popup-blocking'); // Block popup windows
  options.addArguments('--disable-infobars'); // Disable automation banners
  // options.addArguments('--incognito'); // Run browser in incognito mode
  options.addArguments('--disable-extensions'); // Disable Chrome extensions that might open new windows
  // options.addArguments('--disable-notifications'); // Disable browser notifications
  options.addArguments('--disable-background-timer-throttling'); // Disable background tasks that may cause windows to open
  options.addArguments('--disable-backgrounding-occluded-windows'); // Prevent background windows from opening
  options.addArguments('--no-sandbox'); // Disable the sandbox (for certain environments)
  
  // Create and return a new WebDriver instance for Chrome
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  return driver;
};
