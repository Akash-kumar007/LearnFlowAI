import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Groq from 'groq-sdk';
import { mockCourses } from '../../Mock/Mock';
import './AIChat.css';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

// Groq Client Setup
const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY || "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",
  dangerouslyAllowBrowser: true, // Browser me run karne ke liye required hai
});

export const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: 'Hello! I am your AI Learning Assistant. Ask me anything about your current course or lessons!',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const pathParts = location.pathname.split('/');
  const courseId = pathParts[1] === 'course' ? pathParts[2] : null;
  const currentCourse = mockCourses.find((c) => c.id === courseId);

  const getSystemInstruction = () => {
    if (!currentCourse) {
      return 'You are an intelligent LMS Learning Assistant. Answer questions about general web development, coding, and course recommendations in a helpful tone.';
    }

    return `You are an AI Tutor specifically assisting with the course titled "${currentCourse.title}".
Course Description: ${currentCourse.description}

Guidelines:
1. Provide accurate, clear, and easy-to-understand answers related to this course.
2. If appropriate, write code examples with short explanations.
3. Keep your tone encouraging and academic.
4. Reply in the same language as the user's question (e.g., Hinglish, English, or Hindi).`;
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    
    setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      // Groq API Call
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: getSystemInstruction(),
          },
          {
            role: 'user',
            content: userMessage,
          },
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
      });

      const aiReply =
        chatCompletion.choices[0]?.message?.content ||
        "Sorry, I couldn't generate a response. Please try again.";

      setMessages((prev) => [...prev, { sender: 'ai', text: aiReply }]);
    } catch (error) {
      console.error('Groq API Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: '⚠️ Unable to connect to Groq AI. Please check your API key.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-chat-container">
      <div className="ai-chat-header">
        <h3>🤖 AI Study Assistant</h3>
        {currentCourse && (
          <span className="context-badge">Context: {currentCourse.title}</span>
        )}
      </div>

      <div className="ai-messages-box">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-bubble ${msg.sender}`}>
            <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
          </div>
        ))}
        {loading && (
          <div className="chat-bubble ai loading">AI is thinking... 🧠</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="ai-input-form">
        <input
          type="text"
          placeholder={
            currentCourse
              ? `Ask AI about ${currentCourse.title}...`
              : 'Ask AI anything...'
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
};