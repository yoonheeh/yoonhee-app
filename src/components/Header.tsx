import React from 'react';

interface HeaderProps {
  onNewChat: () => void;
  onHistory: () => void;
}

export default function Header({ onNewChat, onHistory }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-900 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Yoonhee Assistant
          </h1>
          <div className="flex space-x-4">
            <button 
              onClick={onHistory}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
            >
              History
            </button>
            <button 
              onClick={onNewChat}
              className="px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              New Chat
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 