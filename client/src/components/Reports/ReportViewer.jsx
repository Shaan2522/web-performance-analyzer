import React from 'react';

function ReportViewer({ reportHtml }) {
  return (
    <div className="report-viewer">
      <h3>Generated Report</h3>
      {reportHtml ? (
        <div dangerouslySetInnerHTML={{ __html: reportHtml }} />
      ) : (
        <p>No report generated yet. Please select options and click 'Generate Report'.</p>
      )}
    </div>
  );
}

export default ReportViewer;
