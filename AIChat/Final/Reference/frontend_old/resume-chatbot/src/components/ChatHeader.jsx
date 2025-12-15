
export default function ChatHeader() {
    return (
        <div className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-4xl mx-auto p-4 flex items-center gap-3">
                <img src="./sjlogo.png" className="w-8 h-8 text-indigo-600" />
                <div>
                    <h1 className="text-xl font-bold text-gray-800">AI Powered Career Assistant</h1>
                    <p className="text-sm text-gray-500">Powered by SwipeJobb</p>
                </div>
            </div>
        </div>
    );
}
