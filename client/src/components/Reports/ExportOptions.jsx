import React, { useState } from 'react';

function ExportOptions({ onGenerateReport, onExport }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [exportFormat, setExportFormat] = useState('json');

  const handleGenerate = () => {
    onGenerateReport(startDate ? new Date(startDate) : null, endDate ? new Date(endDate) : null);
  };

  const handleExport = () => {
    onExport(exportFormat);
  };

  return (
    <div className="export-options">
      <h3>Report Options</h3>
      <div className="report-controls-top"> {/* Moved this container inside ExportOptions */} 
        <div className="date-range">
          <label>Start Date:</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div className="date-range">
          <label>End Date:</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <button onClick={handleGenerate} className="button primary">Generate Report</button>
      </div>

      <div className="export-format">
        <label>Export Format:</label>
        <div className="export-fornat-inputs"> {/* Moved this container inside ExportOptions */} 
          <select value={exportFormat} onChange={(e) => setExportFormat(e.target.value)}>
            <option value="json">JSON</option>
            <option value="html">HTML</option>
            <option value="pdf">PDF</option>
          </select>
          <button onClick={handleExport} className="button secondary">Export</button>
        </div>
      </div>
    </div>
  );
}

export default ExportOptions;