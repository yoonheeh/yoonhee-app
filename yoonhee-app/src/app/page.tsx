'use client';

import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ChatInterface from '../components/ChatInterface';
import HistoryPanel from '../components/HistoryPanel';
import { isAuthenticated } from './amplify-client';

export default function Home() {
  const [chatKey, setChatKey] = useState(1);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated();
      setIsLoggedIn(authenticated);
    };
    
    checkAuth();
  }, []);

  const handleNewChat = async () => {
    // Reset the chat by incrementing the key
    setChatKey(prevKey => prevKey + 1);
    setCurrentSessionId(null);
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
  };

  return (
    <>
      <Layout onNewChat={handleNewChat} onHistory={handleHistory}>
        <ChatInterface 
          key={chatKey} 
          sessionId={currentSessionId || undefined} 
        />
      </Layout>
      <HistoryPanel 
        isOpen={isHistoryOpen}
        onClose={handleCloseHistory}
        onSelectSession={handleSelectSession}
      />
    </>
  );
}
