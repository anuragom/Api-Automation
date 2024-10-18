import fs from 'fs';

export const runTestWrapper = async (testFunction, testName, loginResult) => {
    try {
        console.log(`Running test: ${testName}`);
        await testFunction(loginResult); // Pass loginResult to the test function
        return { testName, status: 'Passed', error: null, screenshot: null };
    } catch (error) {
        const screenshotPath = `./screenshots/${testName}-${Date.now()}.png`;
        const screenshotData = await loginResult.driver.takeScreenshot(); // Capture screenshot from the correct driver instance
        fs.writeFileSync(screenshotPath, screenshotData, 'base64');

        return { 
            testName, 
            status: 'Failed', 
            error: error.message, 
            screenshot: screenshotPath 
        };
    }
};
