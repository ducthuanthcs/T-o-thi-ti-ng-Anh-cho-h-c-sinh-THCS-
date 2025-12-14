import React, { useState } from 'react';
import { Settings, ExternalLink } from 'lucide-react';
import AssessmentForm from './components/AssessmentForm';
import AssessmentDisplay from './components/AssessmentDisplay';
import { generateAssessment } from './services/geminiService';
import { AppStatus, GenerationConfig } from './types';

function App() {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [assessmentContent, setAssessmentContent] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGenerate = async (config: GenerationConfig) => {
    setStatus(AppStatus.GENERATING);
    setErrorMsg(null);
    try {
      const apiKey = process.env.API_KEY || '';
      
      if (!apiKey) {
        throw new Error("API Key is missing. Please ensure the app is running in an environment with the API_KEY set.");
      }

      // Pass the writingTopic and difficulty from config to the service
      const result = await generateAssessment(
        apiKey, 
        config.grade, 
        config.topic, 
        config.contextText,
        config.writingTopic,
        config.difficulty
      );
      setAssessmentContent(result);
      setStatus(AppStatus.SUCCESS);
    } catch (error: any) {
      console.error(error);
      setStatus(AppStatus.ERROR);
      setErrorMsg(error.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white p-1.5 rounded-lg">
              <Settings className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
              VietEnglish Examiner
            </h1>
          </div>
          <div className="flex items-center gap-4 text-sm">
             <a href="https://drive.google.com" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors">
               <span className="hidden sm:inline">My Resources</span>
               <ExternalLink className="w-3 h-3" />
             </a>
             <div className="h-4 w-px bg-slate-200"></div>
             <div className="text-xs font-mono text-slate-400">
                v1.1.0
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-8rem)] min-h-[600px]">
          
          {/* Left Panel: Controls */}
          <div className="lg:col-span-4 h-full overflow-hidden no-print">
            <AssessmentForm 
              onGenerate={handleGenerate} 
              isGenerating={status === AppStatus.GENERATING}
            />
            {status === AppStatus.ERROR && (
              <div className="mt-4 bg-red-50 text-red-700 px-4 py-3 rounded-lg border border-red-200 text-sm">
                <strong>Error:</strong> {errorMsg}
              </div>
            )}
          </div>

          {/* Right Panel: Display */}
          <div className="lg:col-span-8 h-full overflow-hidden">
            <AssessmentDisplay content={assessmentContent} />
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;