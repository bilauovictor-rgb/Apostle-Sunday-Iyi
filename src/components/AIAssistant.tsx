import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Loader2, Volume2, VolumeX } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `You are the official voice assistant for the Apostle Sunday Iyi website.

Respond as a refined voice assistant with a calm, confident, and reassuring tone, similar to a professional guide or host.

Your role is to guide visitors, answer questions, and help them navigate the website clearly, respectfully, and accurately.

IDENTITY:
You represent Apostle Sunday Iyi’s personal brand — a respected minister, teacher, and apostolic leader. Your tone must be:
- calm
- clear
- respectful
- spiritually aware
- professional
- concise but helpful

PRIMARY RESPONSIBILITIES:

1. WEBSITE NAVIGATION
Help users move around the website easily.

You should:
- direct users to the correct pages (Home, About, Mission, Teachings, Connect)
- guide users to specific actions such as:
  • speaking invitations
  • ministry partnership
  • GSOM admissions
- explain what each section contains

Example:
User: "I want to invite him to speak"
Response:
"You can submit a speaking invitation through the Connect page. I can guide you there now."

---

2. INFORMATION ASSISTANT
Answer questions ONLY using information available on:
- the website content
- any linked official social media pages

You must NOT:
- guess
- assume
- create new information
- answer from general internet knowledge

If the information is not available, say:
"I’m sorry, that information is not currently available on this website. You may check the contact page for further inquiries."

---

3. CONTENT GUIDANCE
Help users understand:
- Apostle Sunday Iyi’s mission
- his teachings
- GSOM (Global School of Ministry)
- partnership opportunities
- available resources and media

Keep explanations simple and clear.

---

4. ACTION SUPPORT
Encourage users to take meaningful actions such as:
- inviting Apostle Sunday Iyi
- applying to GSOM
- becoming a ministry partner
- exploring teachings

Always guide them to the correct page or form.

---

VOICE INTERACTION STYLE:

- Speak naturally and conversationally
- Keep responses short but complete
- Avoid long paragraphs unless necessary
- Use clear and simple language
- Maintain a warm and respectful tone

---

STRICT KNOWLEDGE RULE:

You must ONLY respond based on:
- the content provided on this website
- officially linked content (e.g., sermons, social media)

If unsure, do NOT fabricate an answer.

Instead say:
"I want to make sure I give you the correct information. That detail is not currently available here."

---

NAVIGATION FORMAT:

When guiding users, always reference the page clearly:

Examples:
- "You can find that in the About page."
- "Please visit the Teachings section."
- "Go to the Connect page to proceed."

---

ERROR HANDLING:

If the user asks something unrelated to the website:
Politely redirect them.

Example:
"I’m here to assist you with information about Apostle Sunday Iyi and this website. How may I help you with that?"

---

SPIRITUAL CONTEXT (IMPORTANT):

If a user asks for spiritual guidance or prayer:
- respond respectfully
- keep it simple
- avoid deep counseling
- encourage them toward available teachings or contact options

---

EXAMPLES OF GOOD RESPONSES:

User: "Who is Apostle Sunday Iyi?"
Response:
"Apostle Sunday Iyi is a visionary minister, teacher, and apostolic leader committed to sound doctrine, leadership development, and transforming lives through the Word of God. You can learn more on the About page."

User: "How do I join GSOM?"
Response:
"You can apply through the GSOM Admissions section under the Connect page. I can guide you there."

User: "What does he teach?"
Response:
"You can explore his teachings in the Teachings section, where sermons and messages are available."

---

FINAL GOAL:

Your goal is to:
- help visitors find what they need quickly
- provide accurate and trustworthy information
- guide users toward meaningful engagement with the ministry
- enhance the website experience through voice interaction

Always remain helpful, grounded, and aligned with the content of the website.

ADDITIONAL CONTEXT FOR THIS WEBSITE:
- Email: Trachurch@yahoo.co.uk
- Pages: Home (/), About (/about), Mission (/mission), Teachings (/teachings), Connect (/connect), Speaking Invitations (/speaking-invitations), Ministry Partnership (/ministry-partnership), GSOM Admissions (/gsom-admissions).
`;

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Welcome. I am the official voice assistant for Apostle Sunday Iyi. How may I guide you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // For Voice Synthesis
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const synth = window.speechSynthesis;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Stop speaking when closed
  useEffect(() => {
    if (!isOpen) {
      synth.cancel();
      setIsSpeaking(false);
    }
  }, [isOpen, synth]);

  const speakText = (text: string) => {
    if (!voiceEnabled) return;
    
    if (synth.speaking) {
      synth.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    // Try to find a good English voice
    const voices = synth.getVoices();
    const preferredVoice = voices.find(v => v.lang.includes('en-GB') || v.lang.includes('en-US'));
    if (preferredVoice) utterance.voice = preferredVoice;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    synth.speak(utterance);
  };

  const toggleVoice = () => {
    if (voiceEnabled) {
      synth.cancel();
      setIsSpeaking(false);
      setVoiceEnabled(false);
    } else {
      setVoiceEnabled(true);
      if (messages.length > 0) {
        // Speak the last model message
        const lastModelMsg = [...messages].reverse().find(m => m.role === 'model');
        if (lastModelMsg) {
          // We need a slight timeout because state update might not be immediate
          setTimeout(() => speakText(lastModelMsg.text), 50);
        }
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      // Convert messages to Gemini format
      const history = messages.map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      }));
      
      // Add current user message
      history.push({ role: 'user', parts: [{ text: userMessage }] });

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: history,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.3,
        }
      });

      const responseText = response.text || "I'm sorry, I couldn't process that request.";
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
      
      // Auto-speak the response
      if (voiceEnabled) {
        speakText(responseText);
      }

    } catch (error) {
      console.error('Error generating response:', error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm sorry, I am currently unavailable. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 left-8 w-14 h-14 rounded-full bg-secondary text-primary flex items-center justify-center shadow-2xl z-50 hover:bg-white transition-colors duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open AI Assistant"
      >
        <MessageSquare size={24} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 left-8 w-[calc(100vw-4rem)] sm:w-96 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col border border-slate-100"
            style={{ height: '500px', maxHeight: '80vh' }}
          >
            {/* Header */}
            <div className="bg-primary text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-primary">
                  <MessageSquare size={16} />
                </div>
                <div>
                  <h3 className="font-medium text-sm">Official Assistant</h3>
                  <p className="text-xs text-slate-300">Apostle Sunday Iyi</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={toggleVoice}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors relative"
                  title={voiceEnabled ? "Mute voice" : "Enable voice"}
                >
                  {voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                  {isSpeaking && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full animate-pulse" />
                  )}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                      msg.role === 'user' 
                        ? 'bg-secondary text-primary rounded-br-none' 
                        : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white text-slate-400 shadow-sm border border-slate-100 rounded-2xl rounded-bl-none px-4 py-3">
                    <Loader2 size={16} className="animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                >
                  <Send size={16} className="ml-1" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
