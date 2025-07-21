
export interface ApiSettings {
  provider: 'gemini' | 'openrouter';
  apiKey: string;
  openRouterModel?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QnaItem {
  context: string;
  question: string;
  answer: string;
}

export interface TheorySection {
  heading: string;
  content: string;
  code?: string;
}

export interface Topic {
  id: string;
  title: string;
  keywords: string[];
  theory: TheorySection[];
  qna: QnaItem[];
  quiz: QuizQuestion[];
}
