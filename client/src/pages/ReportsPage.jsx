import React, { useState, useRef } from 'react';
import ReportGenerator from '../services/ReportGenerator';
import ReportViewer from '../components/Reports/ReportViewer';
import ExportOptions from '../components/Reports/ExportOptions';
import { downloadJson, downloadHtml, downloadPdf } from '../utils/exportUtils';
import LoadingSpinner from '../components/UI/LoadingSpinner'; // Import LoadingSpinner

function ReportsPage() {
  const [report, setReport] = useState(null);
  const [reportHtml, setReportHtml] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const reportContentRef = useRef(null); // Ref for the content to be exported as PDF

  const handleGenerateReport = async (rawStartDate, rawEndDate) => {
    setLoading(true);
    setError(null);
    setReport(null);
    setReportHtml('');

    // Ensure startDate and endDate are always Date objects or null
    const startDate = rawStartDate ? new Date(rawStartDate) : null;
    const endDate = rawEndDate ? new Date(rawEndDate) : null;

    console.log('Generating report with Start Date:', startDate, 'End Date:', endDate);

    try {
      const generatedReport = await ReportGenerator.generateReport(startDate, endDate);
      setReport(generatedReport);
      setReportHtml(ReportGenerator.formatReportToHtml(generatedReport));
    } catch (err) {
      console.error('Error in handleGenerateReport:', err);
      setError('Failed to generate report: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    if (!report) {
      setError('No report to export. Please generate one first.');
      return;
    }

    try {
      switch (format) {
        case 'json':
          downloadJson(report, 'performance_report');
          break;
        case 'html':
          downloadHtml(reportHtml, 'performance_report');
          break;
        case 'pdf':
          if (reportContentRef.current) {
            await downloadPdf(reportContentRef.current, 'performance_report');
          } else {
            setError('Report content not found for PDF export.');
          }
          break;
        default:
          break;
      }
    } catch (err) {
      setError('Error during export: ' + (err.message || 'Unknown error'));
    }
  };

  return (
    <div className="reports-page">
      <h1>Performance Reports</h1>
      <p className="page-subtitle">Generate and view comprehensive performance and memory reports.</p>
      <ExportOptions onGenerateReport={handleGenerateReport} onExport={handleExport} />

      {loading && <LoadingSpinner />}
      {error && <p className="error-message">{error}</p>}

      <div ref={reportContentRef}> {/* This div will be used for PDF export */} 
        <ReportViewer reportHtml={reportHtml} />
      </div>
    </div>
  );
}

export default ReportsPage;