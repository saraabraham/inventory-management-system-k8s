import ChatMessageBubble from './ChatMessageBubble';
import LoaderBubble from './LoaderBubble';

export default function ChatMessages({ messages, isAnalyzing, currentStage }) {
    return (
        <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto flex flex-col gap-4">
                {messages.map((msg, i) => (
                    <ChatMessageBubble key={i} msg={msg} />
                ))}

                {isAnalyzing && <LoaderBubble stageText={currentStage} />}
            </div>
        </div>
    );
}
