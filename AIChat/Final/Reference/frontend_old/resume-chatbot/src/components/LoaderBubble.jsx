import { Loader2 } from 'lucide-react';

export default function LoaderBubble({ stageText = "Analyzing..." }) {
    return (
        <div className="flex justify-start">
            <div className="bg-white border border-green-200 rounded-2xl px-4 py-3 shadow-sm flex items-center gap-2">
                {/* Changed icon color to text-green-600 */}
                <Loader2 className="w-5 h-5 text-green-600 animate-spin" />
                {/* Changed stage text color to a darker gray for visibility, if necessary */}
                <span className="text-sm text-gray-800">{stageText}</span>
            </div>
        </div>
    );
}