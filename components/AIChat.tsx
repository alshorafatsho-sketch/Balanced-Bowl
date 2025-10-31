
import React, { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { getAIResponse } from '../services/geminiService';

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

const AIChat: React.FC<AIChatProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ id: Date.now(), text: "Hello! I'm your AI cooking assistant. How can I help you today?", sender: 'ai' }]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    const currentMessages = [...messages, userMessage];
    setInput('');
    setIsLoading(true);

    try {
      // FIX: Correctly format the history parts and pass the full history to the AI service for conversational context.
      const history = currentMessages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      const aiText = await getAIResponse(history, input);
      const aiMessage: Message = { id: Date.now() + 1, text: aiText, sender: 'ai' };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = { id: Date.now() + 1, text: "Oops, something went wrong. Please try again.", sender: 'ai' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg h-[80vh] flex flex-col transform transition-all duration-300 scale-100">
        <header className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <SparklesIcon className="h-6 w-6 text-orange-500" />
            <h2 className="text-lg font-bold text-gray-800">AI Cooking Assistant</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </header>
        
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-orange-500 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-end gap-2">
                <div className="max-w-xs md:max-w-md p-3 rounded-2xl bg-gray-100 text-gray-800 rounded-bl-none">
                  <div className="flex items-center space-x-1">
                     <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
                     <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></span>
                     <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        <footer className="p-4 border-t">
          <div className="flex items-center bg-gray-100 rounded-full">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about any recipe..."
              className="flex-1 bg-transparent px-4 py-3 text-sm text-gray-800 focus:outline-none"
              disabled={isLoading}
            />
            <button onClick={handleSend} disabled={isLoading} className="p-2 m-1 bg-orange-500 text-white rounded-full disabled:bg-gray-300">
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AIChat;
