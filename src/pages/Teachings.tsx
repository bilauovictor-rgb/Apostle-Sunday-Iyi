import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import PublicSermonsList from '../components/PublicSermonsList';

export default function Teachings() {
  const [heroLoaded, setHeroLoaded] = useState(false);
  return (
    <div className="pt-20 bg-primary">
      {/* Hero Section */}
      <section className="relative min-h-[65vh] flex items-center justify-center overflow-hidden pt-32 pb-20 bg-primary">
        {/* Background Elements */}
        <div className={`absolute inset-0 z-0 ${!heroLoaded ? 'shimmer' : ''}`}>
          {/* Lightweight Gradient Placeholder */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-[#0a192f] to-primary opacity-100"></div>

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(192,160,96,0.1),transparent_70%)]" />
          
          {heroLoaded && (
            <motion.div 
              animate={{ 
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]" 
            />
          )}
          
          <div className="absolute inset-0 bg-primary/60 backdrop-blur-[2px]" />
          
          <motion.img 
            initial={{ opacity: 0 }}
            animate={{ opacity: heroLoaded ? 0.2 : 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            onLoad={() => setHeroLoaded(true)}
            src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop" 
            alt="Teachings Background" 
            className="w-full h-full object-cover grayscale"
            referrerPolicy="no-referrer"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-secondary font-bold tracking-[0.3em] uppercase text-[10px] sm:text-xs mb-6 block"
          >
            The Message
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-serif text-white mb-8 uppercase tracking-tighter leading-[0.9]"
          >
            Truth & <br />
            <span className="gold-gradient-text italic">Revelation</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light"
          >
            Deep scriptural insights and prophetic revelations designed to activate your calling and manifest the reality of heaven.
          </motion.p>
        </div>
      </section>

      {/* Public Teachings List */}
      <PublicSermonsList />

      {/* Admin Access Portal Section */}
      <section className="py-24 bg-primary border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(192,160,96,0.05),transparent_70%)]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="max-w-3xl mx-auto p-16 rounded-[4rem] bg-white/[0.02] border border-white/10 backdrop-blur-md">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-secondary font-bold tracking-[0.4em] uppercase text-[10px] mb-6 block"
            >
              Internal Access
            </motion.span>
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl font-serif text-white mb-8"
            >
              Ministry <span className="gold-gradient-text italic">Management</span>
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 font-light mb-12 text-lg leading-relaxed"
            >
              Authorized personnel can access the sermon management dashboard and AI content generation tools here.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Link 
                to="/admin" 
                className="premium-button inline-flex items-center px-10 py-5"
              >
                Open Admin Dashboard
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
