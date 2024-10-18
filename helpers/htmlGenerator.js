import fs from 'fs';

export const generateHtmlReport = (results, reportPath) => {
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Test Report</title>
            <style>
                table { width: 100%; border-collapse: collapse; }
                th, td { padding: 8px 12px; border: 1px solid #ddd; text-align: left; }
                th { background-color: #f2f2f2; }
                .passed { color: green; }
                .failed { color: red; }
                img { max-width: 150px; max-height: 150px; }
            </style>
        </head>
        <body>
            <h1>Test Results</h1>
            <table>
                <tr>
                    <th>Test Case File</th>
                    <th>Test Case Name</th>
                    <th>Status</th>
                    <th>Duration (ms)</th>
                    <th>Error</th>
                    <th>Screenshot</th>
                </tr>
                ${results.map(result => {
                    const {
                        file = 'N/A',
                        testName = 'N/A',
                        status = 'Unknown',
                        duration = '-',
                        error = 'None',
                        screenshot = ''
                    } = result;

                    const screenshotHtml = screenshot
                        ? `<a href="${screenshot}" download="${testName}-screenshot.png"><img src="${screenshot}" alt="Screenshot" /></a>`
                        : 'No Screenshot';

                    return `
                        <tr>
                            <td>${file}</td>
                            <td>${testName}</td>
                            <td class="${status.toLowerCase()}">${status}</td>
                            <td>${duration}</td>
                            <td>${error}</td>
                            <td>${screenshotHtml}</td>
                        </tr>
                    `;
                }).join('')}
            </table>
        </body>
        </html>
    `;

    try {
        fs.writeFileSync(reportPath, htmlContent);
        console.log(`HTML report generated: ${reportPath}`);
    } catch (error) {
        console.error(`Failed to generate HTML report: ${error.message}`);
    }
};
