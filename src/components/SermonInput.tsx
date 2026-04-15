import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Save, Loader2, CheckCircle2, AlertCircle, LogIn, Wand2, Sparkles, LogOut, User as UserIcon, ShieldCheck, ChevronRight, Send, History } from 'lucide-react';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth';
import { GoogleGenAI, Type } from '@google/genai';
import { db, auth } from '../firebase';

export default function SermonInput() {
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [goal, setGoal] = useState('');
  const [manuscript, setManuscript] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/cancelled-popup-request' || err.code === 'auth/popup-closed-by-user') {
        setError('Login was cancelled. Please try again.');
      } else {
        setError('Failed to log in. ' + err.message);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!title.trim() || !topic.trim() || !goal.trim()) {
      setError('Title, Topic, and Goal are required.');
      return;
    }

    setIsSubmitting(true);
    setLoadingText('Saving draft...');
    setError(null);
    setSuccess(false);

    const trimmedManuscript = manuscript.trim();
    const inputMode = trimmedManuscript ? 'manuscript' : 'topic_goal';

    try {
      // 1. Save initial draft
      const docRef = await addDoc(collection(db, 'sermons'), {
        title: title.trim(),
        topic: topic.trim(),
        goal: goal.trim(),
        manuscript: trimmedManuscript,
        inputMode: inputMode,
        status: 'draft',
        createdAt: serverTimestamp()
      });

      // 2. Generate AI Content
      setLoadingText('Generating content...');
      
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const prompt = `Act as a senior theological writer and sermon architect. Generate content for a sermon based on the following details:
Title: ${title.trim()}
Topic: ${topic.trim()}
Goal: ${goal.trim()}
${trimmedManuscript ? `Manuscript: ${trimmedManuscript}` : ''}

Please generate the following items:
1. A fully structured, publication-ready sermon blog using rich Markdown formatting.
   IMPORTANT:
   - Use proper Markdown headings (## for main sections, ### for subsections)
   - DO NOT output structural labels like "Title", "Introduction", "Scripture Foundation", "Practical Application", "Spiritual Emphasis", or "Conclusion" as headings. Just write the content seamlessly.
   - The only headings you should create are thematic, engaging headings for the main teaching points, and exactly "## Pray This prayer:" for the prayer section.
   - Use bold text (**text**) for emphasis and key points
   - Use blockquotes (>) for scriptures or important quotes
   - Use bulleted or numbered lists where appropriate
   - Write in well-structured paragraphs with clear line breaks between them
   - Minimum 800-1200 words
   - Tone must be apostolic and spiritually deep

   STRUCTURE TO FOLLOW:
   [No Heading] Write a compelling introduction that presents the message clearly.
   [No Heading] Include 1-3 relevant Bible passages and explain them briefly. Use blockquotes for the scripture text.
   ## [Create a thematic, engaging heading for the First Teaching Point]
   Deep explanation with biblical backing and real-life meaning.
   ## [Create a thematic, engaging heading for the Second Teaching Point]
   Expand deeper with spiritual insight.
   ## [Create a thematic, engaging heading for the Revelation Insight]
   Provide deeper understanding and reflection.
   [No Heading] Give clear, actionable steps for believers.
   [No Heading] Encourage transformation with authority and conviction.
   [No Heading] Summarize and reinforce the message.
   ## Pray This prayer:
   Write a short, powerful prayer.

2. A short excerpt (2-3 sentences) summarizing the blog post.
3. SEO metadata: seoTitle, metaDescription (max 160 chars), focusKeyword, and a URL-friendly slug.
4. Generate a professional YouTube sermon script in clean plain text.
   RULES:
   - Write the script naturally as if it's being read from a teleprompter.
   - DO NOT include any section labels, tags, or headers (e.g., do NOT write "Title:", "Hook:", "Opening:", "Message Flow:", "Core Teaching:", "Call to Action:", etc.).
   - DO NOT use any markdown formatting like **asterisks** or # symbols.
   - DO NOT use any HTML tags like <div>, <strong>, or <br>.
   - Use a double line break (press 'Enter' twice) between every paragraph to create clear margins and white space.
   - The script should flow seamlessly from the title (just write the title text at the top), to the hook, the main message, and the call to action, all as natural spoken paragraphs.
   - Must sound natural and ready for speaking on camera.
5. 5 short social media posts (quotes, insights, hooks). RULES: No HTML tags, no raw markup.
6. Generate a professional ministry email newsletter in clean plain text.
   RULES:
   - Start with "Subject: [Your compelling subject line]" on the first line.
   - DO NOT include any other section labels, tags, or headers (e.g., do NOT write "Greeting:", "Introduction:", "Message:", "Encouragement:", "Closing:", etc.). Just write the email body naturally.
   - DO NOT use any markdown formatting like **asterisks** or # symbols.
   - DO NOT use any HTML tags like <div>, <strong>, or <br>.
   - Use a double line break (press 'Enter' twice) between every paragraph to create clear margins and white space.
   - Professional and pastoral tone.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              blog: { type: Type.STRING },
              excerpt: { type: Type.STRING },
              seoTitle: { type: Type.STRING },
              metaDescription: { type: Type.STRING },
              focusKeyword: { type: Type.STRING },
              slug: { type: Type.STRING },
              youtubeScript: { type: Type.STRING },
              socialPosts: { type: Type.ARRAY, items: { type: Type.STRING } },
              email: { type: Type.STRING }
            },
            required: ["blog", "excerpt", "seoTitle", "metaDescription", "focusKeyword", "slug", "youtubeScript", "socialPosts", "email"]
          }
        }
      });

      const generatedContent = JSON.parse(response.text || '{}');

      const cleanText = (text: string) => {
        if (!text) return '';
        let cleaned = text.replace(/<[^>]*>?/gm, ''); // Remove HTML
        cleaned = cleaned.replace(/\*\*/g, ''); // Remove bold asterisks
        cleaned = cleaned.replace(/#/g, ''); // Remove heading hashes
        
        // Remove specific labels at the beginning of lines
        const labels = [
          'Title', 'Hook', 'Opening', 'Message Flow', 'The Problem',
          'Biblical Foundation', 'Core Teaching', 'Application',
          'Spiritual Charge', 'Closing', 'Call to Action',
          'Subject', 'Greeting', 'Introduction', 'Message',
          'Encouragement', 'Rules'
        ];
        
        labels.forEach(label => {
          const regex = new RegExp(`^${label}\\s*:?\\s*`, 'gmi');
          cleaned = cleaned.replace(regex, '');
        });
        
        return cleaned.trim();
      };

      // 3. Update Firestore Document
      setLoadingText('Finalizing...');
      await updateDoc(doc(db, 'sermons', docRef.id), {
        blog: generatedContent.blog || '',
        excerpt: generatedContent.excerpt || '',
        seoTitle: generatedContent.seoTitle || '',
        metaDescription: generatedContent.metaDescription || '',
        focusKeyword: generatedContent.focusKeyword || '',
        slug: generatedContent.slug || title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        youtubeScript: cleanText(generatedContent.youtubeScript || ''),
        socialPosts: (generatedContent.socialPosts || []).map(cleanText),
        email: cleanText(generatedContent.email || ''),
        status: 'processed',
        updatedAt: serverTimestamp()
      });

      setSuccess(true);
      // Clear fields
      setTitle('');
      setTopic('');
      setGoal('');
      setManuscript('');
      
      // Hide success message after 4 seconds
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      console.error('Error in sermon generation:', err);
      setError(err.message || 'An error occurred while processing the sermon.');
    } finally {
      setIsSubmitting(false);
      setLoadingText('');
    }
  };

  return (
    <section className="bg-transparent">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/[0.02] rounded-[2.5rem] p-8 sm:p-10 shadow-2xl border border-white/5 backdrop-blur-md"
      >
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif text-white mb-1">Sermon <span className="gold-gradient-text italic">Architect</span></h2>
            <p className="text-slate-400 font-light text-sm">Design and deploy apostolic teachings with AI assistance.</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
            <Wand2 className="w-6 h-6" />
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start text-red-400">
            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5 mr-3 flex-shrink-0" aria-hidden="true" />
            <p className="text-sm font-medium">Sermon architecture finalized successfully.</p>
          </div>
        )}

        {!user ? (
          <div className="text-center py-12">
            <p className="text-slate-400 mb-6 font-light">Authentication required to access the architect.</p>
            <button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="premium-button inline-flex items-center px-8 py-4 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" aria-hidden="true" />
                  Authenticating...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" aria-hidden="true" />
                  Admin Login
                </>
              )}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="title" className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Sermon Title</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white/[0.03] px-5 py-4 rounded-2xl border border-white/10 focus:border-secondary/50 focus:ring-1 focus:ring-secondary/20 transition-all outline-none text-white placeholder:text-slate-600"
                  placeholder="e.g. The Ministry of Reconciliation"
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="topic" className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Thematic Topic</label>
                <input
                  type="text"
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-white/[0.03] px-5 py-4 rounded-2xl border border-white/10 focus:border-secondary/50 focus:ring-1 focus:ring-secondary/20 transition-all outline-none text-white placeholder:text-slate-600"
                  placeholder="e.g. Apostolic Mandate"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="goal" className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Spiritual Objective</label>
              <textarea
                id="goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                rows={2}
                className="w-full bg-white/[0.03] px-5 py-4 rounded-2xl border border-white/10 focus:border-secondary/50 focus:ring-1 focus:ring-secondary/20 transition-all outline-none text-white placeholder:text-slate-600 resize-none"
                placeholder="What is the primary spiritual goal of this message?"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="manuscript" className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Full Manuscript (Optional)</label>
              <textarea
                id="manuscript"
                value={manuscript}
                onChange={(e) => setManuscript(e.target.value)}
                rows={10}
                className="w-full bg-white/[0.03] px-5 py-4 rounded-2xl border border-white/10 focus:border-secondary/50 focus:ring-1 focus:ring-secondary/20 transition-all outline-none text-white placeholder:text-slate-600 resize-y font-mono text-sm"
                placeholder="Paste full sermon manuscript here for AI refinement, or leave blank to generate from scratch."
                disabled={isSubmitting}
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="premium-button w-full px-10 py-5 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" aria-hidden="true" />
                    <span className="animate-pulse">{loadingText || 'Architecting...'}</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" aria-hidden="true" />
                    Generate & Deploy Sermon
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </section>
  );
}
