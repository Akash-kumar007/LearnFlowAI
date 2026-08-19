import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRole } from '../../context/Rolecontext/Rolecontext';
import './Dashboard.css';

interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const Dashboard: React.FC = () => {
  const { user, courses, enrolledCourses } = useRole();

  // Dynamic Student Info
  const studentName = user?.name || "Student";
  const userId = user?.id || "guest";

  // Real-time Dynamic States
  const [activeStreak, setActiveStreak] = useState<number>(1);
  const [earnedBadges, setEarnedBadges] = useState<Badge[]>([]);

  // 1. Real-time Dynamic Streak Logic
  useEffect(() => {
    if (!userId) return;

    const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const lastLoginDate = localStorage.getItem(`last_login_${userId}`);
    const savedStreak = localStorage.getItem(`streak_${userId}`);

    let currentStreak = savedStreak ? parseInt(savedStreak, 10) : 0;

    if (!lastLoginDate) {
      // First-time Login -> Streak Starts at 1 Day
      currentStreak = 1;
      localStorage.setItem(`last_login_${userId}`, todayStr);
      localStorage.setItem(`streak_${userId}`, '1');
    } else if (lastLoginDate !== todayStr) {
      const lastDate = new Date(lastLoginDate);
      const today = new Date(todayStr);
      
      const diffTime = Math.abs(today.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak += 1; // Consecutive day login
      } else if (diffDays > 1) {
        currentStreak = 1; // Gap missed -> reset to 1
      }

      localStorage.setItem(`last_login_${userId}`, todayStr);
      localStorage.setItem(`streak_${userId}`, currentStreak.toString());
    }

    setActiveStreak(currentStreak);
  }, [userId]);

  // 2. Course Progress Calculator
  const getCourseProgress = (courseId: string, totalModules: { lectures: any[] }[]) => {
    const totalLecturesCount = totalModules ? totalModules.reduce((acc, m) => acc + m.lectures.length, 0) : 0;
    
    const saved = localStorage.getItem(`progress_${userId}_${courseId}`);
    const completedLectures: string[] = saved ? JSON.parse(saved) : [];
    
    if (totalLecturesCount === 0) return 0;
    return Math.round((completedLectures.length / totalLecturesCount) * 100);
  };

  // Enrolled Courses List
  const userCourses = courses.filter((course) => 
    enrolledCourses.length > 0 ? enrolledCourses.includes(course.id) : true
  );

  // 3. Dynamic Badges Logic (Starts from ZERO Badges)
  useEffect(() => {
    const badges: Badge[] = [];

    // Badge 1: Action Taker (Unlock only if user has enrolled in at least 1 course)
    if (enrolledCourses.length > 0) {
      badges.push({
        id: 'enrolled',
        name: 'Action Taker',
        icon: '📚',
        description: 'Enrolled in your first course',
      });
    }

    // Badge 2: Streak Master (Unlock only if continuous login streak reaches 3+ days)
    if (activeStreak >= 3) {
      badges.push({
        id: 'streak_master',
        name: 'Streak Master',
        icon: '⚡',
        description: 'Maintained a 3+ day learning streak',
      });
    }

    // Badge 3: Course Champion (Unlock only when at least 1 course is 100% finished)
    const hasCompletedCourse = userCourses.some(
      (c) => getCourseProgress(c.id, c.modules || []) === 100
    );

    if (hasCompletedCourse) {
      badges.push({
        id: 'champion',
        name: 'Course Champion',
        icon: '🎓',
        description: 'Completed 100% of a course',
      });
    }

    setEarnedBadges(badges);
  }, [enrolledCourses, activeStreak, userCourses]);

  return (
    <div className="dashboard-container">
      {/* Header & Main Stats Row */}
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {studentName}! 👋</h1>
          <p>Here is an overview of your active learning journey.</p>
        </div>
        <div className="stats-cards-wrapper">
          <div className="stat-card">
            <span className="stat-icon">🔥</span>
            <div>
              <h3>{activeStreak} {activeStreak === 1 ? 'Day' : 'Days'}</h3>
              <p>Active Streak</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">🏆</span>
            <div>
              <h3>{earnedBadges.length} Badges</h3>
              <p>Unlocked so far</p>
            </div>
          </div>
        </div>
      </div>

   
      

      {/* Continue Learning Section */}
      <div className="dashboard-section">
        <h2>Continue Learning</h2>
        <div className="enrolled-grid">
          {userCourses.map((course) => {
            const progressPercentage = getCourseProgress(course.id, course.modules || []);
            return (
              <div key={course.id} className="enrolled-course-card">
                <div className="course-card-info">
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar-fill" 
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{progressPercentage}% Completed</span>
                </div>
                <Link to={`/course/${course.id}`} className="btn-resume">
                  {progressPercentage === 100 ? 'Review Course →' : 'Resume Course →'}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};