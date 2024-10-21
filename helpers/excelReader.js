import XLSX from 'xlsx';
import { readFile } from 'fs/promises'; // Assuming you're using fs/promises to read files
import fs from 'fs';
import path from 'path';

export const getTestData = async (testCaseName,excelName, sheetName) => {
  try {
    // Read the Excel file as a buffer
    const fileBuffer = await readFile(`../Api-Automation/data/${excelName}`);

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
    console.log('data',data);
    // Store test data and locators separately
    let testData = {};
    // let locators = {};

    // Iterate through the rows to gather test data and locators
    data.forEach(row => {
      if (row['Test Case Name'] === testCaseName) {
        if (row['Test Key'] && row['Test Data']) {
          testData[row['Test Key']] = row['Test Data'];
        }
      }
    });

    return { testData }; // Return both test data and locators
  } catch (error) {
    console.error('Error reading the Excel file:', error);
    throw error; // Rethrow the error so it can be caught in the calling code
  }
};

export const getLocators = async (excelName) => {
  try {
    // Read the Excel file as a buffer
    const fileBuffer = await readFile(`../Api-Automation/data/${excelName}`);

    // Parse the Excel file buffer
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

    // Access the sheet named "Locators"
    const sheet = workbook.Sheets["Locators"];

    // If the sheet is not found, throw an error
    if (!sheet) {
      throw new Error(`Sheet named "Locators" not found in the workbook.`);
    }

    // Convert the sheet to JSON format
    const data = XLSX.utils.sheet_to_json(sheet);

    // Store locators
    let locators = {};

    // Iterate through the rows to gather locators
    data.forEach(row => {
      if (row['Locator_Field'] && row['Locator_Value']) {
        locators[row['Locator_Field']] = row['Locator_Value'];
      }
    });
    console.log(locators);
    return locators; // Return locators
  } catch (error) {
    console.error('Error reading the Excel file:', error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};

export const FetchExcelData = async (filePath) => {
  // Read the Excel file
  const workbook = XLSX.readFile(filePath);
  
  // Extract the first sheet (assuming the data is on the first sheet)
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Convert the sheet to JSON format (header and data)
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // header: 1 reads the first row as headers
  
  if (!data.length) {
    return { error: 'The sheet has no data' };
  }

  const headers = data[0]; // The first row contains the headers
  const rows = data.slice(1); // The rest are data rows

  // Convert the rows into an array of objects where the header keys map to the values in each row
  const validData = rows.map(row => {
    const rowObject = {};
    row.forEach((cell, index) => {
      rowObject[headers[index]] = cell;
    });
    return rowObject;
  });

  return { validHeaders: headers, validData };
}

export const getMostRecentFile = async(dirPath) => {
  const files = fs.readdirSync(dirPath);
  let recentFile = null;

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const fileStats = fs.statSync(filePath);

    if (!fileStats.isDirectory()) {
      if (!recentFile || fileStats.mtime > fs.statSync(recentFile).mtime) {
        recentFile = filePath;
      }
    }
  });

  return recentFile;
}

// export const validateExcelData = async () =>{

      

// }