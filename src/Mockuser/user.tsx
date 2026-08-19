export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  avatar?: string;
}

export const MOCK_USERS: UserProfile[] = [
  {
    id: 'std-1',
    name: 'Anmol',
    email: 'anmol@gmail.com',
    role: 'student',
  },
  {
    id: 'inst-1',
    name: 'Rohit Sharma (Instructor)',
    email: 'rohit@lms.com',
    role: 'instructor',
  },
  {
    id: 'admin-1',
    name: 'System Admin',
    email: 'admin@lms.com',
    role: 'admin',
  },
];