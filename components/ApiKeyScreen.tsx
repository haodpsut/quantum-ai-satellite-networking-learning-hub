
import React, { useState, useContext } from 'react';
import type { ApiSettings } from '../types';
import { AppContext } from '../App';
import { BrainIcon } from './icons';

const OPEN_ROUTER_FREE_MODELS = [
    "mistralai/mistral-7b-instruct:free",
    "google/gemma-7b-it:free",
    "openchat/openchat-7b:free",
    "nousresearch/nous-hermes-2-mixtral-8x7b-dpo:free",
];

export function ApiKeyScreen() {
    const { setApiSettings } = useContext(AppContext);
    const [activeTab, setActiveTab] = useState<'gemini' | 'openrouter'>('gemini');
    const [geminiKey, setGeminiKey] = useState('');
    const [openRouterKey, setOpenRouterKey] = useState('');
    const [openRouterModel, setOpenRouterModel] = useState(OPEN_ROUTER_FREE_MODELS[0]);

    const handleSave = () => {
        if (activeTab === 'gemini' && geminiKey) {
            setApiSettings({ provider: 'gemini', apiKey: geminiKey });
        } else if (activeTab === 'openrouter' && openRouterKey) {
            setApiSettings({ provider: 'openrouter', apiKey: openRouterKey, openRouterModel });
        } else {
            alert('Please enter an API key.');
        }
    };

    const tabClasses = (tabName: 'gemini' | 'openrouter') => 
        `px-4 py-2 font-semibold rounded-t-lg transition-colors duration-200 focus:outline-none ${
            activeTab === tabName 
            ? 'bg-secondary border-b-2 border-accent text-white' 
            : 'text-text-secondary hover:bg-gray-700'
        }`;

    return (
        <div className="flex items-center justify-center min-h-screen bg-primary p-4">
            <div className="w-full max-w-lg bg-secondary border border-border-color rounded-xl shadow-2xl p-8">
                <div className="text-center mb-8">
                    <div className="inline-block p-3 bg-gray-800 rounded-full mb-4 border border-border-color">
                        <BrainIcon className="w-8 h-8 text-accent" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Welcome to the Learning Hub</h1>
                    <p className="text-text-secondary mt-2">Please provide an API key to enable AI features.</p>
                </div>

                <div className="border-b border-border-color mb-6">
                    <nav className="-mb-px flex space-x-2" aria-label="Tabs">
                        <button className={tabClasses('gemini')} onClick={() => setActiveTab('gemini')}>
                            Google Gemini
                        </button>
                        <button className={tabClasses('openrouter')} onClick={() => setActiveTab('openrouter')}>
                            OpenRouter
                        </button>
                    </nav>
                </div>
                
                {activeTab === 'gemini' && (
                    <div className="space-y-4">
                        <label htmlFor="gemini-key" className="block text-sm font-medium text-text-secondary">
                            Gemini API Key
                        </label>
                        <input
                            type="password"
                            id="gemini-key"
                            value={geminiKey}
                            onChange={(e) => setGeminiKey(e.target.value)}
                            className="w-full px-3 py-2 bg-primary border border-border-color rounded-md focus:ring-accent focus:border-accent text-white"
                            placeholder="Enter your Google AI Studio API Key"
                        />
                    </div>
                )}

                {activeTab === 'openrouter' && (
                     <div className="space-y-4">
                        <div>
                            <label htmlFor="openrouter-key" className="block text-sm font-medium text-text-secondary">
                                OpenRouter API Key
                            </label>
                            <input
                                type="password"
                                id="openrouter-key"
                                value={openRouterKey}
                                onChange={(e) => setOpenRouterKey(e.target.value)}
                                className="w-full px-3 py-2 bg-primary border border-border-color rounded-md focus:ring-accent focus:border-accent text-white"
                                placeholder="Enter your OpenRouter API Key"
                            />
                        </div>
                        <div>
                             <label htmlFor="openrouter-model" className="block text-sm font-medium text-text-secondary">
                                Select a Free Model
                            </label>
                            <select 
                                id="openrouter-model"
                                value={openRouterModel}
                                onChange={e => setOpenRouterModel(e.target.value)}
                                className="w-full px-3 py-2 bg-primary border border-border-color rounded-md focus:ring-accent focus:border-accent text-white"
                            >
                                {OPEN_ROUTER_FREE_MODELS.map(model => (
                                    <option key={model} value={model}>{model}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
                
                <div className="mt-8">
                    <button
                        onClick={handleSave}
                        className="w-full bg-accent hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary focus:ring-accent"
                    >
                        Save and Continue
                    </button>
                </div>
            </div>
        </div>
    );
}
