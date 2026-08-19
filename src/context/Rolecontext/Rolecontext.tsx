import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { mockCourses } from '../../Mock/Mock';
import { Role, User, Course } from '../../Types/Index';

export type AppUser = User & { password?: string };

interface RoleContextType {
  user: User | null;
  role: Role | null;
  setRole: (role: Role) => void;
  login: (email: string, password?: string) => { success: boolean; message?: string };
  register: (name: string, email: string, password?: string, role?: Role) => { success: boolean; message?: string };
  logout: () => void;
  enrolledCourses: string[];
  enrollCourse: (courseId: string) => void;
  courses: Course[];
  addCourse: (course: Course) => void;
  deleteCourse: (courseId: string) => void;
  markCourseCompleted: (courseId: string) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [registeredUsers, setRegisteredUsers] = useState<AppUser[]>(() => {
    const saved = localStorage.getItem('lms_registered_users_v4');
    return saved ? JSON.parse(saved) : [];
  });

  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('lms_user_v4');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [enrolledCourses, setEnrolledCourses] = useState<string[]>(() => {
    const savedCourses = localStorage.getItem('lms_enrolled_v4');
    return savedCourses ? JSON.parse(savedCourses) : [];
  });

  // 1. Custom added courses
  const [customCourses, setCustomCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('lms_custom_courses');
    return saved ? JSON.parse(saved) : [];
  });

  // 🚀 2. FIX: Deleted Course IDs to filter out mock & custom courses permanently
  const [deletedCourseIds, setDeletedCourseIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('lms_deleted_courses');
    return saved ? JSON.parse(saved) : [];
  });

  // User Progress Map
  const [courseProgressMap, setCourseProgressMap] = useState<{ [id: string]: { progress: number; isCompleted: boolean } }>(() => {
    const saved = localStorage.getItem('lms_course_progress');
    return saved ? JSON.parse(saved) : {};
  });

  // 🚀 3. DYNAMIC MERGE & FILTER: Purify courses array from deleted items
  const courses: Course[] = [...customCourses, ...mockCourses]
    .filter((course) => !deletedCourseIds.includes(course.id)) // 👈 Removes deleted courses (both mock & custom)
    .map((course) => {
      const userProgress = courseProgressMap[course.id];
      return {
        ...course,
        progress: userProgress ? userProgress.progress : (course.progress || 0),
        isCompleted: userProgress ? userProgress.isCompleted : (course.isCompleted || false),
      };
    });

  // Syncing States to LocalStorage
  useEffect(() => {
    localStorage.setItem('lms_registered_users_v4', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('lms_user_v4', JSON.stringify(user));
    } else {
      localStorage.removeItem('lms_user_v4');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('lms_enrolled_v4', JSON.stringify(enrolledCourses));
  }, [enrolledCourses]);

  useEffect(() => {
    localStorage.setItem('lms_custom_courses', JSON.stringify(customCourses));
  }, [customCourses]);

  useEffect(() => {
    localStorage.setItem('lms_deleted_courses', JSON.stringify(deletedCourseIds));
  }, [deletedCourseIds]);

  useEffect(() => {
    localStorage.setItem('lms_course_progress', JSON.stringify(courseProgressMap));
  }, [courseProgressMap]);

  // REGISTER
  const register = (name: string, email: string, password?: string, role: Role = 'student') => {
    const trimmedEmail = email.trim().toLowerCase();
    
    if (!password || password.trim() === '') {
      return { success: false, message: 'Password required!' };
    }

    const existingUser = registeredUsers.find((u) => u.email.toLowerCase() === trimmedEmail);
    if (existingUser) {
      return { success: false, message: 'Email already exists!' };
    }

    const newUser: AppUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: trimmedEmail,
      password: password,
      role: role,
      enrolledCourseIds: [],
    };

    setRegisteredUsers((prev) => [...prev, newUser]);

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    setEnrolledCourses([]);

    return { success: true, message: 'Registration Successful!' };
  };

  // LOGIN
  const login = (email: string, password?: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const foundUser = registeredUsers.find((u) => u.email.toLowerCase() === trimmedEmail);

    if (!foundUser) {
      return { success: false, message: 'Email not found!' };
    }

    if (!password || foundUser.password !== password) {
      return { success: false, message: 'Incorrect Password!' };
    }

    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    setEnrolledCourses(foundUser.enrolledCourseIds || []);
    
    return { success: true };
  };

  // LOGOUT
  const logout = () => {
    setUser(null);
    setEnrolledCourses([]);
    sessionStorage.removeItem('admin_access'); 
    localStorage.removeItem('lms_user_v4');
    localStorage.removeItem('lms_enrolled_v4');
  };

  const setRole = (newRole: Role) => {
    if (user) {
      setUser((prev) => (prev ? { ...prev, role: newRole } : null));
    }
  };

  const enrollCourse = (courseId: string) => {
    if (!enrolledCourses.includes(courseId)) {
      setEnrolledCourses((prev) => [...prev, courseId]);
    }
  };

  const addCourse = (newCourse: Course) => {
    setCustomCourses((prev) => [newCourse, ...prev]);
  };

  // 🚀 4. RELIABLE DELETE HANDLER
  const deleteCourse = (courseId: string) => {
    // Custom courses state se remove karo
    setCustomCourses((prev) => prev.filter((course) => course.id !== courseId));

    // Deleted IDs list me add karo taaki Mock Data me se bhi render na ho
    setDeletedCourseIds((prev) => [...prev, courseId]);

    // Enrolled courses list se bhi clean kar do
    setEnrolledCourses((prev) => prev.filter((id) => id !== courseId));
  };

  const markCourseCompleted = (courseId: string) => {
    setCourseProgressMap((prev) => ({
      ...prev,
      [courseId]: { progress: 100, isCompleted: true },
    }));
  };

  return (
    <RoleContext.Provider
      value={{
        user,
        role: user ? user.role : null,
        setRole,
        login,
        register,
        logout,
        enrolledCourses,
        enrollCourse,
        courses,
        addCourse,
        deleteCourse,
        markCourseCompleted,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) throw new Error('useRole must be used within a RoleProvider');
  return context;
};