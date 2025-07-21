
import React, { useState, useMemo } from 'react';
import { ApiKeyScreen } from './components/ApiKeyScreen';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { useLocalStorage } from './hooks/useLocalStorage';
import { learningTopics } from './data/content';
import type { ApiSettings, Topic } from './types';
import { BrainIcon } from './components/icons';

export const AppContext = React.createContext<{
  apiSettings: ApiSettings | null;
  setApiSettings: (settings: ApiSettings | null) => void;
}>({
  apiSettings: null,
  setApiSettings: () => {},
});

export default function App() {
  const [apiSettings, setApiSettings] = useLocalStorage<ApiSettings | null>('api-settings', null);
  const [selectedTopic, setSelectedTopic] = useState<Topic>(learningTopics[0]);

  const contextValue = useMemo(() => ({
    apiSettings,
    setApiSettings,
  }), [apiSettings, setApiSettings]);

  if (!apiSettings?.apiKey) {
    return (
      <AppContext.Provider value={contextValue}>
        <ApiKeyScreen />
      </AppContext.Provider>
    );
  }

  return (
    <AppContext.Provider value={contextValue}>
      <div className="flex min-h-screen font-sans bg-primary">
        <Sidebar selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} />
        <main className="flex-1 p-6 md:p-10 ml-64">
           <header className="mb-8">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <span className="p-2 bg-secondary rounded-lg border border-border-color"><BrainIcon/></span>
              Quantum AI & Satellite Networking Hub
            </h1>
            <p className="text-text-secondary mt-2">
              An advanced learning and practice application for specialized topics in Quantum-Inspired AI.
            </p>
          </header>
          <MainContent topic={selectedTopic} />
        </main>
      </div>
    </AppContext.Provider>
  );
}
