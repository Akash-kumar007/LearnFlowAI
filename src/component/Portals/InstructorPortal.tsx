import React, { useState } from 'react';
import { mockCourses } from '../../Mock/Mock';
// import { AIQuizGeneratorModal } from '../Instructor/AIQuizGeneratorModal';
import './Portal.css';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: string;
}

export const InstructorPortal: React.FC = () => {
  const [courses, setCourses] = useState(mockCourses);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  
  // AI Quiz Generator States
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [savedQuizzes, setSavedQuizzes] = useState<Question[][]>([]);

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newCourseObj = {
      id: 'course-' + (courses.length + 1),
      title: newTitle,
      description: newDesc,
      category: 'Development',
      difficulty: 'Beginner' as const,
      instructorName: 'Current Instructor',
      thumbnail: '',
      modules: [],
      transcripts: []
    };

    setCourses([newCourseObj, ...courses]);
    setNewTitle('');
    setNewDesc('');
    alert('Course Published Successfully!');
  };

  const handleSaveQuiz = (questions: Question[]) => {
    setSavedQuizzes((prev) => [...prev, questions]);
    alert('AI Quiz successfully attached to your teaching materials!');
  };

  return (
    <div className="portal-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <div>
          <h2>👨‍🏫 Instructor Dashboard</h2>
          <p className="portal-subtitle" style={{ margin: 0 }}>Manage your courses and generate AI quizzes instantly.</p>
        </div>
        <button 
          className="portal-btn" 
          onClick={() => setIsQuizModalOpen(true)}
          style={{ background: '#0284c7', whiteSpace: 'nowrap' }}
        >
          ✨ Generate AI Quiz
        </button>
      </div>

      {/* Add Course Form */}
      <div className="portal-card">
        <h3>Create New Course</h3>
        <form onSubmit={handleAddCourse} className="portal-form">
          <input
            type="text"
            placeholder="Course Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Course Description"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            required
          />
          <button type="submit" className="portal-btn">Publish Course</button>
        </form>
      </div>

      {/* Attached AI Quizzes Section */}
      {savedQuizzes.length > 0 && (
        <div className="portal-card" style={{ marginTop: '20px' }}>
          <h3 style={{ color: '#38bdf8' }}>📌 Attached AI Quizzes ({savedQuizzes.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
            {savedQuizzes.map((quizSet, index) => (
              <div key={index} style={{ background: '#18181b', padding: '10px', borderRadius: '6px', border: '1px solid #27272a' }}>
                <p style={{ margin: '0 0 4px 0', fontWeight: '600', color: '#fff' }}>Quiz Set #{index + 1} ({quizSet.length} MCQs)</p>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#a1a1aa' }}>Sample: {quizSet[0]?.question}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Courses List */}
      <h3 className="section-title">Your Published Courses</h3>
      <div className="portal-list">
        {courses.map((course) => (
          <div key={course.id} className="portal-item">
            <div>
              <h4>{course.title}</h4>
              <p>{course.description}</p>
            </div>
            <span className="badge-tag">{course.difficulty}</span>
          </div>
        ))}
      </div>

      {/* AI Quiz Generator Modal Integration */}
      {/* <AIQuizGeneratorModal 
        isOpen={isQuizModalOpen} 
        onClose={() => setIsQuizModalOpen(false)} 
        onSaveQuiz={handleSaveQuiz} 
      /> */}
    </div>
  );
};