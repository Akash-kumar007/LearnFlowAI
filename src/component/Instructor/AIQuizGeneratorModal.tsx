// import React, { useState, useEffect } from 'react';
// import './AIQuizGeneratorModal.css';

// export interface Question {
//   id: number;
//   question: string;
//   options: string[];
//   correct: string;
// }

// interface AIQuizGeneratorModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSaveQuiz?: (questions: Question[]) => void;
//   courseTitle?: string;
//   isStudentMode?: boolean;
// }

// export const AIQuizGeneratorModal: React.FC<AIQuizGeneratorModalProps> = ({
//   isOpen,
//   onClose,
//   onSaveQuiz,
//   courseTitle = '',
//   isStudentMode = false,
// }) => {
//   const [topic, setTopic] = useState(courseTitle);
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  
//   const [userAnswers, setUserAnswers] = useState<{ [questionId: number]: string }>({});
//   const [submitted, setSubmitted] = useState(false);
//   const [score, setScore] = useState(0);

//   useEffect(() => {
//     if (courseTitle) {
//       setTopic(courseTitle);
//     }
//   }, [courseTitle, isOpen]);

//   const handleClose = () => {
//     setGeneratedQuestions([]);
//     setUserAnswers({});
//     setSubmitted(false);
//     setScore(0);
//     onClose();
//   };

//   if (!isOpen) return null;

//   const generateDynamicQuestions = (inputTopic: string): Question[] => {
//     const cleanTopic = inputTopic.trim() || 'General Knowledge';

//     return [
//       {
//         id: Date.now() + 1,
//         question: `What is the primary role of ${cleanTopic} in modern application development?`,
//         options: [
//           `Enhancing performance and state management in ${cleanTopic}`,
//           `Direct database queries execution`,
//           `Replacing front-end rendering engines`,
//           `Styling layout components dynamically`,
//         ],
//         correct: `Enhancing performance and state management in ${cleanTopic}`,
//       },
//       {
//         id: Date.now() + 2,
//         question: `Which of the following represents a best practice when working with ${cleanTopic}?`,
//         options: [
//           `Ignoring modular architecture`,
//           `Maintaining clean separation of concerns and reusability`,
//           `Hardcoding dynamic values`,
//           `Bypassing error boundaries during production`,
//         ],
//         correct: `Maintaining clean separation of concerns and reusability`,
//       },
//       {
//         id: Date.now() + 3,
//         question: `In the context of ${cleanTopic}, how should unexpected errors be handled?`,
//         options: [
//           `Suppressing logs entirely`,
//           `Using structured fallback boundaries and try-catch handling`,
//           `Restarting the client application`,
//           `Storing sensitive errors in local storage`,
//         ],
//         correct: `Using structured fallback boundaries and try-catch handling`,
//       },
//       {
//         id: Date.now() + 4,
//         question: `What is a common pitfall developers face when scaling ${cleanTopic}?`,
//         options: [
//           `Over-complicating state/data structures unnecessarily`,
//           `Writing too many reusable utility functions`,
//           `Using modern build tools`,
//           `Applying strict type checking`,
//         ],
//         correct: `Over-complicating state/data structures unnecessarily`,
//       },
//       {
//         id: Date.now() + 5,
//         question: `Which feature best characterizes key optimization in ${cleanTopic}?`,
//         options: [
//           `Efficient memory utilization and lazy loading`,
//           `Increasing payload size per request`,
//           `Disabling caching mechanisms`,
//           `Synchronous network blocking`,
//         ],
//         correct: `Efficient memory utilization and lazy loading`,
//       },
//     ];
//   };

//   const handleGenerate = () => {
//     if (!topic.trim()) return;
//     setIsGenerating(true);
//     setSubmitted(false);
//     setUserAnswers({});

//     setTimeout(() => {
//       const q = generateDynamicQuestions(topic);
//       setGeneratedQuestions(q);
//       setIsGenerating(false);
//     }, 1200);
//   };

//   const handleSelectOption = (qId: number, option: string) => {
//     if (submitted) return;
//     setUserAnswers((prev) => ({ ...prev, [qId]: option }));
//   };

//   const handleSubmitQuiz = () => {
//     let currentScore = 0;
//     generatedQuestions.forEach((q) => {
//       if (userAnswers[q.id] === q.correct) {
//         currentScore += 1;
//       }
//     });
//     setScore(currentScore);
//     setSubmitted(true);
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <div className="modal-header">
//           <h3>✨ AI Real-Time Quiz Generator</h3>
//           <button className="close-btn" onClick={handleClose}>
//             &times;
//           </button>
//         </div>

//         {generatedQuestions.length === 0 ? (
//           <div className="modal-body">
//             <p>Enter any course topic or concept to generate a real-time practice quiz:</p>
//             <input
//               type="text"
//               placeholder="e.g., React Context API, Node.js Streams, Python OOP..."
//               value={topic}
//               onChange={(e) => setTopic(e.target.value)}
//             />
//             <button
//               className="btn-primary generate-action-btn"
//               onClick={handleGenerate}
//               disabled={isGenerating || !topic.trim()}
//             >
//               {isGenerating ? 'Generating Dynamic Quiz...' : '⚡ Generate Real-time Quiz'}
//             </button>
//           </div>
//         ) : (
//           <div className="modal-body">
//             <div className="quiz-status-bar">
//               <h4>Topic: <span>{topic}</span></h4>
//               {submitted && (
//                 <div className="score-badge">
//                   Score: {score} / {generatedQuestions.length}
//                 </div>
//               )}
//             </div>

//             <div className="questions-preview-list">
//               {generatedQuestions.map((q, idx) => {
//                 const selectedOpt = userAnswers[q.id];
//                 return (
//                   <div key={q.id} className="preview-question-card">
//                     <p>
//                       <strong>Q{idx + 1}:</strong> {q.question}
//                     </p>
//                     <ul className="options-list">
//                       {q.options.map((opt, i) => {
//                         let className = 'option-item';

//                         if (isStudentMode || submitted) {
//                           if (selectedOpt === opt) className += ' selected';
//                           if (submitted) {
//                             if (opt === q.correct) className += ' correct-option';
//                             else if (selectedOpt === opt && opt !== q.correct) className += ' wrong-option';
//                           }
//                         } else {
//                           if (opt === q.correct) className += ' correct-option';
//                         }

//                         return (
//                           <li
//                             key={i}
//                             className={className}
//                             onClick={() => handleSelectOption(q.id, opt)}
//                           >
//                             {opt}
//                           </li>
//                         );
//                       })}
//                     </ul>
//                   </div>
//                 );
//               })}
//             </div>

//             <div className="modal-actions">
//               <button
//                 className="btn-secondary"
//                 onClick={() => setGeneratedQuestions([])}
//               >
//                 Change Topic
//               </button>

//               <button className="btn-secondary" onClick={handleGenerate}>
//                 🔄 Regenerate
//               </button>

//               {isStudentMode ? (
//                 !submitted ? (
//                   <button
//                     className="btn-primary"
//                     onClick={handleSubmitQuiz}
//                     disabled={Object.keys(userAnswers).length < generatedQuestions.length}
//                   >
//                     Submit Practice Test
//                   </button>
//                 ) : (
//                   <button className="btn-success" onClick={handleClose}>
//                     Done
//                   </button>
//                 )
//               ) : (
//                 onSaveQuiz && (
//                   <button
//                     className="btn-success"
//                     onClick={() => {
//                       onSaveQuiz(generatedQuestions);
//                       handleClose();
//                     }}
//                   >
//                     Save Quiz to Course
//                   </button>
//                 )
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };