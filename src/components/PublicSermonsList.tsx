import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, ArrowRight, Loader2 } from 'lucide-react';

export default function PublicSermonsList() {
  const [sermons, setSermons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'sermons'),
      where('status', 'in', ['published', 'scheduled'])
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const now = new Date();
      const sermonData = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter((sermon: any) => {
          if (sermon.status === 'published') return true;
          if (sermon.status === 'scheduled' && sermon.publishAt) {
            const publishDate = new Date(sermon.publishAt);
            return publishDate <= now;
          }
          return false;
        });
      
      // Sort in memory to avoid requiring a composite index in Firestore
      sermonData.sort((a: any, b: any) => {
        const dateA = a.publishAt ? new Date(a.publishAt).getTime() : (a.createdAt?.toMillis() || 0);
        const dateB = b.publishAt ? new Date(b.publishAt).getTime() : (b.createdAt?.toMillis() || 0);
        return dateB - dateA;
      });
      
      setSermons(sermonData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching public sermons:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-secondary" />
      </div>
    );
  }

  if (sermons.length === 0) {
    return null; // Or show a fallback message if desired
  }

  return (
    <section className="py-20 sm:py-24 bg-white relative">
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-slate-50 to-transparent opacity-50" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-secondary font-bold tracking-[0.3em] uppercase text-[10px] sm:text-xs mb-4 block"
          >
            Latest Messages
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-serif text-primary"
          >
            Recent <span className="gold-gradient-text italic">Teachings</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sermons.map((sermon, idx) => {
            const displayDate = sermon.publishAt 
              ? new Date(sermon.publishAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
              : sermon.createdAt?.toDate().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
            
            const imageUrl = sermon.featuredImage || 'https://images.unsplash.com/photo-1438283173091-5dbf5c5a3206?q=80&w=800&auto=format&fit=crop';

            return (
              <motion.div
                key={sermon.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-premium transition-all duration-500 group flex flex-col h-full overflow-hidden"
              >
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={imageUrl} 
                    alt={sermon.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center text-xs text-white/90 font-medium uppercase tracking-wider">
                    <Calendar className="w-4 h-4 mr-2 text-secondary" />
                    {displayDate}
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-grow">
                  <div className="mb-4">
                    <span className="text-[10px] bg-slate-50 px-3 py-1.5 rounded-lg text-slate-500 font-bold uppercase tracking-wider border border-slate-100">
                      {sermon.topic}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-serif text-primary mb-4 group-hover:text-secondary transition-colors duration-300 line-clamp-2">
                    {sermon.title}
                  </h3>
                  
                  <p className="text-slate-500 font-light leading-relaxed mb-8 line-clamp-3 flex-grow">
                    {sermon.excerpt || (sermon.blog ? sermon.blog.substring(0, 150).replace(/[#*]/g, '') + '...' : sermon.goal)}
                  </p>
                  
                  <Link 
                    to={`/teachings/${sermon.id}`}
                    className="inline-flex items-center text-primary font-medium group-hover:text-secondary transition-colors mt-auto"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Read Teaching
                    <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
