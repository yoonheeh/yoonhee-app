import { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import Message from './Message';
import { ChatService } from '../services/ChatService';
import { v4 as uuidv4 } from 'uuid';

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  sessionId?: string;
}

export default function ChatInterface({ sessionId: propSessionId }: { sessionId?: string }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Hello! I am your assistant. How can I help you today?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>(propSessionId || uuidv4());
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Focus input when loading state changes to false
  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [isLoading]);

  // Load messages if a session ID is provided
  useEffect(() => {
    if (propSessionId) {
      setSessionId(propSessionId);
      loadMessages(propSessionId);
    } else {
      // Create a new session
      createSession();
    }
  }, [propSessionId]);

  const loadMessages = async (sid: string) => {
    try {
      setIsLoading(true);
      const sessionMessages = await ChatService.getMessagesForSession(sid);
      
      if (sessionMessages && sessionMessages.length > 0) {
        const formattedMessages = sessionMessages.map(msg => ({
          id: msg.id,
          content: msg.content,
          isUser: msg.isUser,
          timestamp: new Date(msg.createdAt),
          sessionId: msg.sessionId
        }));
        
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createSession = async () => {
    try {
      const newSession = await ChatService.createSession('New Conversation');
      setSessionId(newSession.id);
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Store the current input value before clearing it
    const currentInput = input;
    
    // Add user message to UI immediately
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: currentInput,
      isUser: true,
      timestamp: new Date(),
      sessionId,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Save user message to backend
      await ChatService.createMessage(currentInput, sessionId, true);
      
      // Simulate assistant response
      setTimeout(async () => {
        const responseContent = `I've stored your message: "${currentInput}". You can ask me about this information later.`;
        
        // Save assistant message to backend
        await ChatService.createMessage(responseContent, sessionId, false);
        
        // Add assistant message to UI
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: responseContent,
          isUser: false,
          timestamp: new Date(),
          sessionId,
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-3xl mx-auto">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-3 text-sm max-w-[80%]">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-full border border-gray-300 dark:border-gray-600 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
            disabled={isLoading}
            autoFocus
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="rounded-full bg-blue-500 p-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
} 