export default function ChatMessageBubble({ msg }) {
    const isUser = msg.type === 'user';
    const isError = msg.isError;

    // Determine background and text classes
    const bgClasses = isUser
        ? 'bg-green-500 text-white'
        : isError
            ? 'bg-red-100 text-red-800 border border-red-300'
            : 'bg-white text-gray-800 border border-green-200 shadow-sm hover:shadow-md transition';

    // Timestamp formatting
    const timestamp = msg.timestamp
        ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '';

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} my-2`}>
            <div
                className={`max-w-2xl rounded-2xl px-4 py-3 ${bgClasses}`}
                aria-live={isUser ? 'off' : 'polite'}
            >
                {/* Changed <p> to <div> to allow nested elements */}
                <div className="text-sm whitespace-pre-wrap break-words">
                    {msg.content}
                </div>

                {timestamp && (
                    <p className={`text-xs mt-2 ${isUser ? 'text-green-200' : 'text-gray-400'} text-right`}>
                        {timestamp}
                    </p>
                )}
            </div>
        </div>
    );
}
