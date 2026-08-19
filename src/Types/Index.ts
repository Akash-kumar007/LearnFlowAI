// 1. Role Type (Jo humne pehle bhi use kiya tha)
export type Role = 'student' | 'instructor' | 'admin';

// 2. Lecture Type (Har course ke andar ke lessons)
export interface Lecture {
  id: string;
  title: string;
  videoUrl: string;
  transcript: string;
  duration: string; // e.g., "10:15"
}

// 3. Module Type (Course ke chapters ya sections)
export interface CourseModule {
  id: string;
  title: string;
  lectures: Lecture[];
}

// 4. Course Type (Poori course details)
export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  instructorName: string;
  thumbnail: string;
  modules: CourseModule[];
}

// 5. Quiz Type (Multiple-choice questions)
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of options array (0, 1, 2, etc.)
  explanation: string;
}

// 6. User Type (Logged-in user details)
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  enrolledCourseIds: string[]; // List of course IDs student has enrolled in
}

// 7. AIChatMessage Type (AI Chatbot ke messages aur citations)
export interface AIChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  citation?: {
    courseTitle: string;
    lectureTitle: string;
    timestampLink?: string;
  };
}


