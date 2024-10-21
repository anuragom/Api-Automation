import { glob } from 'glob';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname } from 'path';
import { generateHtmlReport } from '../helpers/htmlGenerator.js';
import { runTestWrapper } from '../helpers/run_capture.js';
import { login } from '../test-cases-selenium/generic_functions/login.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const runTests = async () => {
    const testFiles = glob.sync('test-cases-selenium/bulk_action_test_cases/order_creation.js');
    console.log('Test files found:', testFiles);

    let testResults = [];

    const loginResult = await login(); 

    for (const file of testFiles) {
        const fileUrl = pathToFileURL(file).href;
        try {
            const testModule = await import(fileUrl);
            console.log('jdhjfhdhf',testModule);
            for (const testName in testModule) {
                if (typeof testModule[testName] === 'function') {
                    const startTime = Date.now();
                    const result = await runTestWrapper(testModule[testName], testName, loginResult);
                    const duration = Date.now() - startTime;

                    testResults.push({
                        testName,
                        file,
                        status: result.status,
                        error: result.error,
                        duration,
                        screenshot: result.screenshot
                    });
                }
            }
        } catch (err) {
            testResults.push({
                testName: 'Unknown Test',
                file,
                status: 'Failed',
                error: err.message,
                duration: 0,
                screenshot: null
            });
        }
    }

     
    generateHtmlReport(testResults, `${__dirname}/test-report.html`);
};

runTests();
