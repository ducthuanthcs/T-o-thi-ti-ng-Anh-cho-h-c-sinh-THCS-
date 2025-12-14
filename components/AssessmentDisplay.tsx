import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Printer, Copy, Check, Download, AlertCircle } from 'lucide-react';

interface AssessmentDisplayProps {
  content: string;
}

const AssessmentDisplay: React.FC<AssessmentDisplayProps> = ({ content }) => {
  const [copied, setCopied] = React.useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/markdown'});
    element.href = URL.createObjectURL(file);
    element.download = "english_assessment.md";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!content) {
    return (
      <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl h-full flex flex-col items-center justify-center text-slate-400 p-12 text-center">
        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
          <AlertCircle className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-lg font-medium text-slate-500 mb-2">No Assessment Generated Yet</h3>
        <p className="max-w-xs mx-auto">
          Enter a topic and optional context material on the left to generate a curriculum-compliant test.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Toolbar */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex justify-between items-center no-print">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-700 bg-green-100 text-green-700 px-2 py-0.5 rounded-md border border-green-200">
            Success
          </span>
          <span className="text-xs text-slate-500">
            {content.length} characters
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200"
            title="Copy to Clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={handleDownload}
            className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200"
            title="Download Markdown"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4" />
            Print / Save PDF
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-y-auto p-8 lg:p-12 bg-white">
        <div className="print-content max-w-4xl mx-auto prose prose-slate prose-headings:text-slate-800 prose-p:text-slate-700 prose-strong:text-slate-900 prose-li:text-slate-700">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default AssessmentDisplay;
