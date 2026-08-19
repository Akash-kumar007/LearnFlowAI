import React, { useState } from 'react';
import { useRole } from '../../context/Rolecontext/Rolecontext';
import './InstructorDashboard.css';

interface Lecture {
  id: string;
  title: string;
  videoUrl: string;
}

interface Module {
  id: string;
  title: string;
  lectures: Lecture[];
}

export const InstructorDashboard: React.FC = () => {
  const { courses, addCourse, deleteCourse } = useRole();

  const [step, setStep] = useState<number>(1);

  // Form State
  const [courseData, setCourseData] = useState({
    title: '',
    category: 'Development',
    description: '',
    price: '',
  });

  // Modules State
  const [modules, setModules] = useState<Module[]>([
    {
      id: 'mod_1',
      title: 'Module 1: Introduction',
      lectures: [{ id: 'lec_1', title: 'Welcome to the Course', videoUrl: '' }]
    }
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setCourseData({ ...courseData, [e.target.name]: e.target.value });
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!courseData.title.trim() || !courseData.description.trim()) {
        alert('Please enter Course Title and Description before proceeding.');
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  // Module Handlers
  const handleAddModule = () => {
    const newMod: Module = {
      id: `mod_${Date.now()}`,
      title: `Module ${modules.length + 1}: New Topic`,
      lectures: []
    };
    setModules([...modules, newMod]);
  };

  const handleModuleTitleChange = (modIndex: number, newTitle: string) => {
    const updated = [...modules];
    updated[modIndex].title = newTitle;
    setModules(updated);
  };

  const handleAddLecture = (modIndex: number) => {
    const updated = [...modules];
    updated[modIndex].lectures.push({
      id: `lec_${Date.now()}`,
      title: 'New Lecture Title',
      videoUrl: ''
    });
    setModules(updated);
  };

  const handleLectureChange = (modIndex: number, lecIndex: number, field: 'title' | 'videoUrl', value: string) => {
    const updated = [...modules];
    updated[modIndex].lectures[lecIndex][field] = value;
    setModules(updated);
  };

  const handleDeleteModule = (modIndex: number) => {
    setModules(modules.filter((_, idx) => idx !== modIndex));
  };

  const handleDeleteLecture = (modIndex: number, lecIndex: number) => {
    const updated = [...modules];
    updated[modIndex].lectures = updated[modIndex].lectures.filter((_, idx) => idx !== lecIndex);
    setModules(updated);
  };

  // Publish Handler
  const handlePublishCourse = (e: React.FormEvent) => {
    e.preventDefault();

    if (!courseData.title || !courseData.description || !courseData.price) {
      alert('Please complete all required fields.');
      return;
    }

    const newCourseObj = {
      id: `course_${Date.now()}`,
      title: courseData.title,
      category: courseData.category,
      description: courseData.description,
      price: courseData.price,
      modules: modules,
    };

    if (addCourse) {
      addCourse(newCourseObj);
    }

    alert('🎉 Course published successfully!');

    setCourseData({ title: '', category: 'Development', description: '', price: '' });
    setModules([
      {
        id: 'mod_1',
        title: 'Module 1: Introduction',
        lectures: [{ id: 'lec_1', title: 'Welcome to the Course', videoUrl: '' }]
      }
    ]);
    setStep(1);
  };

  const handleCourseDelete = (courseId: string, courseTitle: string) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${courseTitle}"?`);
    if (confirmDelete && deleteCourse) {
      deleteCourse(courseId);
    }
  };

  return (
    <div className="instructor-container">
      {/* Header */}
      <div className="instructor-header">
        <div>
          <h2>👨‍🏫 Instructor Workspace</h2>
          <p className="header-subtext">Build courses and structure your curriculum.</p>
        </div>
      </div>

      {/* Main Builder Card */}
      <div className="course-builder-card">
        {/* Step Indicator */}
        <div className="builder-steps-indicator">
          <span 
            className={`step-badge ${step === 1 ? 'active' : ''}`}
            onClick={() => setStep(1)}
          >
            1. Basic Info
          </span>
          <span 
            className={`step-badge ${step === 2 ? 'active' : ''}`}
            onClick={() => setStep(2)}
          >
            2. Curriculum & Modules
          </span>
          <span 
            className={`step-badge ${step === 3 ? 'active' : ''}`}
            onClick={() => setStep(3)}
          >
            3. Pricing & Publish
          </span>
        </div>

        <form onSubmit={handlePublishCourse} className="builder-form">
          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div className="form-step-content">
              <h3>Basic Course Information</h3>
              <div className="form-group">
                <label>Course Title *</label>
                <input 
                  type="text" 
                  name="title" 
                  placeholder="e.g., Full-Stack Web Development Bootcamp" 
                  value={courseData.title}
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select name="category" value={courseData.category} onChange={handleChange}>
                  <option value="Full Stack Development">Full Stack Development</option>
                  <option value="Frontend Development">Frontend Development</option>
                  <option value="Backend Development">Backend Development</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                </select>
              </div>

              <div className="form-group">
                <label>Course Overview / Summary *</label>
                <textarea 
                  name="description" 
                  rows={4} 
                  placeholder="Summarize what students will learn in this course..."
                  value={courseData.description}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}

          {/* STEP 2: Curriculum Builder */}
          {step === 2 && (
            <div className="form-step-content">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0 }}>Course Curriculum & Lectures</h3>
                <button type="button" onClick={handleAddModule} className="btn-secondary">
                  + Add Module
                </button>
              </div>

              {modules.map((mod, mIdx) => (
                <div key={mod.id} className="module-builder-card">
                  <div className="module-header-row">
                    <input 
                      type="text"
                      className="module-title-input"
                      value={mod.title}
                      onChange={(e) => handleModuleTitleChange(mIdx, e.target.value)}
                    />
                    <button 
                      type="button" 
                      className="btn-danger-sm"
                      onClick={() => handleDeleteModule(mIdx)}
                    >
                      Delete Module
                    </button>
                  </div>

                  <div className="lectures-container">
                    {mod.lectures.map((lec, lIdx) => (
                      <div key={lec.id} className="lecture-item-row" style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                        <input 
                          type="text"
                          placeholder="Lecture Title"
                          value={lec.title}
                          onChange={(e) => handleLectureChange(mIdx, lIdx, 'title', e.target.value)}
                        />
                        <input 
                          type="text"
                          placeholder="Video URL (YouTube/Vimeo)"
                          value={lec.videoUrl}
                          onChange={(e) => handleLectureChange(mIdx, lIdx, 'videoUrl', e.target.value)}
                        />
                        <button 
                          type="button" 
                          className="btn-danger-sm"
                          onClick={() => handleDeleteLecture(mIdx, lIdx)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button 
                      type="button" 
                      className="btn-link"
                      onClick={() => handleAddLecture(mIdx)}
                    >
                      + Add Lecture
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 3: Pricing */}
          {step === 3 && (
            <div className="form-step-content">
              <h3>Pricing & Final Review</h3>
              <div className="form-group">
                <label>Course Price ($) *</label>
                <input 
                  type="number" 
                  name="price" 
                  placeholder="49" 
                  value={courseData.price}
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className="review-summary-box">
                <h4>📋 Course Summary Before Publishing:</h4>
                <p><strong>Title:</strong> {courseData.title || 'Not provided'}</p>
                <p><strong>Category:</strong> {courseData.category}</p>
                <p><strong>Modules Count:</strong> {modules.length}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="builder-actions">
            {step > 1 && (
              <button type="button" onClick={() => setStep((prev) => prev - 1)} className="btn-secondary">
                Back
              </button>
            )}
            {step < 3 && (
              <button type="button" onClick={handleNextStep} className="btn-primary">
                Next
              </button>
            )}
            {step === 3 && (
              <button type="submit" className="btn-success">
                🚀 Publish Course
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Published Courses Section */}
      <div className="course-builder-card published-courses-card" style={{ marginTop: '24px' }}>
        <h3>📚 Published Courses ({courses?.length || 0})</h3>
        {!courses || courses.length === 0 ? (
          <p className="no-quizzes-text">No courses created yet. Fill out the form above to publish your first course!</p>
        ) : (
          <div className="published-courses-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginTop: '16px' }}>
            {courses.map((course: any) => (
              <div key={course.id} className="course-item-card" style={{ border: '1px solid #3f3f46', borderRadius: '8px', padding: '16px', backgroundColor: '#18181b' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#fff' }}>{course.title}</h4>
                  <span style={{ fontSize: '0.75rem', background: '#27272a', padding: '2px 8px', borderRadius: '4px', color: '#a1a1aa' }}>
                    {course.category}
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', color: '#a1a1aa', margin: '8px 0', minHeight: '40px' }}>
                  {course.description ? (course.description.length > 80 ? course.description.substring(0, 80) + '...' : course.description) : 'No description'}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #27272a', paddingTop: '12px', marginTop: '12px' }}>
                  <strong style={{ color: '#34d399' }}>${course.price}</strong>
                  <button 
                    type="button" 
                    className="btn-danger-sm"
                    onClick={() => handleCourseDelete(course.id, course.title)}
                  >
                    🗑️ Delete Course
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};