import React, { useState, useCallback } from 'react';
import { Upload, FileText, X, BookOpen, GraduationCap, AlignLeft, PenTool, BarChart3 } from 'lucide-react';
import { GenerationConfig, DifficultyLevel } from '../types';

interface AssessmentFormProps {
  onGenerate: (config: GenerationConfig) => void;
  isGenerating: boolean;
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({ onGenerate, isGenerating }) => {
  const [topic, setTopic] = useState('');
  const [writingTopic, setWritingTopic] = useState('');
  const [grade, setGrade] = useState('Grade 9');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Medium');
  const [contextText, setContextText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf') {
        alert("For PDFs, please copy and paste the text content into the text area below for best results.");
        return;
      }

      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        if (typeof text === 'string') {
          setContextText((prev) => prev + "\n\n" + text);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({ topic, writingTopic, grade, difficulty, contextText });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          Configuration
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Set up the parameters for your Vietnamese Junior High School English test.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-5 overflow-y-auto pr-1">
        {/* Grade Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            Target Grade
          </label>
          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="w-full rounded-lg border-slate-300 border p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 text-slate-700 transition-all"
          >
            <option value="Grade 6">Grade 6</option>
            <option value="Grade 7">Grade 7</option>
            <option value="Grade 8">Grade 8</option>
            <option value="Grade 9">Grade 9</option>
          </select>
        </div>

        {/* Difficulty Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Difficulty Level
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['Easy', 'Medium', 'Advanced'] as DifficultyLevel[]).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setDifficulty(level)}
                className={`
                  py-2 px-3 rounded-lg text-sm font-medium border transition-all
                  ${difficulty === level 
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500' 
                    : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
                  }
                `}
              >
                {level === 'Easy' && 'Mức Dễ'}
                {level === 'Medium' && 'Trung Bình'}
                {level === 'Advanced' && 'Nâng Cao'}
              </button>
            ))}
          </div>
        </div>

        {/* Topic Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <AlignLeft className="w-4 h-4" />
            General Topic / Unit Name
          </label>
          <input
            type="text"
            required
            placeholder="e.g., Environment, Local Community"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full rounded-lg border-slate-300 border p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-slate-400"
          />
        </div>

        {/* Writing Topic Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <PenTool className="w-4 h-4" />
            Part IV: Writing Topic (Optional)
          </label>
          <input
            type="text"
            placeholder="Custom essay title (Leave blank for auto)"
            value={writingTopic}
            onChange={(e) => setWritingTopic(e.target.value)}
            className="w-full rounded-lg border-slate-300 border p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-slate-400"
          />
        </div>

        {/* Context Material */}
        <div className="flex-1 flex flex-col min-h-[150px]">
          <label className="block text-sm font-medium text-slate-700 mb-2 flex justify-between items-center">
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Curriculum Material (Context)
            </span>
            <span className="text-xs text-slate-400 font-normal">Optional</span>
          </label>
          
          <div className="relative flex-1">
            <textarea
              value={contextText}
              onChange={(e) => setContextText(e.target.value)}
              placeholder="Paste text from your PDF, textbook, or curriculum resources here..."
              className="w-full h-full min-h-[150px] rounded-lg border-slate-300 border p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-sm font-mono text-slate-600 bg-slate-50"
            />
            {fileName && (
               <div className="absolute bottom-3 right-3 bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded-md border border-indigo-100 flex items-center gap-1">
                  Loaded: {fileName}
                  <button type="button" onClick={() => { setFileName(null); setContextText(''); }} className="hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
               </div>
            )}
          </div>

          <div className="mt-2">
             <label className="cursor-pointer inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
                <Upload className="w-4 h-4" />
                <span>Upload Text File (.txt, .md)</span>
                <input 
                  type="file" 
                  accept=".txt,.md,.csv,.json" 
                  onChange={handleFileUpload}
                  className="hidden" 
                />
             </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isGenerating || !topic}
          className={`
            w-full py-3.5 px-4 rounded-lg text-white font-semibold shadow-md transition-all
            flex items-center justify-center gap-2 mt-auto
            ${isGenerating 
              ? 'bg-slate-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 hover:shadow-lg transform active:scale-[0.98]'}
          `}
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Assessment...
            </>
          ) : (
            <>
              Generate Quiz
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AssessmentForm;