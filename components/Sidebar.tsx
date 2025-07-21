
import React, { useContext } from 'react';
import { learningTopics } from '../data/content';
import type { Topic } from '../types';
import { AppContext } from '../App';
import { BookIcon, SettingsIcon, DashboardIcon } from './icons';

interface SidebarProps {
  selectedTopic: Topic;
  setSelectedTopic: (topic: Topic) => void;
}

export function Sidebar({ selectedTopic, setSelectedTopic }: SidebarProps) {
  const { setApiSettings } = useContext(AppContext);

  const handleReset = () => {
    if(window.confirm('Are you sure you want to clear your API key and return to the setup screen?')) {
        setApiSettings(null);
    }
  }

  return (
    <aside className="w-64 fixed top-0 left-0 h-full bg-secondary border-r border-border-color flex flex-col">
      <div className="p-4 border-b border-border-color">
        <h2 className="text-xl font-bold text-white">Learning Topics</h2>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {learningTopics.map((topic) => (
          <a
            key={topic.id}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setSelectedTopic(topic);
            }}
            className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              selectedTopic.id === topic.id
                ? 'bg-accent text-white'
                : 'text-text-secondary hover:bg-gray-700 hover:text-white'
            }`}
          >
            <BookIcon />
            <span>{topic.title}</span>
          </a>
        ))}
        <div className="pt-4 border-t border-border-color">
             <a
                href="#"
                onClick={(e) => { e.preventDefault(); alert('Dashboard coming soon!'); }}
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-text-secondary hover:bg-gray-700 hover:text-white transition-colors duration-200"
            >
                <DashboardIcon />
                <span>Dashboard</span>
            </a>
        </div>
      </nav>
      <div className="p-4 border-t border-border-color">
        <button 
            onClick={handleReset}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-text-secondary hover:bg-gray-700 hover:text-white transition-colors duration-200"
        >
            <SettingsIcon />
            <span>Change API Key</span>
        </button>
      </div>
    </aside>
  );
}
