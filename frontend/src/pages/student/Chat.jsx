import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, SendHorizontal, Info, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import ChatMessage from '../../components/chat/ChatMessage';
import TypingIndicator from '../../components/chat/TypingIndicator';
import QuickChips from '../../components/chat/QuickChips';
import { auth } from '../../firebase';

const Chat = () => {
  const { userProfile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Track if we've processed the initial message to prevent double-sends
  const processedInitialMsg = useRef(false);

  // Initialize with empty state message if no messages exist
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome-1',
          role: 'assistant',
          content: `Arre yaar! Bohot khushi hui ki tum aa gaye! 🔥\n\nMain hoon Sajan Shah — aaj se main tumhara 24/7 personal mentor hoon.\n\nPehle ek kaam karo — teen cheezein batao mujhe:\n1️⃣ Tumhara naam kya hai?\n2️⃣ Life mein abhi sabse badi takleef kya chal rahi hai?\n3️⃣ Agle 90 din mein kya achieve karna chahte ho?\n\nSeedha batao yaar — judgment free zone hai yahan.`,
          timestamp: new Date().toISOString()
        }
      ]);
    }
  }, [messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    // Auto-grow textarea
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Extract core send logic to reuse
  const sendMessageToApi = async (messageText, options = {}) => {
    if (!messageText.trim() && !selectedImage) return;

    const newUserMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText.trim(),
      imageUrl: selectedImage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setSelectedImage(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    
    setIsTyping(true);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      const token = await user.getIdToken();

      const apiMessages = [...messages, newUserMessage].map(m => {
        if (m.role === 'user' && m.imageUrl) {
          return {
            role: m.role,
            content: [
              { type: 'text', text: m.content || "Here is an image." },
              { type: 'image_url', image_url: { url: m.imageUrl } }
            ]
          };
        }
        return {
          role: m.role,
          content: m.content
        };
      });

      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          messages: apiMessages,
          userProfile,
          isGoalCheckin: options.isGoalCheckin
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to get response');
      }

      // Add a placeholder message for the assistant
      const assistantMessageId = Date.now().toString();
      setMessages(prev => [...prev, {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString()
      }]);
      setIsTyping(false); // Turn off the spinner since we are streaming now

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunkString = decoder.decode(value, { stream: true });
          const lines = chunkString.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
              try {
                const data = JSON.parse(line.replace('data: ', ''));
                if (data.content) {
                  setMessages(prev => prev.map(msg => 
                    msg.id === assistantMessageId 
                      ? { ...msg, content: msg.content + data.content }
                      : msg
                  ));
                }
              } catch (e) {
                console.error("Error parsing stream chunk", e, line);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Oops! Sajan's AI is taking a quick break. Please try again in a moment.",
        timestamp: new Date().toISOString()
      }]);
    }
  };

  const handleSend = () => {
    sendMessageToApi(inputValue);
  };

  // Check for auto-triggered message from navigation state
  useEffect(() => {
    if (location.state?.initialMessage && !processedInitialMsg.current && messages.length > 0) {
      processedInitialMsg.current = true;
      const initialMsg = location.state.initialMessage;
      const isGoalCheckin = location.state.isGoalCheckin;
      
      // Clear the state so it doesn't re-trigger on refresh
      navigate(location.pathname, { replace: true, state: {} });
      
      // Send the message
      sendMessageToApi(initialMsg, { isGoalCheckin });
    }
  }, [location.state, location.pathname, navigate, messages.length]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-56px-64px)] lg:h-[calc(100vh-64px)] bg-[var(--color-bg)] overflow-hidden">
      
      {/* Chat Header */}
      <div className="h-[68px] bg-[var(--color-card)] border-b border-[var(--color-border)] px-5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-[42px] h-[42px] rounded-full bg-gradient-to-br from-[#FF6B35] to-[#E55A28] flex items-center justify-center">
              <span className="text-white font-poppins font-bold text-[16px]">SS</span>
            </div>
            <div className="absolute bottom-0 right-0 w-[10px] h-[10px] rounded-full bg-[#10B981] border-2 border-white">
              <div className="absolute inset-0 rounded-full bg-[#10B981] animate-ping opacity-75"></div>
            </div>
          </div>
          <div>
            <h2 className="text-[16px] font-poppins font-bold text-[var(--color-text-primary)]">
              AI Sajan Shah
            </h2>
            <div className="text-[12px] font-inter text-[#10B981] flex items-center gap-1 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></div>
              Online • Your personal mentor
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Language / Info buttons */}
          <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-500 transition-colors">
            <Info className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-5 pb-2">
        <div className="text-center mb-6 mt-2">
          <span className="text-[12px] font-inter text-text-hint bg-[var(--color-border)]/50 px-3 py-1 rounded-full">
            Today
          </span>
        </div>
        
        {messages.map((msg, idx) => {
          const isFirstInSequence = idx === 0 || messages[idx - 1].role !== msg.role;
          return (
            <ChatMessage 
              key={msg.id} 
              message={msg} 
              isFirstInSequence={isFirstInSequence} 
            />
          );
        })}
        
        {isTyping && <TypingIndicator />}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-[var(--color-card)] border-t border-[var(--color-border)] z-30 shrink-0">
        <QuickChips onChipClick={(chip) => setInputValue(chip)} />
        
        <div className="p-3 lg:p-4 pb-[max(12px,env(safe-area-inset-bottom))] flex flex-col gap-2">
          {selectedImage && (
            <div className="relative self-start ml-[46px]">
              <img src={selectedImage} alt="Preview" className="h-24 rounded-xl border border-[var(--color-border)] object-cover shadow-sm" />
              <button 
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-[var(--color-card)] text-red-500 rounded-full p-1 shadow-md border border-[var(--color-border)] hover:bg-red-500/10 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          
          <div className="flex items-end gap-2 w-full">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleImageSelect} 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-[#9CA3AF] hover:bg-gray-100 hover:text-[var(--color-accent)] transition-colors mb-1"
            >
              <Paperclip className="w-[18px] h-[18px]" />
            </button>
            
            <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Message Sajan Shah..."
            className="flex-1 min-h-[44px] max-h-[120px] bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[20px] px-4 py-2.5 text-[15px] font-inter outline-none focus:bg-[var(--color-card)] focus:border-[var(--color-accent)] resize-none overflow-y-auto transition-colors scrollbar-hide"
            rows="1"
          />
          
          <button 
            onClick={handleSend}
            disabled={(!inputValue.trim() && !selectedImage) || isTyping}
            className={`w-[42px] h-[42px] rounded-full flex items-center justify-center shrink-0 transition-all mb-[1px]
              ${(inputValue.trim() || selectedImage) && !isTyping 
                ? 'bg-[var(--color-accent)] shadow-orange text-white hover:scale-105 hover:bg-[#E55A28]' 
                : 'bg-[var(--color-border)] text-[#9CA3AF]'
              }`}
          >
            {isTyping ? (
               <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              <SendHorizontal className="w-[18px] h-[18px]" />
            )}
          </button>
        </div>
        </div>
        
        <div className="text-center pb-2">
          <span className="text-[10px] text-text-hint">Powered by Sajan Shah's real teachings</span>
        </div>
      </div>
    </div>
  );
};

export default Chat;
