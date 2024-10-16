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
        </tr>
        ${results
          .map(
            (result) => `
          <tr>
            <td>${result.file}</td>
            <td>${result.testName}</td>
            <td class="${result.status.toLowerCase()}">${result.status}</td>
            <td>${result.duration || '-'}</td>
            <td>${result.error || 'None'}</td>
          </tr>
        `
          )
          .join('')}
      </table>
    </body>
    </html>
  `;

  fs.writeFileSync(reportPath, htmlContent);
  console.log(`HTML report generated: ${reportPath}`);
};
