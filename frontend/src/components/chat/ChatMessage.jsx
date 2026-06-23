import React from 'react';

const ChatMessage = ({ message, isFirstInSequence }) => {
  const isAI = message.role === 'assistant';

  const renderFormattedText = (text) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-[var(--color-primary)]">{part.slice(2, -2)}</strong>;
      }
      return <React.Fragment key={i}>{part}</React.Fragment>;
    });
  };

  if (isAI) {
    return (
      <div className="flex items-end gap-3 max-w-[85%] lg:max-w-[75%] mb-6">
        {isFirstInSequence ? (
          <div className="w-8 h-8 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] flex-shrink-0 flex items-center justify-center">
            <span className="text-[var(--color-primary)] font-serif font-bold text-[11px]">SS</span>
          </div>
        ) : (
          <div className="w-8 flex-shrink-0"></div> // Spacer
        )}
        <div className="flex flex-col items-start min-w-0">
          <div className="bg-white border border-[var(--color-border)] rounded-[20px] rounded-bl-[4px] px-5 py-3.5 shadow-sm break-words w-full">
            <p className="text-[15px] font-sans text-[var(--color-primary)] leading-[1.7] whitespace-pre-wrap">
              {renderFormattedText(message.content)}
            </p>
          </div>
          {message.timestamp && (
            <span className="text-[11px] font-sans text-[var(--color-text-hint)] mt-1.5 ml-2">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
      </div>
    );
  }

  // User Message
  return (
    <div className="flex items-end gap-2 justify-end max-w-[85%] lg:max-w-[75%] ml-auto mb-6">
      <div className="flex flex-col items-end min-w-0">
        <div className="bg-[var(--color-primary)] rounded-[20px] rounded-br-[4px] px-5 py-3.5 shadow-sm break-words w-full">
          {message.imageUrl && (
            <img 
              src={message.imageUrl} 
              alt="Uploaded" 
              className="max-w-[200px] w-full rounded-xl border border-white/20 mb-2 cursor-pointer"
            />
          )}
          <p className="text-[15px] font-sans text-white leading-[1.7] whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
        {message.timestamp && (
          <span className="text-[11px] font-sans text-[var(--color-text-hint)] mt-1.5 mr-2 text-right">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
