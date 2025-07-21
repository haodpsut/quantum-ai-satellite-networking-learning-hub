
import React, { useState, useContext, useCallback } from 'react';
import type { Topic, QuizQuestion } from '../types';
import { AppContext } from '../App';
import { explainWithAi } from '../services/geminiService';
import { BrainIcon, CheckIcon, XIcon, LightBulbIcon, CodeIcon, ChevronDownIcon, ChevronUpIcon } from './icons';

interface MainContentProps {
  topic: Topic;
}

const AiExplanation = ({ concept }: { concept: string }) => {
    const { apiSettings } = useContext(AppContext);
    const [explanation, setExplanation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);

    const handleExplain = useCallback(async () => {
        if (!apiSettings || !apiSettings.apiKey) {
            setError("API settings are not configured.");
            return;
        }

        // Only fetch if not already loaded
        if (!explanation) {
            setIsLoading(true);
            setError('');
            try {
                const result = await explainWithAi(apiSettings.apiKey, concept);
                setExplanation(result);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            } finally {
                setIsLoading(false);
            }
        }
        setIsExpanded(true);

    }, [apiSettings, concept, explanation]);

    if (!isExpanded) {
        return (
             <button
                onClick={handleExplain}
                className="inline-flex items-center text-xs text-accent hover:text-blue-400 transition-colors"
                disabled={isLoading}
            >
                {isLoading ? <span className="animate-spin h-3 w-3 mr-1 rounded-full border-b-2 border-accent"></span> : <BrainIcon className="h-4 w-4 mr-1" />}
                Explain with AI
            </button>
        )
    }

    return (
        <div className="mt-2 p-4 bg-primary border border-border-color rounded-lg">
            <button onClick={() => setIsExpanded(false)} className="float-right text-text-secondary hover:text-white"><XIcon/></button>
            <h4 className="font-bold text-accent flex items-center gap-2"><BrainIcon/> AI Explanation of "{concept}"</h4>
            {isLoading && <p className="text-text-secondary animate-pulse mt-2">AI is thinking...</p>}
            {error && <p className="text-red-400 mt-2">{error}</p>}
            {explanation && <p className="text-text-main mt-2 whitespace-pre-wrap font-mono text-sm">{explanation}</p>}
        </div>
    );
}


export function MainContent({ topic }: MainContentProps) {
  const [activeTab, setActiveTab] = useState('theory');
  const tabClasses = (tabName: string) =>
    `px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none ${
      activeTab === tabName
        ? 'bg-accent text-white'
        : 'text-text-secondary hover:bg-gray-700 hover:text-white'
    }`;

  return (
    <div className="bg-secondary p-6 rounded-xl border border-border-color shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4">{topic.title}</h2>
      <div className="border-b border-border-color mb-6">
        <nav className="flex space-x-2" aria-label="Tabs">
          <button onClick={() => setActiveTab('theory')} className={tabClasses('theory')}>Theory</button>
          <button onClick={() => setActiveTab('keywords')} className={tabClasses('keywords')}>Keywords</button>
          <button onClick={() => setActiveTab('qna')} className={tabClasses('qna')}>Q&A</button>
          <button onClick={() => setActiveTab('quiz')} className={tabClasses('quiz')}>Quiz</button>
        </nav>
      </div>

      <div>
        {activeTab === 'theory' && <TheoryView topic={topic} />}
        {activeTab === 'keywords' && <KeywordsView topic={topic} />}
        {activeTab === 'qna' && <QnaView topic={topic} />}
        {activeTab === 'quiz' && <QuizView topic={topic} />}
      </div>
    </div>
  );
}

const TheoryView = ({ topic }: { topic: Topic }) => (
    <div className="space-y-6">
        {topic.theory.map((section, index) => (
            <div key={index} className="p-5 bg-primary border border-border-color rounded-lg">
                <h3 className="text-lg font-semibold text-accent mb-2">{section.heading}</h3>
                <p className="text-text-secondary leading-relaxed">{section.content}</p>
                {section.code && (
                    <div className="mt-4 bg-black rounded-md p-4 border border-border-color">
                        <h4 className="text-sm font-semibold text-gray-400 flex items-center gap-2 mb-2"><CodeIcon /> Pseudo-code Example</h4>
                        <pre><code className="text-sm text-cyan-300 font-mono">{section.code.trim()}</code></pre>
                    </div>
                )}
            </div>
        ))}
    </div>
);

