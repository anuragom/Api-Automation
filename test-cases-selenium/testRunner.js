import { glob } from 'glob';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname } from 'path';
import { generateHtmlReport } from '../helpers/htmlGenrerator.js';
import { runTestWrapper } from '../helpers/run_capture.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const runTests = async () => {

  const testFiles = glob.sync('test-cases-selenium/bulk_actions.js');
  console.log('Test files found:', testFiles);

  let testResults = [];

  for (const file of testFiles) {
    const fileUrl = pathToFileURL(file).href;
    try {
      const testModule = await import(fileUrl);
      console.log(testModule);

      // Iterate over all exported functions in the module

      for (const testName in testModule) {
        if (typeof testModule[testName] === 'function') {
          console.log('testName', testName);

          const startTime = Date.now();
          
          // result bana rna hai
          const result = await runTestWrapper(testModule[testName], testName, file);
          
          // Calculate the duration of the test
          const duration = Date.now() - startTime;
          
          // Push the result including duration
          testResults.push({
            testName,
            file,
            status: result.status || 'Passed',
            error: result.error || null,
            duration,
          });
        } else {
          testResults.push({
            testName,
            file,
            status: 'No valid test function found',
            error: null,
            duration: 0,
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
      });
    }
  }
  console.log('testResults', testResults);
  
  // Generate HTML report and save it to the specified path
  generateHtmlReport(testResults, `${__dirname}/test-report.html`);
};

// Run the tests
runTests();
