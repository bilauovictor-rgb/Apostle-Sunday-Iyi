import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Loader2, Mic, Square } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  role: 'user' | 'model';
}

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I am the assistant for Apostle Sunday Iyi. How can I help you today?',
      role: 'model',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result: any) => result.transcript)
            .join('');
          setInput(transcript);
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
          if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            setShowPermissionPrompt(true);
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      role: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.text,
          history: messages.slice(1),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const modelMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.text,
        role: 'model',
      };

      setMessages((prev) => [...prev, modelMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I am having trouble connecting right now. Please try again later or contact the Apostle directly at https://Apostlesundayiyi.netlify.app/contact.',
        role: 'model',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleListening = async () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        // Request microphone permission explicitly to trigger browser prompt if needed
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setShowPermissionPrompt(false);
        
        if (recognitionRef.current) {
          setInput('');
          recognitionRef.current.start();
          setIsListening(true);
        } else {
          alert("Your browser doesn't support speech recognition. Please try Chrome or Safari.");
        }
      } catch (err) {
        console.error("Microphone permission denied", err);
        setShowPermissionPrompt(true);
      }
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-4 sm:right-8 w-[calc(100vw-2rem)] sm:w-96 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col border border-gray-100"
            style={{ height: '500px', maxHeight: 'calc(100vh - 120px)' }}
          >
            {/* Permission Prompt Overlay */}
            <AnimatePresence>
              {showPermissionPrompt && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                >
                  <div className="bg-white p-6 rounded-2xl shadow-xl max-w-[280px] text-center mx-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mic className="w-6 h-6 text-red-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Microphone Access Needed</h4>
                    <p className="text-sm text-gray-600 mb-6">
                      Please allow microphone access in your browser settings to use voice typing.
                    </p>
                    <button 
                      onClick={() => setShowPermissionPrompt(false)}
                      className="bg-primary text-white font-medium px-6 py-2.5 rounded-full w-full hover:bg-primary/90 transition-colors"
                    >
                      Okay, got it
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header */}
            <div className="bg-primary text-white p-4 flex justify-between items-center shrink-0">
              <div>
                <h3 className="font-semibold">Apostle Sunday Iyi</h3>
                <p className="text-xs text-primary-100 flex items-center gap-1">
                  {isListening ? (
                    <><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Listening...</>
                  ) : (
                    "Virtual Assistant"
                  )}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 p-2 rounded-full transition-colors -mr-2"
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                      msg.role === 'user'
                        ? 'bg-secondary text-primary rounded-br-none'
                        : 'bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-100'
                    }`}
                  >
                    {msg.text.split(/(https?:\/\/[^\s]+)/g).map((part, i) => 
                      part.match(/^https?:\/\//) ? (
                        <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="underline text-blue-600 hover:text-blue-800 break-all">
                          {part}
                        </a>
                      ) : (
                        <span key={i}>{part}</span>
                      )
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-100">
                    <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-white border-t border-gray-100 shrink-0">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isListening ? "Listening..." : "Type your message..."}
                  className="flex-1 min-w-0 px-4 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading}
                />
                
                <button
                  type="button"
                  onClick={toggleListening}
                  disabled={isLoading}
                  className={`flex-shrink-0 p-2.5 rounded-full transition-colors ${
                    isListening 
                      ? 'bg-red-50 text-red-600 hover:bg-red-100 animate-pulse' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  } disabled:opacity-50`}
                  aria-label={isListening ? "Stop listening" : "Start voice input"}
                >
                  {isListening ? <Square size={18} className="fill-current" /> : <Mic size={18} />}
                </button>

                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="flex-shrink-0 bg-primary text-white p-2.5 rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-4 sm:right-8 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-xl z-50 hover:bg-primary/90 transition-colors"
        aria-label="Toggle chat assistant"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>
    </>
  );
}
