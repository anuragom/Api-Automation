export const runTestWrapper = async (testFunction, testName, file) => {
  console.log('testFunction', testFunction);
  try {
    console.log(`Running test: ${testName} from ${file}`);
    await testFunction(); // Execute the test function
    return { testName, file, status: 'Passed', error: null };
  } catch (error) {
    // Return detailed error message if the test fails
    return { testName, file, status: 'Failed', error: error.message };
  }
};
