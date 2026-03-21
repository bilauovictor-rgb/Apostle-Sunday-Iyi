import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { GoogleGenAI, Type } from '@google/genai';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { FileText, Youtube, Share2, Mail, CheckCircle2, XCircle, Eye, Loader2, RefreshCw, Save, Wand2, Settings, Calendar, Trash2 } from 'lucide-react';
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
    <section className="py-16 bg-slate-100 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-3xl font-serif text-primary mb-2">Generated Sermons Dashboard</h2>
          <p className="text-slate-500 font-light">Manage, preview, and publish AI-generated sermon content.</p>
        </div>

        {actionSuccess && (
          <div className="mb-8 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center text-emerald-700">
            <CheckCircle2 className="w-5 h-5 mr-3 flex-shrink-0" />
            <p className="text-sm font-medium">{actionSuccess}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* List Panel */}
          <div className="lg:col-span-1 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-[600px]">
            <div className="p-6 border-b border-slate-100 bg-slate-50">
              <h3 className="font-serif text-xl text-primary">All Sermons</h3>
            </div>
            <div className="overflow-y-auto flex-grow p-4 space-y-3">
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="w-6 h-6 animate-spin text-secondary" />
                </div>
              ) : sermons.length === 0 ? (
                <p className="text-slate-500 text-center py-8 font-light">No sermons found.</p>
              ) : (
                sermons.map(sermon => (
                  <div 
                    key={sermon.id}
                    onClick={() => handleSelectSermon(sermon)}
                    className={`p-4 rounded-2xl cursor-pointer transition-all border ${selectedSermon?.id === sermon.id ? 'bg-primary text-white border-primary' : 'bg-white border-slate-100 hover:border-secondary hover:shadow-sm text-slate-800'}`}
                  >
                    <h4 className={`font-medium mb-1 truncate ${selectedSermon?.id === sermon.id ? 'text-white' : 'text-primary'}`}>{sermon.title}</h4>
                    <p className={`text-xs mb-3 truncate ${selectedSermon?.id === sermon.id ? 'text-slate-300' : 'text-slate-500'}`}>{sermon.topic}</p>
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-bold ${
                        sermon.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 
                        sermon.status === 'scheduled' ? 'bg-amber-100 text-amber-700' : 
                        sermon.status === 'processed' ? 'bg-blue-100 text-blue-700' : 
                        'bg-slate-200 text-slate-600'
                      }`}>
                        {sermon.status}
                      </span>
                      <span className={`flex items-center text-[10px] ${selectedSermon?.id === sermon.id ? 'text-slate-300' : 'text-slate-400'}`}>
                        {sermon.status === 'scheduled' && <Calendar className="w-3 h-3 mr-1" />}
                        {sermon.status === 'scheduled' && sermon.publishAt 
                          ? new Date(sermon.publishAt).toLocaleDateString()
                          : sermon.createdAt?.toDate().toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-[600px]">
            {selectedSermon ? (
              <>
                <div className="p-6 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-2xl text-primary mb-1">{selectedSermon.title}</h3>
                    <p className="text-sm text-slate-500 font-light">Previewing generated content</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={actionLoading}
                      className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-xl transition-colors flex items-center disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </button>
                    {selectedSermon.status === 'published' || selectedSermon.status === 'scheduled' ? (
                      <button 
                        onClick={() => handleStatusChange(selectedSermon.id, 'draft')}
                        disabled={actionLoading}
                        className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium rounded-xl transition-colors flex items-center disabled:opacity-50"
                      >
                        {actionLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <XCircle className="w-4 h-4 mr-2" />}
                        Move to Draft
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleStatusChange(selectedSermon.id, 'published')}
                        disabled={actionLoading || (!selectedSermon.blog && !selectedSermon.youtubeScript && !selectedSermon.email)}
                        className="px-4 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-xl transition-colors flex items-center disabled:opacity-50"
                      >
                        {actionLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                        Publish Now
                      </button>
                    )}
                  </div>
                </div>

                {selectedSermon.status === 'draft' && !selectedSermon.blog ? (
                  <div className="flex-grow flex flex-col items-center justify-center p-8 text-center">
                    <RefreshCw className="w-12 h-12 text-slate-300 mb-4" />
                    <h4 className="text-lg font-medium text-slate-700 mb-2">No generated content available yet.</h4>
                    <p className="text-slate-500 font-light max-w-md">This sermon is still a draft. Content may be generating or it was saved without AI generation.</p>
                  </div>
                ) : (
                  <>
                    <div className="flex border-b border-slate-100 overflow-x-auto">
                      <button 
                        onClick={() => setActiveTab('blog')}
                        className={`flex items-center px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === 'blog' ? 'border-secondary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                      >
                        <FileText className="w-4 h-4 mr-2" /> Blog Post
                      </button>
                      <button 
                        onClick={() => setActiveTab('youtube')}
                        className={`flex items-center px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === 'youtube' ? 'border-secondary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                      >
                        <Youtube className="w-4 h-4 mr-2" /> YouTube Script
                      </button>
                      <button 
                        onClick={() => setActiveTab('social')}
                        className={`flex items-center px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === 'social' ? 'border-secondary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                      >
                        <Share2 className="w-4 h-4 mr-2" /> Social Posts
                      </button>
                      <button 
                        onClick={() => setActiveTab('email')}
                        className={`flex items-center px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === 'email' ? 'border-secondary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                      >
                        <Mail className="w-4 h-4 mr-2" /> Email
                      </button>
                      <button 
                        onClick={() => setActiveTab('settings')}
                        className={`flex items-center px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === 'settings' ? 'border-secondary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                      >
                        <Settings className="w-4 h-4 mr-2" /> Settings
                      </button>
                    </div>

                    <div className="flex-grow overflow-y-auto p-6 sm:p-8 bg-slate-50/50">
                      {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                          {error}
                        </div>
                      )}
                      
                      {activeTab === 'blog' && (
                        <div className="flex flex-col h-full">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="font-medium text-slate-700">Edit Blog Post</h4>
                            <div className="flex items-center space-x-3">
                              <button 
                                onClick={() => setShowBlogPreview(!showBlogPreview)}
                                className="text-xs flex items-center px-3 py-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                              >
                                <Eye className="w-3 h-3 mr-1.5" />
                                {showBlogPreview ? 'Edit Mode' : 'Preview'}
                              </button>
                              <button 
                                onClick={() => handleRegenerate('blog')}
                                disabled={isRegenerating}
                                className="text-xs flex items-center px-3 py-1.5 bg-secondary/10 text-secondary hover:bg-secondary/20 rounded-lg transition-colors disabled:opacity-50"
                              >
                                {isRegenerating && regeneratingField === 'blog' ? (
                                  <>
                                    <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                                    {regeneratingStatus || 'Regenerating...'}
                                  </>
                                ) : (
                                  <>
                                    <Wand2 className="w-3 h-3 mr-1.5" />
                                    Regenerate Blog
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                          {showBlogPreview ? (
                            <div className="flex-grow w-full p-6 rounded-xl border border-slate-200 bg-white overflow-y-auto min-h-[300px]">
                              <div className="prose prose-slate max-w-none font-light leading-relaxed prose-headings:font-serif prose-headings:text-primary prose-headings:font-normal prose-h1:text-3xl prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-p:text-slate-600 prose-p:mb-4 prose-a:text-secondary prose-a:no-underline hover:prose-a:underline prose-strong:text-primary prose-strong:font-medium prose-blockquote:border-l-secondary prose-blockquote:bg-slate-50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:text-slate-700 prose-blockquote:font-serif prose-blockquote:italic prose-ul:list-disc prose-ol:list-decimal prose-li:my-1">
                                <ReactMarkdown>{editedBlog}</ReactMarkdown>
                              </div>
                            </div>
                          ) : (
                            <textarea 
                              value={editedBlog}
                              onChange={(e) => setEditedBlog(e.target.value)}
                              className="flex-grow w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none resize-none min-h-[300px] text-slate-700 font-light leading-relaxed"
                              placeholder="Blog content..."
                            />
                          )}
                        </div>
                      )}
                      {activeTab === 'youtube' && (
                        <div className="flex flex-col h-full">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="font-medium text-slate-700">Edit YouTube Script</h4>
                            <button 
                              onClick={() => handleRegenerate('youtubeScript')}
                              disabled={isRegenerating}
                              className="text-xs flex items-center px-3 py-1.5 bg-secondary/10 text-secondary hover:bg-secondary/20 rounded-lg transition-colors disabled:opacity-50"
                            >
                              {isRegenerating && regeneratingField === 'youtubeScript' ? (
                                <>
                                  <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                                  {regeneratingStatus || 'Regenerating...'}
                                </>
                              ) : (
                                <>
                                  <Wand2 className="w-3 h-3 mr-1.5" />
                                  Regenerate Script
                                </>
                              )}
                            </button>
                          </div>
                          <textarea 
                            value={editedYoutubeScript}
                            onChange={(e) => setEditedYoutubeScript(e.target.value)}
                            className="flex-grow w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none resize-none min-h-[300px] text-slate-700 font-light leading-relaxed"
                            placeholder="YouTube script..."
                          />
                        </div>
                      )}
                      {activeTab === 'social' && (
                        <div className="flex flex-col h-full">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="font-medium text-slate-700">Edit Social Posts</h4>
                            <button 
                              onClick={() => handleRegenerate('socialPosts')}
                              disabled={isRegenerating}
                              className="text-xs flex items-center px-3 py-1.5 bg-secondary/10 text-secondary hover:bg-secondary/20 rounded-lg transition-colors disabled:opacity-50"
                            >
                              {isRegenerating && regeneratingField === 'socialPosts' ? (
                                <>
                                  <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                                  {regeneratingStatus || 'Regenerating...'}
                                </>
                              ) : (
                                <>
                                  <Wand2 className="w-3 h-3 mr-1.5" />
                                  Regenerate Posts
                                </>
                              )}
                            </button>
                          </div>
                          <div className="space-y-4 pb-6">
                            {editedSocialPosts.length > 0 ? (
                              editedSocialPosts.map((post: string, idx: number) => (
                                <div key={idx} className="relative">
                                  <span className="absolute top-3 right-3 text-xs font-bold text-slate-300 pointer-events-none">#{idx + 1}</span>
                                  <textarea
                                    value={post}
                                    onChange={(e) => handleSocialPostChange(idx, e.target.value)}
                                    className="w-full p-4 pr-10 rounded-xl border border-slate-200 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none resize-y min-h-[120px] text-slate-700 font-light"
                                  />
                                </div>
                              ))
                            ) : (
                              <p className="text-slate-500 font-light">No social posts generated.</p>
                            )}
                          </div>
                        </div>
                      )}
                      {activeTab === 'email' && (
                        <div className="flex flex-col h-full">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="font-medium text-slate-700">Edit Email Newsletter</h4>
                            <button 
                              onClick={() => handleRegenerate('email')}
                              disabled={isRegenerating}
                              className="text-xs flex items-center px-3 py-1.5 bg-secondary/10 text-secondary hover:bg-secondary/20 rounded-lg transition-colors disabled:opacity-50"
                            >
                              {isRegenerating && regeneratingField === 'email' ? (
                                <>
                                  <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                                  {regeneratingStatus || 'Regenerating...'}
                                </>
                              ) : (
                                <>
                                  <Wand2 className="w-3 h-3 mr-1.5" />
                                  Regenerate Email
                                </>
                              )}
                            </button>
                          </div>
                          <textarea 
                            value={editedEmail}
                            onChange={(e) => setEditedEmail(e.target.value)}
                            className="flex-grow w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none resize-none min-h-[300px] text-slate-700 font-light leading-relaxed"
                            placeholder="Email content..."
                          />
                        </div>
                      )}
                      {activeTab === 'settings' && (
                        <div className="flex flex-col h-full space-y-6">
                          <div>
                            <h4 className="font-medium text-slate-700 mb-2">Featured Image URL</h4>
                            <input 
                              type="text"
                              value={editedFeaturedImage}
                              onChange={(e) => setEditedFeaturedImage(e.target.value)}
                              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none text-slate-700 font-light"
                              placeholder="https://images.unsplash.com/..."
                            />
                            {editedFeaturedImage && (
                              <div className="mt-3 h-48 rounded-xl overflow-hidden border border-slate-200 relative">
                                <img src={editedFeaturedImage} alt="Featured" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-slate-700 mb-2">Excerpt (Short Summary)</h4>
                            <textarea 
                              value={editedExcerpt}
                              onChange={(e) => setEditedExcerpt(e.target.value)}
                              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none resize-none min-h-[100px] text-slate-700 font-light"
                              placeholder="Short summary for public cards..."
                            />
                          </div>
                          
                          <div className="pt-4 border-t border-slate-200">
                            <h4 className="font-medium text-slate-700 mb-2">Schedule Publishing</h4>
                            <div className="flex items-center space-x-4">
                              <input 
                                type="datetime-local"
                                value={editedPublishAt}
                                onChange={(e) => setEditedPublishAt(e.target.value)}
                                className="p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-secondary focus:border-transparent outline-none text-slate-700 font-light"
                              />
                              <button
                                onClick={() => handleSchedulePublish(selectedSermon.id)}
                                disabled={actionLoading || !editedPublishAt}
                                className="px-4 py-3 bg-secondary hover:bg-secondary/90 text-white text-sm font-medium rounded-xl transition-colors flex items-center disabled:opacity-50"
                              >
                                {actionLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Calendar className="w-4 h-4 mr-2" />}
                                Schedule Publish
                              </button>
                            </div>
                            <p className="text-xs text-slate-500 mt-2">Set a date and time to automatically publish this sermon.</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 sm:p-6 border-t border-slate-100 bg-white flex justify-end shrink-0">
                      <button
                        onClick={handleSave}
                        disabled={isSaving || isRegenerating}
                        className="premium-button px-6 py-2.5 flex items-center text-sm disabled:opacity-50"
                      >
                        {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        Save Changes
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center p-8 text-center text-slate-400">
                <Eye className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-lg font-light">Select a sermon from the list to preview its content.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-xl font-serif text-slate-800 mb-2">Delete Sermon</h3>
            <p className="text-slate-600 mb-6 font-light">Are you sure you want to delete this sermon? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors flex items-center disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
