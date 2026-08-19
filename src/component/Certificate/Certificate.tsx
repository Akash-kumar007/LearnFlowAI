import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useRole } from '../../context/Rolecontext/Rolecontext';
import html2pdf from 'html2pdf.js';
import './Certificate.css';

export const Certificate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, courses } = useRole();

  // Context se courses find karein
  const course = courses.find((c) => c.id === id);

  // Dynamic user name
  const studentName = user?.name || "Student";
  const completionDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const handleDownloadPDF = () => {
    const element = document.getElementById('certificate-card-to-download');
    if (!element) return;

    const options = {
      margin: 10,
      filename: `${course?.title || 'Course'}-Certificate.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };

    html2pdf().from(element).set(options).save();
  };

  if (!course) {
    return (
      <div className="certificate-page-container">
        <h2>Course not found or not completed yet!</h2>
        <Link to="/dashboard">Go to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="certificate-page-container">
      <div className="certificate-actions no-print">
        <Link to={`/dashboard`} className="btn-back">
          ← Back to Dashboard
        </Link>
        <button onClick={handleDownloadPDF} className="btn-download">
          Download PDF 📥
        </button>
      </div>

      <div id="certificate-card-to-download" className="certificate-card">
        <div className="cert-border-pattern">
          <div className="cert-content">
            <div className="cert-header-badge">🏆 OFFICIAL CERTIFICATE OF COMPLETION</div>
            <p className="cert-subtext">This is proudly presented to</p>
            
            <h1 className="cert-student-name">{studentName}</h1>
            
            <p className="cert-description">
              for successfully completing the comprehensive curriculum and mastering all practical modules for the course
            </p>
            
            <h2 className="cert-course-title">{course.title}</h2>
            
            <div className="cert-footer">
              <div className="cert-signature">
                <div className="signature-line"></div>
                <p>{course.instructorName || "Platform Instructor"}</p>
              </div>
              <div className="cert-date-box">
                <p className="date-value">{completionDate}</p>
                <p>Date of Issuance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};