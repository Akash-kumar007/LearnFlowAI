import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useRole } from '../../context/Rolecontext/Rolecontext'; // Adjust path if needed
import { AIChat } from '../AIChat/AIChat';
// import { CourseTools } from '../CourseTools/CourseTools';
import './CourseDetails.css'; 

export const CourseDetail: React.FC = () => {
  // Helper: YouTube Video ID Extract Karne ke liye
  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const { id } = useParams<{ id: string }>();
  const { courses, user } = useRole();

  // Active User & User Specific Identifier
  const userId = user?.id || 'guest';

  // Find course dynamically from Context instead of static Mock
  const course = courses.find((c) => c.id === id) || courses[0];
  
  // State for active module and active lecture
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeLectureIndex, setActiveLectureIndex] = useState(0);

  // Completed modules/lectures tracking tied to SPECIFIC USER ID
  const [completedLectures, setCompletedLectures] = useState<string[]>(() => {
    if (!course) return [];
    const saved = localStorage.getItem(`progress_${userId}_${course.id}`);
    return saved ? JSON.parse(saved) : [];
  });

  // Re-sync completed lectures if User or Course changes
  useEffect(() => {
    if (course) {
      const saved = localStorage.getItem(`progress_${userId}_${course.id}`);
      setCompletedLectures(saved ? JSON.parse(saved) : []);
    }
  }, [userId, course?.id]);

  if (!course) {
    return <div className="course-detail-layout">Course not found!</div>;
  }

  const activeModule = course.modules?.[activeModuleIndex];
  const activeLecture = activeModule?.lectures?.[activeLectureIndex] || activeModule?.lectures?.[0];

  // Video ID check
  const videoUrl = activeLecture?.videoUrl || '';
  const youtubeId = getYouTubeId(videoUrl);

  // Check if all lectures in the course are completed
  const totalLecturesCount = course.modules?.reduce((acc, m) => acc + (m.lectures?.length || 0), 0) || 0;
  const isCourseFinished = totalLecturesCount > 0 && completedLectures.length === totalLecturesCount;

  const toggleLectureComplete = (lectureId: string) => {
    setCompletedLectures((prev) => {
      const updated = prev.includes(lectureId) 
        ? prev.filter((item) => item !== lectureId) 
        : [...prev, lectureId];
      
      // Save to localStorage with User Specific Key
      localStorage.setItem(`progress_${userId}_${course.id}`, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="course-detail-layout">
      
      {/* Left Section: Course Content, Video Player & Tools */}
      <div className="course-content-area">
        
        {/* Back Navigation */}
        <div className="back-nav">
          <Link to="/dashboard">← Back to Dashboard</Link>
        </div>

        <h2>{course.title}</h2>
        
        {/* Video Player Box */}
        <div className="video-player-container">
          <div className="video-mock-screen">
            {videoUrl ? (
              youtubeId ? (
                /* 1. YouTube Link hai toh iframe chalega */
                <iframe
                  width="100%"
                  height="380px"
                  src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
                  title={activeLecture?.title || "Course Video"}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                /* 2. Standard MP4 Video Tag */
                <video 
                  controls 
                  width="100%" 
                  height="380px" 
                  src={videoUrl} 
                  key={videoUrl}
                >
                  Your browser does not support the video tag.
                </video>
              )
            ) : (
              <div className="video-placeholder">
                <span className="play-icon-large">▶</span>
                <p>Playing: {activeLecture?.title || 'No Video Selected'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Lecture Transcript & Details */}
        <div className="module-details">
          <h3>{activeLecture?.title}</h3>
          <p className="transcript-text">{activeLecture?.transcript || "No transcript available for this lecture."}</p>
          
          {activeLecture && (
            <button 
              onClick={() => toggleLectureComplete(activeLecture.id)}
              className={`complete-btn ${completedLectures.includes(activeLecture.id) ? 'completed' : ''}`}
            >
              {completedLectures.includes(activeLecture.id) ? '✓ Completed' : 'Mark as Done'}
            </button>
          )}
        </div>

        {/* Notes & Quiz Interactive Tools */}
        {/* <CourseTools /> */}

        {/* Modules & Lectures Navigation List */}
        <div className="modules-list-box">
          <h4>Course Curriculum</h4>
          {course.modules?.map((mod, mIndex) => (
            <div key={mod.id || mIndex} className="module-group">
              <h5 className="module-group-title">{mod.title}</h5>
              {mod.lectures?.map((lec, lIndex) => {
                const isSelected = mIndex === activeModuleIndex && lIndex === activeLectureIndex;
                const isDone = completedLectures.includes(lec.id);
                return (
                  <div 
                    key={lec.id || lIndex} 
                    className={`module-item ${isSelected ? 'active' : ''}`}
                    onClick={() => {
                      setActiveModuleIndex(mIndex);
                      setActiveLectureIndex(lIndex);
                    }}
                  >
                    <span className="lecture-title">
                      {isDone ? '✓ ' : '▶ '} {lec.title}
                    </span>
                    <span className="mod-duration">{lec.duration}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Certificate Unlock Box */}
        {isCourseFinished && (
          <div className="certificate-unlock-box">
            <p className="certificate-text">🎉 All lectures completed!</p>
            <Link to={`/certificate/${course.id}`} className="btn-certificate">
              Download Certificate 🏆
            </Link>
          </div>
        )}
      </div>

      {/* Right Section: Built-in AI Learning Assistant Sidebar */}
      <div className="course-ai-sidebar">
        <AIChat />
      </div>
    </div>
  );
};