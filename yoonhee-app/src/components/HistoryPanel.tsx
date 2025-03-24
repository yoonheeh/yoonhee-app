import { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { ChatService } from '../services/ChatService';

interface ChatSession {
  id: string;
  title: string;
  date: Date;
}

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSession: (sessionId: string) => void;
}

export default function HistoryPanel({ isOpen, onClose, onSelectSession }: HistoryPanelProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadSessions();
    }
  }, [isOpen]);

  const loadSessions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const sessionData = await ChatService.listSessions();
      
      const formattedSessions = sessionData.map(session => ({
        id: session.id,
        title: session.title,
        date: new Date(session.createdAt)
      }));
      
      // Sort by date, newest first
      formattedSessions.sort((a, b) => b.date.getTime() - a.date.getTime());
      
      setSessions(formattedSessions);
    } catch (error) {
      console.error('Error loading sessions:', error);
      setError('Failed to load chat history. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="w-80 bg-white dark:bg-gray-800 h-full shadow-lg p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Chat History</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center text-red-500 dark:text-red-400 text-center px-4">
            {error}
          </div>
        ) : sessions.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
            No chat history yet
          </div>
        ) : (
          <ul className="flex-1 overflow-y-auto space-y-2">
            {sessions.map((session) => (
              <li key={session.id}>
                <button
                  onClick={() => onSelectSession(session.id)}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <div className="font-medium truncate">{session.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {session.date.toLocaleDateString()} {session.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 