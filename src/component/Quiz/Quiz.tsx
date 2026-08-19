import React, { useState } from 'react';
import { mockQuizzes } from '../../Mock/Mock';
import './Quiz.css';

export const Quiz: React.FC = () => {
  const quizzes = Array.isArray(mockQuizzes) ? mockQuizzes : [];
  const quiz = quizzes[0];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Safe fallback agar quiz data na mile
  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="quiz-container">
        <div className="quiz-card" style={{ textAlign: 'center' }}>
          <h2>No Quiz Available</h2>
          <p style={{ color: '#a1a1aa' }}>Please add quiz questions to the mock data.</p>
        </div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestionIndex];

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const handleNext = () => {
    if (selectedOption === currentQ.correctOption) {
      setScore(score + 1);
    }

    setSelectedOption(null);

    if (currentQuestionIndex + 1 < quiz.questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsCompleted(true);
    }
  };

  return (
    <div className="quiz-container">
      <div className="quiz-card">
        <h2>{quiz.title}</h2>

        {isCompleted ? (
          <div className="quiz-result">
            <h3>Quiz Completed! 🎉</h3>
            <p>Your Score: <strong>{score} / {quiz.questions.length}</strong></p>
            <button className="btn-restart" onClick={() => {
              setCurrentQuestionIndex(0);
              setScore(0);
              setIsCompleted(false);
            }}>Try Again</button>
          </div>
        ) : (
          <div className="quiz-question-box">
            <div className="quiz-progress">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </div>
            <h4 className="question-text">{currentQ.questionText}</h4>

            <div className="options-list">
              {currentQ.options.map((option, index) => (
                <div 
                  key={index} 
                  className={`option-item ${selectedOption === index ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect(index)}
                >
                  <span>{option}</span>
                </div>
              ))}
            </div>

            <button 
              className="btn-next" 
              disabled={selectedOption === null}
              onClick={handleNext}
            >
              {currentQuestionIndex + 1 === quiz.questions.length ? 'Finish Quiz' : 'Next Question'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};