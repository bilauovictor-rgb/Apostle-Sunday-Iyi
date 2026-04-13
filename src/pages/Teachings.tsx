import { motion } from 'motion/react';
import { Play, User, ArrowRight, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import PublicSermonsList from '../components/PublicSermonsList';

export default function Teachings() {
  const sermons = [
    {
      title: 'Must I Go, And Empty-Handed?',
      speaker: 'Apostle Sunday Iyi',
      date: 'Featured Manifesto',
      desc: 'My comprehensive manifesto on personal evangelistic responsibility and the "Jerusalem" mandate.',
      tags: ['Evangelism', 'Responsibility', 'Mission']
    },
    {
      title: "Don't Quit",
      speaker: 'Pastor Gladys Iyi',
      date: 'School of the Word',
      desc: 'Motivational and spiritually grounding messages delivered through our international broadcasts.',
      tags: ['Motivation', 'Faith', 'Persistence']
    },
    {
      title: 'The Ministry of Reconciliation',
      speaker: 'Apostle Sunday Iyi',
      date: 'Theological Series',
      desc: 'Demystifying Pentecost and focusing on the true biblical mandate of reconciling man to God.',
      tags: ['Theology', 'Reconciliation', 'Pentecost']
    }
  ];

  return (
    <div className="pt-20 bg-primary">
      {/* Hero Section */}
      <section className="relative min-h-[65vh] flex items-center justify-center overflow-hidden pt-32 pb-20">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(192,160,96,0.1),transparent_70%)]" />
          <motion.div 
            animate={{ 
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]" 
          />
          <div className="absolute inset-0 bg-primary/60 backdrop-blur-[2px]" />
          <img 
            src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop" 
            alt="Teachings Background" 
            className="w-full h-full object-cover opacity-20 grayscale"
            referrerPolicy="no-referrer"
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
            className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light mb-10"
          >
            Deep scriptural insights and prophetic revelations designed to activate your calling and manifest the reality of heaven.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center"
          >
            <Link 
              to="/admin" 
              className="premium-button px-8 py-4 flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
            >
              Open Admin Dashboard
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Public Teachings List */}
      <PublicSermonsList />

      {/* Global Outreach Tour */}
      <section className="py-20 sm:py-24 bg-slate-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-teachings" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-teachings)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20 sm:mb-24">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-secondary font-bold tracking-[0.3em] uppercase text-[10px] sm:text-xs mb-6 block"
            >
              Apostolic Deployment
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-7xl font-serif text-primary mb-8"
            >
              Global <span className="gold-gradient-text italic">Teaching Tour</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-500 max-w-2xl mx-auto text-lg sm:text-xl font-light leading-relaxed"
            >
              Equipping regional religious leaders and mobilizing the body of Christ across the nations.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-8">
            {['Enugu', 'Ebonyi', 'Anambra', 'Benin', 'Akure', 'Ogun', 'Ekiti', 'Delta', 'Ore', 'Sabo', 'Akoko', 'Shagamu'].map((city, idx) => (
              <motion.div 
                key={city}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -5, borderColor: '#c0a060' }}
                className="bg-white p-6 sm:p-8 rounded-3xl text-center border border-slate-100 font-serif text-lg sm:text-xl text-primary shadow-sm hover:shadow-premium transition-all duration-300 cursor-default group"
              >
                <span className="group-hover:text-secondary transition-colors duration-300">{city}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
