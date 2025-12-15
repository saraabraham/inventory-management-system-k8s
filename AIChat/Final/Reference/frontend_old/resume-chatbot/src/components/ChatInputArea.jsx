import { Upload, Send, Loader2 } from 'lucide-react';

export default function ChatInputArea({
    file,
    fileInputRef,
    handleFileSelect,
    analyzeResume,
    isAnalyzing
}) {
    // Determine the style for the primary action button
    const buttonStyle = !file || isAnalyzing
        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
        : 'bg-green-500 hover:bg-green-600';

    return (
        <div className="bg-white border-t border-gray-200 shadow-sm p-4">
            <div className="max-w-4xl mx-auto flex items-center gap-3">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                />
                <label
                    htmlFor="file-upload"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md cursor-pointer border border-gray-300 hover:bg-gray-200"
                >
                    <Upload className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-700">{file ? file.name : 'Choose PDF'}</span>
                </label>

                <button
                    onClick={analyzeResume}
                    disabled={!file || isAnalyzing}
                    // Apply the new green-themed style
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium text-white ${buttonStyle}`}
                >
                    {isAnalyzing ? (
                        <>
                            {/* Loader icon color is typically inherited as text-white from the button class */}
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <Send className="w-5 h-5" />
                            Analyze Resume
                        </>
                    )}
                </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
                Upload a PDF resume to get AI-powered analysis, job matching, and recommendations.
            </p>
        </div>
    );
}