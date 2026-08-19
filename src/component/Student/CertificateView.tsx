import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../../context/Rolecontext/Rolecontext';
import './CertificateView.css';

export const CertificateView: React.FC = () => {
  const navigate = useNavigate();
  const { user, courses, enrolledCourses } = useRole();

  // 1. Session Check
  if (!user) {
    return (
      <div className="no-access-message">
        <h2>Please login to view your certificates.</h2>
        <button className="explore-courses-btn" onClick={() => navigate('/login')}>
          Go to Login
        </button>
      </div>
    );
  }

  // 2. Sirf wahi courses dikhao jo enrolled hain AND jinki progress EXACTLY 100% hai
  const completedCourses = courses.filter(
    (course) => enrolledCourses.includes(course.id) && (course.progress === 100 || course.isCompleted === true)
  );

  return (
    <div className="certificates-container">
      <h2 className="certificates-title">My Certificates</h2>
      <p className="certificates-subtitle">
        Certificates earned by <strong>{user.name}</strong> ({user.email})
      </p>

      {completedCourses.length === 0 ? (
        <div className="no-certificates-card">
          <h3>📜 No Completed Courses Found</h3>
          <p>
            Hi <strong>{user.name}</strong>, you haven't completed any courses yet. Complete all lessons of an enrolled course to unlock your certificate!
          </p>
          <button 
            className="explore-courses-btn"
            onClick={() => navigate('/dashboard')}
          >
            Go to Enrolled Courses
          </button>
        </div>
      ) : (
        <div className="certificates-grid">
          {completedCourses.map((course) => (
            <div key={course.id} className="certificate-card">
              <div className="cert-badge">🏆 Course Completed</div>
              <h3 className="course-card-title">{course.title}</h3>
              <p className="issued-to-text">
                Issued to: <strong>{user.name}</strong>
              </p>
              <button
                className="view-cert-btn"
                onClick={() => navigate(`/certificate/${course.id}`)}
              >
                View & Download Certificate
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};