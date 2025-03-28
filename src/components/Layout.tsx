import React from 'react';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  onNewChat: () => void;
  onHistory: () => void;
}

export default function Layout({ children, onNewChat, onHistory }: LayoutProps) {
  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <Header onNewChat={onNewChat} onHistory={onHistory} />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
} 