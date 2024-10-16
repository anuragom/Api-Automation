import XLSX from 'xlsx';
import { readFile } from 'fs/promises'; // Assuming you're using fs/promises to read files

export const getTestData = async (testCaseName, sheetName) => {
  try {
    // Read the Excel file as a buffer
    const fileBuffer = await readFile('../Api-Automation/data/testData.xlsx');

    // Parse the Excel file buffer
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

    // Use the provided sheetName from the argument
    const sheet = workbook.Sheets[sheetName];

    // If the sheet is not found, throw an error
    if (!sheet) {
      throw new Error(`Sheet named "${sheetName}" not found in the workbook.`);
    }

    // Convert the sheet to JSON format
    const data = XLSX.utils.sheet_to_json(sheet);

    // Store test data and locators separately
    let testData = {};
    let locators = {};

    // Iterate through the rows to gather test data and locators
    data.forEach(row => {
      if (row['Test Case Name'] === testCaseName) {
        if (row['Test Key'] && row['Test Data']) {
          testData[row['Test Key']] = row['Test Data'];
        }
        if (row['Locator Key'] && row['Locator Value']) {
          locators[row['Locator Key']] = row['Locator Value'];
        }
      }
    });

    return { testData, locators }; // Return both test data and locators
  } catch (error) {
    console.error('Error reading the Excel file:', error);
    throw error; // Rethrow the error so it can be caught in the calling code
  }
};
