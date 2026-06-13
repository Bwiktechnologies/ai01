import React from 'react';

const ChatMessage = ({ message, isFirstInSequence }) => {
  const isAI = message.role === 'assistant';

  const renderFormattedText = (text) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-white/90">{part.slice(2, -2)}</strong>;
      }
      return <React.Fragment key={i}>{part}</React.Fragment>;
    });
  };

  if (isAI) {
    return (
      <div className="flex items-end gap-2 max-w-[85%] lg:max-w-[75%] mb-4">
        {isFirstInSequence ? (
          <div className="w-7 h-7 rounded-full bg-[var(--color-accent)] flex-shrink-0 flex items-center justify-center">
            <span className="text-white font-poppins font-bold text-[10px]">SS</span>
          </div>
        ) : (
          <div className="w-7 flex-shrink-0"></div> // Spacer
        )}
        <div className="flex flex-col items-start min-w-0">
          <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-[18px] rounded-bl-[4px] px-4 py-3 shadow-[0px_2px_8px_rgba(0,0,0,0.05)] break-words w-full">
            <p className="text-[15px] font-inter text-[var(--color-text-primary)] leading-[1.7] whitespace-pre-wrap">
              {renderFormattedText(message.content)}
            </p>
          </div>
          {message.timestamp && (
            <span className="text-[11px] font-inter text-text-hint mt-1 ml-2">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
      </div>
    );
  }

  // User Message
  return (
    <div className="flex items-end gap-2 justify-end max-w-[85%] lg:max-w-[75%] ml-auto mb-4">
      <div className="flex flex-col items-end min-w-0">
        <div className="bg-[var(--color-accent)] rounded-[18px] rounded-br-[4px] px-4 py-3 shadow-[0px_2px_8px_rgba(255,107,53,0.20)] break-words w-full">
          {message.imageUrl && (
            <img 
              src={message.imageUrl} 
              alt="Uploaded" 
              className="max-w-[200px] w-full rounded-xl border border-black/10 mb-2 cursor-pointer"
            />
          )}
          <p className="text-[15px] font-inter text-white leading-[1.7] whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
        {message.timestamp && (
          <span className="text-[11px] font-inter text-text-hint mt-1 mr-2 text-right">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
