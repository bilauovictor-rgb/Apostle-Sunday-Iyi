import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI, Type } from '@google/genai';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { FileText, Youtube, Share2, Mail, CheckCircle2, XCircle, Eye, Loader2, RefreshCw, Save, Wand2, Settings, Calendar, Trash2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function AdminSermonDashboard() {
  const [sermons, setSermons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSermon, setSelectedSermon] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('blog');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');
  const [user, setUser] = useState<any>(null);

  const [editedBlog, setEditedBlog] = useState('');
  const [editedYoutubeScript, setEditedYoutubeScript] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [editedSocialPosts, setEditedSocialPosts] = useState<string[]>([]);
  const [editedFeaturedImage, setEditedFeaturedImage] = useState('');
  const [editedPublishAt, setEditedPublishAt] = useState('');
  const [editedExcerpt, setEditedExcerpt] = useState('');
  const [editedSeoTitle, setEditedSeoTitle] = useState('');
  const [editedMetaDescription, setEditedMetaDescription] = useState('');
  const [editedFocusKeyword, setEditedFocusKeyword] = useState('');
  const [editedSlug, setEditedSlug] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regeneratingField, setRegeneratingField] = useState('');
  const [regeneratingStatus, setRegeneratingStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showBlogPreview, setShowBlogPreview] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'sermons'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const sermonData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSermons(sermonData);
      setLoading(false);
      
      // Update selected sermon if it changes
      if (selectedSermon) {
        const updated = sermonData.find(s => s.id === selectedSermon.id);
        if (updated) {
          setSelectedSermon(updated);
        }
      }
    }, (error) => {
      console.error("Error fetching sermons:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSelectSermon = (sermon: any) => {
    setSelectedSermon(sermon);
    setEditedBlog(sermon.blog || '');
    setEditedYoutubeScript(sermon.youtubeScript || '');
    setEditedEmail(sermon.email || '');
    setEditedSocialPosts(Array.isArray(sermon.socialPosts) ? [...sermon.socialPosts] : []);
    setEditedFeaturedImage(sermon.featuredImage || '');
    setEditedPublishAt(sermon.publishAt || '');
    setEditedExcerpt(sermon.excerpt || '');
    setEditedSeoTitle(sermon.seoTitle || '');
    setEditedMetaDescription(sermon.metaDescription || '');
    setEditedFocusKeyword(sermon.focusKeyword || '');
    setEditedSlug(sermon.slug || '');
    setError(null);
    setActionSuccess('');
  };

  const handleSave = async () => {
    if (!selectedSermon) return;
    setIsSaving(true);
    setError(null);
    try {
      const updateData: any = {
        blog: editedBlog,
        youtubeScript: editedYoutubeScript,
        email: editedEmail,
        socialPosts: editedSocialPosts,
        featuredImage: editedFeaturedImage,
        publishAt: editedPublishAt,
        excerpt: editedExcerpt,
        seoTitle: editedSeoTitle,
        metaDescription: editedMetaDescription,
        focusKeyword: editedFocusKeyword,
        slug: editedSlug,
        updatedAt: serverTimestamp()
      };

      if (selectedSermon.status === 'draft' && (editedBlog || editedYoutubeScript || editedEmail)) {
        updateData.status = 'processed';
      }

      await updateDoc(doc(db, 'sermons', selectedSermon.id), updateData);
      setActionSuccess('Changes saved successfully.');
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err: any) {
      console.error("Error saving changes:", err);
      setError("Failed to save changes: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegenerate = async (field: 'blog' | 'youtubeScript' | 'email' | 'socialPosts') => {
    if (!selectedSermon) return;
    setIsRegenerating(true);
    setRegeneratingField(field);
    setRegeneratingStatus('Initializing AI...');
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      let fieldPrompt = '';
      let schemaProperties: any = {};
      let requiredFields: string[] = [];

      setRegeneratingStatus(`Preparing prompt for ${field}...`);

      if (field === 'blog') {
        fieldPrompt = `1. A fully structured, publication-ready sermon blog using rich Markdown formatting.
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
   Write a short, powerful prayer.`;
        schemaProperties = { blog: { type: Type.STRING } };
        requiredFields = ['blog'];
      } else if (field === 'youtubeScript') {
        fieldPrompt = `1. Generate a professional YouTube sermon script in clean plain text.
   RULES:
   - Write the script naturally as if it's being read from a teleprompter.
   - DO NOT include any section labels, tags, or headers (e.g., do NOT write "Title:", "Hook:", "Opening:", "Message Flow:", "Core Teaching:", "Call to Action:", etc.).
   - DO NOT use any markdown formatting like **asterisks** or # symbols.
   - DO NOT use any HTML tags like <div>, <strong>, or <br>.
   - Use a double line break (press 'Enter' twice) between every paragraph to create clear margins and white space.
   - The script should flow seamlessly from the title (just write the title text at the top), to the hook, the main message, and the call to action, all as natural spoken paragraphs.
   - Must sound natural and ready for speaking on camera`;
        schemaProperties = { youtubeScript: { type: Type.STRING } };
        requiredFields = ['youtubeScript'];
      } else if (field === 'email') {
        fieldPrompt = `1. Generate a professional ministry email newsletter in clean plain text.
   RULES:
   - Start with "Subject: [Your compelling subject line]" on the first line.
   - DO NOT include any other section labels, tags, or headers (e.g., do NOT write "Greeting:", "Introduction:", "Message:", "Encouragement:", "Closing:", etc.). Just write the email body naturally.
   - DO NOT use any markdown formatting like **asterisks** or # symbols.
   - DO NOT use any HTML tags like <div>, <strong>, or <br>.
   - Use a double line break (press 'Enter' twice) between every paragraph to create clear margins and white space.
   - Professional and pastoral tone`;
        schemaProperties = { email: { type: Type.STRING } };
        requiredFields = ['email'];
      } else if (field === 'socialPosts') {
        fieldPrompt = '1. 5 short social media posts (quotes, insights, hooks). RULES: No HTML tags, no raw markup.';
        schemaProperties = { socialPosts: { type: Type.ARRAY, items: { type: Type.STRING } } };
        requiredFields = ['socialPosts'];
      }

      const prompt = `Act as a senior theological writer and sermon architect. Generate ONLY the requested content for a sermon based on the following details:
Title: ${selectedSermon.title}
Topic: ${selectedSermon.topic}
Goal: ${selectedSermon.goal}
${selectedSermon.manuscript ? `Manuscript: ${selectedSermon.manuscript}` : ''}

Please generate the following item:
${fieldPrompt}`;

      setRegeneratingStatus('Generating content (this may take a moment)...');
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: schemaProperties,
            required: requiredFields
          }
        }
      });

      setRegeneratingStatus('Parsing generated content...');
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

      setRegeneratingStatus('Saving to database...');
      const updateData: any = {
        updatedAt: serverTimestamp()
      };

      if (selectedSermon.status === 'draft') {
        updateData.status = 'processed';
      }

      if (field === 'blog' && generatedContent.blog) {
        updateData.blog = generatedContent.blog;
        setEditedBlog(generatedContent.blog);
      } else if (field === 'youtubeScript' && generatedContent.youtubeScript) {
        const cleanScript = cleanText(generatedContent.youtubeScript);
        updateData.youtubeScript = cleanScript;
        setEditedYoutubeScript(cleanScript);
      } else if (field === 'email' && generatedContent.email) {
        const cleanEmail = cleanText(generatedContent.email);
        updateData.email = cleanEmail;
        setEditedEmail(cleanEmail);
      } else if (field === 'socialPosts' && generatedContent.socialPosts) {
        const cleanPosts = generatedContent.socialPosts.map(cleanText);
        updateData.socialPosts = cleanPosts;
        setEditedSocialPosts(cleanPosts);
      }

      await updateDoc(doc(db, 'sermons', selectedSermon.id), updateData);
      
      setActionSuccess(`${field === 'youtubeScript' ? 'YouTube Script' : field === 'socialPosts' ? 'Social Posts' : field.charAt(0).toUpperCase() + field.slice(1)} regenerated successfully.`);
      setTimeout(() => setActionSuccess(''), 3000);

    } catch (err: any) {
      console.error(`Error regenerating ${field}:`, err);
      setError(`Failed to regenerate content: ` + err.message);
    } finally {
      setIsRegenerating(false);
      setRegeneratingField('');
      setRegeneratingStatus('');
    }
  };

  const handleSocialPostChange = (index: number, value: string) => {
    const newPosts = [...editedSocialPosts];
    newPosts[index] = value;
    setEditedSocialPosts(newPosts);
  };

  const handleStatusChange = async (sermonId: string, newStatus: string) => {
    setActionLoading(true);
    setActionSuccess('');
    try {
      await updateDoc(doc(db, 'sermons', sermonId), {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
      setActionSuccess(`Sermon successfully moved to ${newStatus}.`);
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedSermon) return;
    setIsDeleting(true);
    setError(null);
    try {
      await deleteDoc(doc(db, 'sermons', selectedSermon.id));
      setActionSuccess('Sermon deleted successfully.');
      setSelectedSermon(null);
      setShowDeleteConfirm(false);
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err: any) {
      console.error("Error deleting sermon:", err);
      setError("Failed to delete sermon: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSchedulePublish = async (sermonId: string) => {
    if (!editedPublishAt) return;
    setActionLoading(true);
    setActionSuccess('');
    try {
      await updateDoc(doc(db, 'sermons', sermonId), {
        status: 'scheduled',
        publishAt: editedPublishAt,
        updatedAt: serverTimestamp()
      });
      setActionSuccess(`Sermon scheduled for ${new Date(editedPublishAt).toLocaleString()}.`);
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (error: any) {
      console.error("Error scheduling:", error);
      setError("Failed to schedule: " + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (!user) return null;

  return (
    <section className="bg-transparent">
      <div className="mb-10">
        <h2 className="text-2xl font-serif text-white mb-1">Content <span className="gold-gradient-text italic">Dashboard</span></h2>
        <p className="text-slate-400 font-light text-sm">Manage, refine, and publish apostolic teachings.</p>
      </div>

      {actionSuccess && (
        <div className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center text-emerald-400">
          <CheckCircle2 className="w-5 h-5 mr-3 flex-shrink-0" aria-hidden="true" />
          <p className="text-sm font-medium">{actionSuccess}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* List Panel - Redesigned */}
        <div className="lg:col-span-4 bg-white/[0.02] rounded-[2.5rem] shadow-2xl border border-white/5 overflow-hidden flex flex-col h-[700px] backdrop-blur-md">
          <div className="p-6 border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl text-white">Archives</h3>
              <div className="px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-[10px] font-bold text-secondary uppercase tracking-widest">
                {sermons.length} Total
              </div>
            </div>
          </div>
          <div className="overflow-y-auto flex-grow p-4 space-y-3 custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-40 gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-secondary/40" aria-hidden="true" />
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Syncing Archives...</span>
              </div>
            ) : sermons.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 opacity-20">
                <FileText className="w-10 h-10 text-slate-500 mb-2" />
                <p className="text-slate-500 text-xs font-light">No sermons archived yet.</p>
              </div>
            ) : (
              sermons.map(sermon => (
                <motion.div 
                  key={sermon.id}
                  layout
                  onClick={() => handleSelectSermon(sermon)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all border group ${
                    selectedSermon?.id === sermon.id 
                      ? 'bg-secondary/10 border-secondary/30 shadow-lg shadow-secondary/5' 
                      : 'bg-white/[0.01] border-white/5 hover:border-white/10 hover:bg-white/[0.03]'
                  }`}
                >
                  <h4 className={`font-medium text-sm mb-1 truncate transition-colors ${selectedSermon?.id === sermon.id ? 'text-secondary' : 'text-slate-200 group-hover:text-white'}`}>{sermon.title}</h4>
                  <div className="flex items-center justify-between gap-4">
                    <span className={`text-[9px] px-2 py-0.5 rounded-full uppercase tracking-widest font-bold border ${
                      sermon.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                      sermon.status === 'scheduled' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                      sermon.status === 'processed' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                      'bg-slate-500/10 text-slate-400 border-slate-500/20'
                    }`}>
                      {sermon.status}
                    </span>
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
                      {sermon.createdAt?.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Preview Panel - Redesigned */}
        <div className="lg:col-span-8 bg-white/[0.02] rounded-[2.5rem] shadow-2xl border border-white/5 overflow-hidden flex flex-col h-[700px] backdrop-blur-md">
          {selectedSermon ? (
            <>
              <div className="p-6 sm:p-8 border-b border-white/5 bg-white/[0.02] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-serif text-2xl text-white truncate">{selectedSermon.title}</h3>
                    <span className="text-[10px] bg-secondary/10 text-secondary border border-secondary/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">{selectedSermon.topic}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-light italic">Refining apostolic content for deployment</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={actionLoading}
                    className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all border border-red-500/20 disabled:opacity-50"
                    title="Delete Sermon"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  {selectedSermon.status === 'published' || selectedSermon.status === 'scheduled' ? (
                    <button 
                      onClick={() => handleStatusChange(selectedSermon.id, 'draft')}
                      disabled={actionLoading}
                      className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold uppercase tracking-widest rounded-xl transition-all border border-white/10 disabled:opacity-50"
                    >
                      {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Move to Draft'}
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleStatusChange(selectedSermon.id, 'published')}
                      disabled={actionLoading || (!selectedSermon.blog && !selectedSermon.youtubeScript && !selectedSermon.email)}
                      className="px-6 py-2.5 bg-secondary text-primary text-xs font-bold uppercase tracking-widest rounded-xl shadow-xl hover:shadow-secondary/20 transition-all disabled:opacity-50 flex items-center"
                    >
                      {actionLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                      Deploy Now
                    </button>
                  )}
                </div>
              </div>

              {selectedSermon.status === 'draft' && !selectedSermon.blog ? (
                <div className="flex-grow flex flex-col items-center justify-center p-12 text-center">
                  <div className="w-20 h-20 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mb-6">
                    <RefreshCw className="w-10 h-10 text-slate-700 animate-spin-slow" />
                  </div>
                  <h4 className="text-xl font-serif text-white mb-2">Architecting Content...</h4>
                  <p className="text-slate-500 font-light text-sm max-w-md mx-auto leading-relaxed">
                    This sermon is currently in draft mode. Use the architect to generate apostolic content or manually input your manuscript.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex border-b border-white/5 overflow-x-auto bg-white/[0.01] px-4">
                    {[
                      { id: 'blog', icon: FileText, label: 'Blog' },
                      { id: 'youtube', icon: Youtube, label: 'Script' },
                      { id: 'social', icon: Share2, label: 'Social' },
                      { id: 'email', icon: Mail, label: 'Email' },
                      { id: 'seo', icon: Sparkles, label: 'SEO' },
                      { id: 'settings', icon: Settings, label: 'Config' }
                    ].map(tab => (
                      <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center px-6 py-5 text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap border-b-2 transition-all ${
                          activeTab === tab.id 
                            ? 'border-secondary text-secondary bg-secondary/5' 
                            : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]'
                        }`}
                      >
                        <tab.icon className="w-3.5 h-3.5 mr-2" /> {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex-grow overflow-y-auto p-6 sm:p-10 custom-scrollbar">
                    {error && (
                      <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs">
                        {error}
                      </div>
                    )}
                    
                    {activeTab === 'blog' && (
                      <div className="flex flex-col h-full space-y-6">
                        <div className="flex justify-between items-center">
                          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sermon Manuscript</h4>
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => setShowBlogPreview(!showBlogPreview)}
                              className="text-[9px] font-bold uppercase tracking-widest flex items-center px-3 py-1.5 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all border border-white/5"
                            >
                              <Eye className="w-3 h-3 mr-1.5" />
                              {showBlogPreview ? 'Editor' : 'Preview'}
                            </button>
                            <button 
                              onClick={() => handleRegenerate('blog')}
                              disabled={isRegenerating}
                              className="text-[9px] font-bold uppercase tracking-widest flex items-center px-3 py-1.5 bg-secondary/10 text-secondary hover:bg-secondary/20 rounded-lg transition-all border border-secondary/20 disabled:opacity-50"
                            >
                              {isRegenerating && regeneratingField === 'blog' ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <>
                                  <Wand2 className="w-3 h-3 mr-1.5" />
                                  Regenerate
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                        {showBlogPreview ? (
                          <div className="flex-grow w-full p-8 rounded-2xl border border-white/5 bg-white/[0.01] overflow-y-auto min-h-[400px]">
                            <div className="prose prose-invert prose-slate max-w-none font-light leading-relaxed prose-headings:font-serif prose-headings:text-white prose-headings:font-normal prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-6 prose-h2:gold-gradient-text prose-h3:text-xl prose-p:text-slate-400 prose-blockquote:border-l-secondary prose-blockquote:bg-white/[0.02] prose-blockquote:rounded-r-2xl prose-blockquote:font-serif prose-blockquote:italic prose-strong:text-secondary">
                              <ReactMarkdown>{editedBlog}</ReactMarkdown>
                            </div>
                          </div>
                        ) : (
                          <textarea 
                            value={editedBlog}
                            onChange={(e) => setEditedBlog(e.target.value)}
                            className="flex-grow w-full p-6 rounded-2xl border border-white/5 bg-white/[0.01] focus:border-secondary/30 outline-none resize-none min-h-[400px] text-slate-300 font-light leading-relaxed text-sm custom-scrollbar"
                            placeholder="Awaiting apostolic revelation..."
                          />
                        )}
                      </div>
                    )}

                    {activeTab === 'youtube' && (
                      <div className="flex flex-col h-full space-y-6">
                        <div className="flex justify-between items-center">
                          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Teleprompter Script</h4>
                          <button 
                            onClick={() => handleRegenerate('youtubeScript')}
                            disabled={isRegenerating}
                            className="text-[9px] font-bold uppercase tracking-widest flex items-center px-3 py-1.5 bg-secondary/10 text-secondary hover:bg-secondary/20 rounded-lg transition-all border border-secondary/20 disabled:opacity-50"
                          >
                            {isRegenerating && regeneratingField === 'youtubeScript' ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <>
                                <Wand2 className="w-3 h-3 mr-1.5" />
                                Regenerate
                              </>
                            )}
                          </button>
                        </div>
                        <textarea 
                          value={editedYoutubeScript}
                          onChange={(e) => setEditedYoutubeScript(e.target.value)}
                          className="flex-grow w-full p-6 rounded-2xl border border-white/5 bg-white/[0.01] focus:border-secondary/30 outline-none resize-none min-h-[400px] text-slate-300 font-mono text-sm leading-relaxed custom-scrollbar"
                          placeholder="Scripting for the digital pulpit..."
                        />
                      </div>
                    )}

                    {activeTab === 'social' && (
                      <div className="flex flex-col h-full space-y-6">
                        <div className="flex justify-between items-center">
                          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Apostolic Snippets</h4>
                          <button 
                            onClick={() => handleRegenerate('socialPosts')}
                            disabled={isRegenerating}
                            className="text-[9px] font-bold uppercase tracking-widest flex items-center px-3 py-1.5 bg-secondary/10 text-secondary hover:bg-secondary/20 rounded-lg transition-all border border-secondary/20 disabled:opacity-50"
                          >
                            {isRegenerating && regeneratingField === 'socialPosts' ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <>
                                <Wand2 className="w-3 h-3 mr-1.5" />
                                Regenerate
                              </>
                            )}
                          </button>
                        </div>
                        <div className="space-y-4 pb-10">
                          {editedSocialPosts.map((post: string, idx: number) => (
                            <div key={idx} className="relative group">
                              <span className="absolute top-4 right-4 text-[10px] font-bold text-slate-700 group-hover:text-secondary transition-colors uppercase tracking-widest">Snippet {idx + 1}</span>
                              <textarea
                                value={post}
                                onChange={(e) => handleSocialPostChange(idx, e.target.value)}
                                className="w-full p-6 rounded-2xl border border-white/5 bg-white/[0.01] focus:border-secondary/30 outline-none resize-y min-h-[120px] text-slate-300 font-light text-sm"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'email' && (
                      <div className="flex flex-col h-full space-y-6">
                        <div className="flex justify-between items-center">
                          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ministry Newsletter</h4>
                          <button 
                            onClick={() => handleRegenerate('email')}
                            disabled={isRegenerating}
                            className="text-[9px] font-bold uppercase tracking-widest flex items-center px-3 py-1.5 bg-secondary/10 text-secondary hover:bg-secondary/20 rounded-lg transition-all border border-secondary/20 disabled:opacity-50"
                          >
                            {isRegenerating && regeneratingField === 'email' ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <>
                                <Wand2 className="w-3 h-3 mr-1.5" />
                                Regenerate
                              </>
                            )}
                          </button>
                        </div>
                        <textarea 
                          value={editedEmail}
                          onChange={(e) => setEditedEmail(e.target.value)}
                          className="flex-grow w-full p-6 rounded-2xl border border-white/5 bg-white/[0.01] focus:border-secondary/30 outline-none resize-none min-h-[400px] text-slate-300 font-light leading-relaxed text-sm custom-scrollbar"
                          placeholder="Drafting the apostolic charge..."
                        />
                      </div>
                    )}

                    {activeTab === 'seo' && (
                      <div className="flex flex-col h-full space-y-8 pb-10">
                        <div className="flex justify-between items-center">
                          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Apostolic SEO Metadata</h4>
                        </div>
                        
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">SEO Title</label>
                            <input 
                              type="text"
                              value={editedSeoTitle}
                              onChange={(e) => setEditedSeoTitle(e.target.value)}
                              className="w-full bg-white/[0.03] px-5 py-4 rounded-2xl border border-white/10 focus:border-secondary/50 outline-none text-white text-sm"
                              placeholder="SEO optimized title..."
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Meta Description</label>
                            <textarea 
                              value={editedMetaDescription}
                              onChange={(e) => setEditedMetaDescription(e.target.value)}
                              rows={3}
                              className="w-full bg-white/[0.03] px-5 py-4 rounded-2xl border border-white/10 focus:border-secondary/50 outline-none resize-none text-slate-300 text-sm font-light"
                              placeholder="Summary for search engines (max 160 chars)..."
                            />
                            <p className="text-[9px] text-slate-600 text-right">{editedMetaDescription.length}/160</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Focus Keyword</label>
                              <input 
                                type="text"
                                value={editedFocusKeyword}
                                onChange={(e) => setEditedFocusKeyword(e.target.value)}
                                className="w-full bg-white/[0.03] px-5 py-4 rounded-2xl border border-white/10 focus:border-secondary/50 outline-none text-white text-sm"
                                placeholder="Mandate, Reconciliation, etc."
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">URL Slug</label>
                              <input 
                                type="text"
                                value={editedSlug}
                                onChange={(e) => setEditedSlug(e.target.value)}
                                className="w-full bg-white/[0.03] px-5 py-4 rounded-2xl border border-white/10 focus:border-secondary/50 outline-none text-white text-sm font-mono"
                                placeholder="the-ministry-of-reconciliation"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'settings' && (
                      <div className="flex flex-col h-full space-y-8 pb-10">
                        <div className="space-y-3">
                          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Featured Visual Asset</h4>
                          <input 
                            type="text"
                            value={editedFeaturedImage}
                            onChange={(e) => setEditedFeaturedImage(e.target.value)}
                            className="w-full bg-white/[0.03] px-5 py-4 rounded-2xl border border-white/10 focus:border-secondary/50 outline-none text-white text-sm"
                            placeholder="Cloudinary or Unsplash URL"
                          />
                          {editedFeaturedImage && (
                            <div className="relative h-56 rounded-2xl overflow-hidden border border-white/10 group">
                              <img src={editedFeaturedImage} alt="Featured" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-3">
                          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Apostolic Excerpt</h4>
                          <textarea 
                            value={editedExcerpt}
                            onChange={(e) => setEditedExcerpt(e.target.value)}
                            className="w-full bg-white/[0.03] px-5 py-4 rounded-2xl border border-white/10 focus:border-secondary/50 outline-none resize-none min-h-[120px] text-slate-300 font-light text-sm"
                            placeholder="A brief summary for the public archives..."
                          />
                        </div>
                        
                        <div className="pt-8 border-t border-white/5 space-y-6">
                          <div>
                            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1 mb-4">Deployment Schedule</h4>
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                              <div className="relative w-full sm:w-auto">
                                <input 
                                  type="datetime-local"
                                  value={editedPublishAt}
                                  onChange={(e) => setEditedPublishAt(e.target.value)}
                                  className="w-full sm:w-auto bg-white/[0.03] px-5 py-3.5 rounded-2xl border border-white/10 focus:border-secondary/50 outline-none text-slate-300 text-sm"
                                />
                              </div>
                              <button
                                onClick={() => handleSchedulePublish(selectedSermon.id)}
                                disabled={actionLoading || !editedPublishAt}
                                className="w-full sm:w-auto px-6 py-3.5 bg-white/5 hover:bg-white/10 text-slate-300 text-[10px] font-bold uppercase tracking-widest rounded-2xl transition-all border border-white/10 disabled:opacity-50 flex items-center justify-center"
                              >
                                {actionLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Calendar className="w-4 h-4 mr-2" />}
                                Schedule Deployment
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 border-t border-white/5 bg-white/[0.02] flex justify-end shrink-0">
                    <button
                      onClick={handleSave}
                      disabled={isSaving || isRegenerating}
                      className="premium-button px-10 py-3.5 flex items-center text-xs disabled:opacity-50"
                    >
                      {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                      Finalize Changes
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center p-12 text-center">
              <div className="w-24 h-24 rounded-full bg-white/[0.01] border border-white/5 flex items-center justify-center mb-8 opacity-20">
                <Eye className="w-12 h-12 text-slate-500" />
              </div>
              <h4 className="text-2xl font-serif text-white/40 mb-2">Awaiting Selection</h4>
              <p className="text-slate-600 font-light text-sm max-w-xs mx-auto">Select a teaching from the archives to begin the refinement process.</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal - Redesigned */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(false)}
              className="absolute inset-0 bg-primary/90 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-primary border border-white/10 rounded-[2.5rem] p-8 sm:p-10 max-w-md w-full shadow-2xl z-10"
            >
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-6 mx-auto">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif text-white mb-3 text-center">Purge Archive?</h3>
              <p className="text-slate-400 mb-8 font-light text-center leading-relaxed">
                This action will permanently remove this teaching from the apostolic archives. This process is irreversible.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="flex-1 px-6 py-4 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold uppercase tracking-widest rounded-2xl transition-all border border-white/10 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 px-6 py-4 bg-red-500 text-white text-xs font-bold uppercase tracking-widest rounded-2xl shadow-xl shadow-red-500/20 hover:bg-red-600 transition-all flex items-center justify-center disabled:opacity-50"
                >
                  {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Confirm Purge'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
