import { Course, QuizQuestion, AIChatMessage, User } from '../Types/Index';

// 1. Mock Courses Data (2 complete courses with modules and lectures)
export const mockCourses: Course[] = [
  {
    id: 'course-1',
    title: 'HTML,CSS And Javascript Complete Course ',
    description: 'HTML, CSS, and JavaScript are the three foundational technologies of the World Wide Web, working together to create structured, styled, and highly interactive websites. ',
    category: 'Frontend Development',
    difficulty: 'Intermediate',
    instructorName: 'Akash Kumar',
    thumbnail: 'https://youtu.be/nt5tXl9Vtug?list=RDyuF7Pw-_YIE',
    modules: [
      {
        id: 'mod-1',
        title: 'Module 1: Introduction Of HTML,CSS And Javascript',
        lectures: [
          {
            id: 'lec-1 ',
            title: 'HTML Tutorial For Beginners ',
            videoUrl: 'https://youtu.be/BsDoLVMnmZs?si=arp4nxzgB7QqPX0E', // Sample video
            transcript: 'In this lecture, we explore why HTML is essential for scaling React applications. We cover semantic tags, document structures, and native web primitives.',
            duration: '3:11:12 ',
          },
          {
            id: 'lec-2',
            title: 'CSS Tutorial For Beginners',
            videoUrl: 'https://youtu.be/Edsxf_NBFrw?si=ROU4hVS4nOW9a3uY', // Sample video
            transcript: 'In this lecture, we explore why CSS is essential for scaling React applications. We cover custom properties, modern layout modules, and component-level styling abstractions.',
            duration: '8:21:02',
          },
          {
            id: 'lec-3',
            title: 'Java-Script Tutorial For Beginners',
            videoUrl: 'https://youtu.be/hKB-YGF14SY?si=JAXhFGteLXVCPghz', // Sample video
            transcript: 'In this lecture, we explore why JavaScript is essential for scaling React applications. We cover dynamic state, event handling, and functional programming patterns.',
            duration: '3:44:17',
          },
        ]
        
      },
      
      
    ]
  },
  {
    id: 'course-2',
    title: 'MERN Stack Tutorial For Beginners',
    description: 'The MERN stack is a popular collection of JavaScript-based technologies—MongoDB, Express.js, React, and Node.js—used to build fast, full-stack web applications. It lets developers use just one programming language (JavaScript) for both the client-side user interface and the server-side logic.',
    category: 'Full Stack Development',
    difficulty: 'Beginner',
    instructorName: 'Akash ',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=500&auto=format&fit=crop&q=60',
    modules: [
      {
        id: 'mod-3',
        title: 'MERN Stack Complete Course',
        lectures: [
          {
            id: 'lec-4',
            title: 'MERN Stack Tutorial From Beginning To Advance',
            videoUrl: 'https://youtu.be/F9gB5b4jgOI?si=A-5Kx48Be7j9OO1r',
            transcript: 'In this lecture, we explore why the MERN stack is essential for building full-stack, end-to-end web applications. We cover NoSQL data modeling, RESTful API architecture, component-driven UI, and asynchronous server runtimes.',
            duration: '3:34:54',
          }
        ]
      }
    ]
  }
];

// 2. Mock Quiz Questions Data
export const mockQuizzes: Record<string, QuizQuestion[]> = {
  'course-1': [
    {
      id: 'q-1',
      question: 'Which keyword is used to define a shape of an object in TypeScript?',
      options: ['type', 'interface', 'struct', 'object'],
      correctAnswer: 1,
      explanation: 'Both interface and type can be used, but interface is standard for defining object shapes.'
    },
    {
      id: 'q-2',
      question: 'What is the purpose of generic types in TypeScript?',
      options: [
        'To make code slower', 
        'To write reusable code components that work with multiple types', 
        'To delete unused variables', 
        'To connect databases'
      ],
      correctAnswer: 1,
      explanation: 'Generics allow you to create components that can work over a variety of types rather than a single one.'
    }
  ]
};

// 3. Mock Logged-in User Data
export const mockUser: User = {
  id: 'user-1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'student', // Yeh role switcher ke sath change ho sakta hai
  enrolledCourseIds: ['course-1']
};

// 4. Mock AI Pre-written Responses for Chatbot
export const mockAIResponses: Record<string, string> = {
  default: "I can help you understand your course materials. Ask me anything about React, TypeScript, or AI prompts!",
  typescript: "TypeScript helps catch bugs at compile-time using static typing. In React, it's heavily used to type component props and state.",
  prompt: "An effective prompt should give a clear role, context, and expected format for the AI response."
};