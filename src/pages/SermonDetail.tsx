import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { ArrowLeft, Calendar, Loader2, Share2, Twitter, Facebook, MessageCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import WhatsAppShare from '../components/WhatsAppShare';

export default function SermonDetail() {
  const { sermonId } = useParams<{ sermonId: string }>();
  const [sermon, setSermon] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const fetchSermon = async () => {
      if (!sermonId) return;
      
      try {
        const docRef = doc(db, 'sermons', sermonId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          
          let isAutoPublished = false;
          if (data.status === 'scheduled' && data.publishAt) {
            const publishDate = new Date(data.publishAt);
            if (publishDate <= new Date()) {
              isAutoPublished = true;
            }
          }

          // Allow admins to view drafts, but block public
          if (data.status !== 'published' && !isAutoPublished && !user) {
            setError('This teaching is not available.');
          } else {
            setSermon({ id: docSnap.id, ...data });
          }
        } else {
          setError('Teaching not found.');
        }
      } catch (err) {
        console.error("Error fetching sermon:", err);
        setError('An error occurred while loading the teaching.');
      } finally {
        setLoading(false);
      }
    };

    fetchSermon();
  }, [sermonId, user]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex justify-center items-center bg-slate-50">
        <Loader2 className="w-12 h-12 animate-spin text-secondary" aria-hidden="true" />
      </div>
    );
  }

  if (error || !sermon) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col justify-center items-center bg-slate-50 text-center px-4">
        <h2 className="text-3xl font-serif text-primary mb-4">Teaching Unavailable</h2>
        <p className="text-slate-500 font-light mb-8">{error || 'The requested teaching could not be found.'}</p>
        <Link to="/teachings" className="premium-button inline-flex items-center px-8 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2">
          <ArrowLeft className="w-5 h-5 mr-2" aria-hidden="true" /> Back to Teachings
        </Link>
      </div>
    );
  }

  const imageUrl = sermon.featuredImage || 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=2070&auto=format&fit=crop';
  const displayDate = sermon.publishAt 
    ? new Date(sermon.publishAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : sermon.createdAt?.toDate().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="pt-20 bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-32 bg-primary overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(192,160,96,0.1),transparent_70%)]" />
          <div className="absolute inset-0 bg-primary/80 backdrop-blur-[2px]" />
          <img 
            src={imageUrl} 
            alt="Sermon Background" 
            className="w-full h-full object-cover opacity-20 grayscale"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link to="/teachings" className="inline-flex items-center text-secondary hover:text-white transition-colors mb-8 text-sm font-medium uppercase tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 rounded-md">
            <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" /> Back to Teachings
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center space-x-4 mb-6"
          >
            <span className="bg-secondary/20 text-secondary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] border border-secondary/30">
              {sermon.topic}
            </span>
            {sermon.status !== 'published' && sermon.status !== 'scheduled' && (
              <span className="bg-red-500/20 text-red-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] border border-red-500/30">
                Draft Preview
              </span>
            )}
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-serif text-white mb-8 leading-tight"
          >
            {sermon.seoTitle || sermon.title}
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center text-slate-300 font-light space-x-6"
          >
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-secondary" aria-hidden="true" />
              {displayDate}
            </span>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 sm:py-24 relative -mt-10 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-[3rem] p-8 sm:p-16 shadow-xl shadow-slate-200/50 border border-slate-100"
          >
            {sermon.blog ? (
              <div className="prose prose-lg sm:prose-xl prose-slate max-w-none font-light leading-relaxed prose-headings:font-serif prose-headings:text-primary prose-headings:font-normal prose-h1:text-4xl prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-p:text-slate-600 prose-p:mb-6 prose-a:text-secondary prose-a:no-underline hover:prose-a:underline prose-strong:text-primary prose-strong:font-medium prose-blockquote:border-l-secondary prose-blockquote:bg-slate-50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:text-slate-700 prose-blockquote:font-serif prose-blockquote:italic prose-ul:list-disc prose-ol:list-decimal prose-li:my-2">
                <ReactMarkdown>{sermon.blog}</ReactMarkdown>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-500 font-light text-lg">The full teaching content is currently being prepared.</p>
                <p className="text-slate-400 mt-4">Goal: {sermon.goal}</p>
              </div>
            )}

            {/* Share Section */}
            <div className="mt-20 p-8 sm:p-10 bg-[#C5A059]/[0.03] rounded-3xl border border-[#C5A059]/10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center text-slate-500 font-sans text-xs uppercase tracking-[0.2em]">
                <Share2 className="w-4 h-4 mr-3 text-[#C5A059]" aria-hidden="true" /> Share this teaching
              </div>
              <div className="flex justify-center sm:justify-end items-center gap-4 w-full sm:w-auto">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    const title = sermon.seoTitle || sermon.title;
                    const url = window.location.href;
                    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
                  }}
                  className="w-[44px] h-[44px] rounded-full bg-white border border-[#000000] shadow-[0_4px_6px_rgba(0,0,0,0.05)] flex items-center justify-center text-[#000000] hover:scale-110 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
                  title="Share on X (Twitter)"
                  aria-label="Share on X (Twitter)"
                >
                  <Twitter className="w-4 h-4" aria-hidden="true" />
                </button>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    const url = window.location.href;
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                  }}
                  className="w-[44px] h-[44px] rounded-full bg-white border border-[#1877F2] shadow-[0_4px_6px_rgba(0,0,0,0.05)] flex items-center justify-center text-[#1877F2] hover:scale-110 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
                  title="Share on Facebook"
                  aria-label="Share on Facebook"
                >
                  <Facebook className="w-4 h-4" aria-hidden="true" />
                </button>
                <WhatsAppShare title={sermon.seoTitle || sermon.title} variant="inline" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Floating WhatsApp Share Button */}
      <WhatsAppShare title={sermon.seoTitle || sermon.title} variant="floating" />
    </div>
  );
}
