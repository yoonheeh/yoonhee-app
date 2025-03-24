'use client';

import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ChatInterface from '../components/ChatInterface';
import HistoryPanel from '../components/HistoryPanel';

// In a real app, these would come from a database or local storage
interface ChatSession {
  id: string;
  title: string;
  date: Date;
}

export default function Home() {
  const [chatKey, setChatKey] = useState(1);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Simulate loading sessions from storage on initial load
  useEffect(() => {
    // In a real app, this would fetch from a database or localStorage
    const mockSessions: ChatSession[] = [
      {
        id: '1',
        title: 'Question about React hooks',
        date: new Date(Date.now() - 86400000), // yesterday
      },
      {
        id: '2',
        title: 'Information about TypeScript',
        date: new Date(Date.now() - 172800000), // 2 days ago
      },
    ];
    
    setSessions(mockSessions);
  }, []);

  const handleNewChat = () => {
    // Increment the key to reset the ChatInterface component
    setChatKey(prevKey => prevKey + 1);
    setCurrentSessionId(null);
    
    // In a real app, we would create a new session in the database
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Conversation',
      date: new Date(),
    };
    
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
  };

  const handleHistory = () => {
    setIsHistoryOpen(true);
  };

  const handleCloseHistory = () => {
    setIsHistoryOpen(false);
  };

  const handleSelectSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setChatKey(prevKey => prevKey + 1); // Reset the chat interface
    setIsHistoryOpen(false);
    
    // In a real app, we would load the selected session data
  };

  return (
    <>
      <Layout onNewChat={handleNewChat} onHistory={handleHistory}>
        <ChatInterface key={chatKey} />
      </Layout>
      <HistoryPanel 
        isOpen={isHistoryOpen}
        onClose={handleCloseHistory}
        sessions={sessions}
        onSelectSession={handleSelectSession}
      />
    </>
  );
}
