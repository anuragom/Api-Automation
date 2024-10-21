import fs from 'fs';

// Function to run a test with error handling, logging, and screenshots on failure
export const runTestWrapper = async (testFunction, testName, loginResult) => {
    try {
        console.log(`Running test: ${testName}`); // Log the start of the test

        // Execute the test function and capture any assertion errors
        const res = await testFunction(loginResult);

        // If there are assertion errors, format them for the report
        const formattedAssertionErrors = res.length > 0 
            ? res.map((error, index) => `Error ${index + 1}: ${error}`).join('\n') 
            : null;

        // If no assertion errors, return the result as 'Passed'
        if (res.length === 0) {
            return {
                testName,
                status: 'Passed',
                error: null, // No errors
                screenshot: null // No screenshot needed
            };
        } else {
            // If assertion errors exist, capture a screenshot
            const screenshotPath = `C:/Users/anmol.dhama/Desktop/Api-Automation/test-cases-selenium/screenshots/${testName}-${Date.now()}.png`; // Define screenshot file path
            const screenshotData = await loginResult.driver.takeScreenshot(); // Take a screenshot from the driver instance

            // Save the screenshot as a file
            fs.writeFileSync(screenshotPath, screenshotData, 'base64');

            // Return the result with errors and screenshot attached
            return {
                testName,
                status: 'Failed with assertions',
                error: formattedAssertionErrors, // Return individual assertion errors
                screenshot: screenshotPath // Provide the screenshot path for easier debugging
            };
        }

    } catch (error) {
        // Capture a screenshot in case of an unexpected failure
        const screenshotPath = `C:/Users/anmol.dhama/Desktop/Api-Automation/test-cases-selenium/screenshots/${testName}-${Date.now()}.png`;
        const screenshotData = await loginResult.driver.takeScreenshot(); // Take a screenshot from the driver instance

        // Save the screenshot as a file
        fs.writeFileSync(screenshotPath, screenshotData, 'base64');

        // Return the result object for a failed test due to an error
        return {
            testName,
            status: 'Failed',
            error: error.message, // Capture the error message
            screenshot: screenshotPath // Provide the screenshot path for easier debugging
        };
    }
};
