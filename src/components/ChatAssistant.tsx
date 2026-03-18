import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Loader2, Mic, Square } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface Message {
  id: string;
  text: string;
  role: 'user' | 'model';
}

class PCMPlayer {
  context: AudioContext;
  nextTime: number;
  constructor(sampleRate: number) {
    this.context = new AudioContext({ sampleRate });
    this.nextTime = 0;
  }
  play(base64: string) {
    if (this.context.state === 'suspended') this.context.resume();
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const int16Array = new Int16Array(bytes.buffer);
    const float32Array = new Float32Array(int16Array.length);
    for (let i = 0; i < int16Array.length; i++) {
      float32Array[i] = int16Array[i] / 32768.0;
    }
    const buffer = this.context.createBuffer(1, float32Array.length, this.context.sampleRate);
    buffer.getChannelData(0).set(float32Array);
    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.connect(this.context.destination);
    const currentTime = this.context.currentTime;
    if (this.nextTime < currentTime) {
      this.nextTime = currentTime;
    }
    source.start(this.nextTime);
    this.nextTime += buffer.duration;
  }
  stop() {
    this.context.close();
  }
  clear() {
    this.context.close();
    this.context = new AudioContext({ sampleRate: 24000 });
    this.nextTime = 0;
  }
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
  const [isLive, setIsLive] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const pcmPlayerRef = useRef<PCMPlayer | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopLive();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isLive) return;

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

  const startLive = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/config');
      const { apiKey } = await res.json();
      if (!apiKey) throw new Error("API key not found");

      const ai = new GoogleGenAI({ apiKey });

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioCtx = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioCtx;

      pcmPlayerRef.current = new PCMPlayer(24000);

      const sessionPromise = ai.live.connect({
        model: "gemini-2.5-flash-native-audio-preview-09-2025",
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } }
          },
          systemInstruction: `You are the digital representative for Apostle Sunday Iyi.
If someone asks a spiritual question, check if there is a related video on his YouTube channel and provide the link.
The Rule: If you don't have a specific video link for their question, say: 'I don't have a specific video on that yet, but Apostle Sunday Iyi would love to hear from you directly. You can message him here: https://Apostlesundayiyi.netlify.app/contact'`,
        },
        callbacks: {
          onopen: () => {
            setIsLive(true);
            setIsLoading(false);
            const source = audioCtx.createMediaStreamSource(stream);
            const processor = audioCtx.createScriptProcessor(4096, 1, 1);
            source.connect(processor);
            processor.connect(audioCtx.destination);

            processor.onaudioprocess = (e) => {
              if (!sessionRef.current) return;
              const inputData = e.inputBuffer.getChannelData(0);
              const pcm16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                pcm16[i] = Math.max(-1, Math.min(1, inputData[i])) * 32767;
              }
              const bytes = new Uint8Array(pcm16.buffer);
              let binary = '';
              for (let i = 0; i < bytes.byteLength; i++) {
                binary += String.fromCharCode(bytes[i]);
              }
              const base64 = btoa(binary);
              sessionPromise.then((session) => {
                session.sendRealtimeInput([{ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } }]);
              });
            };
          },
          onmessage: async (message: any) => {
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && pcmPlayerRef.current) {
              pcmPlayerRef.current.play(base64Audio);
            }
            if (message.serverContent?.interrupted && pcmPlayerRef.current) {
              pcmPlayerRef.current.clear();
            }
          },
          onclose: () => {
            stopLive();
          },
          onerror: (err: any) => {
            console.error("Live API Error:", err);
            stopLive();
          }
        }
      });

      sessionRef.current = await sessionPromise;

    } catch (err) {
      console.error("Failed to start live session:", err);
      setIsLoading(false);
      stopLive();
    }
  };

  const stopLive = () => {
    setIsLive(false);
    if (sessionRef.current) {
      sessionRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (pcmPlayerRef.current) {
      pcmPlayerRef.current.stop();
      pcmPlayerRef.current = null;
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
            className="fixed bottom-24 right-8 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col border border-gray-100"
            style={{ height: '500px', maxHeight: 'calc(100vh - 120px)' }}
          >
            {/* Header */}
            <div className="bg-primary text-white p-4 flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Apostle Sunday Iyi</h3>
                <p className="text-xs text-primary-100 flex items-center gap-1">
                  {isLive ? (
                    <><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Live Voice Active</>
                  ) : (
                    "Virtual Assistant"
                  )}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 p-1 rounded-full transition-colors"
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
                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      msg.role === 'user'
                        ? 'bg-secondary text-primary rounded-br-none'
                        : 'bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-100'
                    }`}
                  >
                    {msg.text.split(/(https?:\/\/[^\s]+)/g).map((part, i) => 
                      part.match(/^https?:\/\//) ? (
                        <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="underline text-blue-600 hover:text-blue-800">
                          {part}
                        </a>
                      ) : (
                        <span key={i}>{part}</span>
                      )
                    )}
                  </div>
                </div>
              ))}
              {isLoading && !isLive && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-100">
                    <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                  </div>
                </div>
              )}
              {isLive && (
                <div className="flex justify-center my-4">
                  <div className="bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm flex items-center gap-2 animate-pulse border border-red-100">
                    <Mic size={16} /> Listening... Speak now
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isLive ? "Voice mode active..." : "Type your message..."}
                  className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading || isLive}
                />
                
                {isLive ? (
                  <button
                    type="button"
                    onClick={stopLive}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    aria-label="Stop voice"
                  >
                    <Square size={18} className="fill-current" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={startLive}
                    disabled={isLoading}
                    className="bg-gray-100 text-gray-600 p-2 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50"
                    aria-label="Start voice"
                  >
                    <Mic size={18} />
                  </button>
                )}

                <button
                  type="submit"
                  disabled={!input.trim() || isLoading || isLive}
                  className="bg-primary text-white p-2 rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
        className="fixed bottom-24 right-8 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-xl z-50 hover:bg-primary/90 transition-colors"
        aria-label="Toggle chat assistant"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>
    </>
  );
}