const KeywordsView = ({ topic }: { topic: Topic }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topic.keywords.map((keyword, index) => (
            <div key={index} className="bg-primary p-4 rounded-lg border border-border-color">
                <h4 className="font-semibold text-white">{keyword}</h4>
                <div className="mt-3">
                    <AiExplanation concept={keyword} />
                </div>
            </div>
        ))}
    </div>
);

const QnaView = ({ topic }: { topic: Topic }) => (
    <div className="space-y-4">
        {topic.qna.length > 0 ? topic.qna.map((item, index) => (
            <div key={index} className="bg-primary p-4 rounded-lg border border-border-color">
                <p className="text-sm text-accent font-semibold">Context: {item.context}</p>
                <h4 className="font-bold text-white mt-1">{item.question}</h4>
                <p className="text-text-secondary mt-2">{item.answer}</p>
            </div>
        )) : <p className="text-text-secondary">No Q&A available for this topic yet.</p>}
    </div>
);

const QuizView = ({ topic }: { topic: Topic }) => {
    const [answers, setAnswers] = useState<{[key: number]: number | null}>({});
    const [showResults, setShowResults] = useState(false);

    const handleSelectOption = (questionIndex: number, optionIndex: number) => {
        if (showResults) return;
        setAnswers(prev => ({ ...prev, [questionIndex]: optionIndex }));
    };

    const handleSubmit = () => {
        setShowResults(true);
    };
    
    const handleReset = () => {
        setAnswers({});
        setShowResults(false);
    }
    
    if (topic.quiz.length === 0) {
        return <p className="text-text-secondary">No quiz available for this topic yet.</p>;
    }

    return (
        <div className="space-y-6">
            {topic.quiz.map((q, qIndex) => (
                <div key={qIndex} className="bg-primary p-5 rounded-lg border border-border-color">
                    <p className="font-semibold text-white">{qIndex + 1}. {q.question}</p>
                    <div className="mt-4 space-y-2">
                        {q.options.map((option, oIndex) => {
                            const isSelected = answers[qIndex] === oIndex;
                            const isCorrect = q.correctAnswer === oIndex;
                            let optionClass = "w-full text-left p-3 rounded-md border transition-colors duration-200 ";
                            if (showResults) {
                                if (isCorrect) {
                                    optionClass += "bg-green-800/50 border-green-500 text-white";
                                } else if (isSelected && !isCorrect) {
                                    optionClass += "bg-red-800/50 border-red-500 text-white";
                                } else {
                                     optionClass += "border-border-color hover:bg-gray-700";
                                }
                            } else {
                                optionClass += isSelected ? "bg-accent/70 border-accent text-white" : "border-border-color hover:bg-gray-700";
                            }

                            return (
                                <button key={oIndex} onClick={() => handleSelectOption(qIndex, oIndex)} className={optionClass}>
                                    <span className="flex items-center">
                                        {showResults && isCorrect && <CheckIcon className="mr-2 text-green-400"/>}
                                        {showResults && isSelected && !isCorrect && <XIcon className="mr-2 text-red-400"/>}
                                        {option}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                    {showResults && (
                        <div className="mt-4 p-3 bg-gray-900/50 border-l-4 border-accent rounded-r-lg">
                           <p className="flex items-center gap-2 font-semibold text-accent"><LightBulbIcon/> Explanation</p>
                           <p className="text-text-secondary text-sm mt-1">{q.explanation}</p>
                        </div>
                    )}
                </div>
            ))}
            <div className="flex gap-4 mt-6">
                 <button onClick={handleSubmit} disabled={showResults} className="px-6 py-2 bg-accent text-white font-bold rounded-md hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
                    Submit
                </button>
                 <button onClick={handleReset} className="px-6 py-2 bg-secondary text-text-secondary font-bold rounded-md hover:bg-gray-700 transition-colors">
                    Reset
                </button>
            </div>
        </div>
    );
};
