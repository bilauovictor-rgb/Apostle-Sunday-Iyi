import { motion } from 'motion/react';
import { Play, User, ArrowRight, Quote } from 'lucide-react';

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
            className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light"
          >
            Deep scriptural insights and prophetic revelations designed to activate your calling and manifest the reality of heaven.
          </motion.p>
        </div>
      </section>

      <section className="py-20 sm:py-24 bg-white relative">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary to-transparent opacity-5" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-24">
            {/* Main Featured Sermon */}
            <div className="lg:col-span-2">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-slate-50 rounded-[3rem] sm:rounded-[4rem] p-8 sm:p-16 lg:p-20 border border-slate-100 shadow-sm hover:shadow-premium transition-all duration-500 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-[80px] -mr-32 -mt-32 transition-all duration-700 group-hover:bg-secondary/10" />
                
                <div className="relative z-10">
                  <div className="flex items-center space-x-6 mb-10">
                    <span className="bg-secondary text-primary px-6 py-2 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em]">Featured Manifesto</span>
                  </div>
                  <h2 className="text-4xl sm:text-6xl font-serif text-primary mb-10 leading-[1.1]">
                    Must I Go, And <br />
                    <span className="gold-gradient-text italic">Empty-Handed?</span>
                  </h2>
                  
                  <div className="prose prose-lg sm:prose-xl prose-slate max-w-none text-slate-600 leading-relaxed space-y-10">
                    <p className="text-lg sm:text-xl font-light">
                      In this defining message, I redefine the purpose of the Pentecostal baptism. The primary reason we receive supernatural power is not for self-aggrandizement, but to be empowered as ordinary witnesses in mundane settings.
                    </p>
                    
                    <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm">
                      <h4 className="text-secondary font-serif font-bold text-2xl sm:text-3xl mb-6 italic">The "Jerusalem" Mandate</h4>
                      <p className="text-base sm:text-lg font-light leading-relaxed">
                        I challenge the hypocrisy of modern believers who invest heavily in material needs while neglecting the eternal status of those closest to them. Your mission starts in your own "Jerusalem"—your home, your family, and your workplace.
                      </p>
                    </div>

                    <div className="relative py-8">
                      <Quote className="absolute top-0 left-0 h-12 w-12 text-secondary/20 -ml-6 -mt-4" />
                      <blockquote className="border-l-4 border-secondary pl-10 italic text-2xl sm:text-4xl text-primary font-serif leading-tight">
                        "Every mundane interaction is a divinely orchestrated opportunity for reconciliation that must not be squandered."
                      </blockquote>
                    </div>

                    <p className="text-lg sm:text-xl font-light">
                      I urge you to drop your contemporary "water pots"—your careers, your financial anxieties, your social standing—and recognize that the fields are white already to harvest.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar Sermons */}
            <div className="space-y-12">
              <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-3xl font-serif text-primary mb-10"
              >
                Recent Revelations
              </motion.h3>
              
              <div className="space-y-8">
                {sermons.slice(1).map((sermon, idx) => (
                  <motion.div 
                    key={sermon.title}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ x: 5 }}
                    className="bg-white border border-slate-100 p-10 rounded-[2.5rem] shadow-sm hover:shadow-premium transition-all duration-500 group relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="flex items-center text-[10px] text-slate-400 mb-6 font-bold uppercase tracking-[0.2em]">
                      <User className="h-4 w-4 mr-2 text-secondary" /> {sermon.speaker}
                    </div>
                    <h4 className="text-2xl font-serif text-primary mb-4 group-hover:text-secondary transition-colors duration-300">{sermon.title}</h4>
                    <p className="text-slate-500 mb-8 leading-relaxed font-light text-sm sm:text-base">{sermon.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {sermon.tags.map(tag => (
                        <span key={tag} className="text-[9px] bg-slate-50 px-3 py-1.5 rounded-lg text-slate-500 font-bold uppercase tracking-wider border border-slate-100">{tag}</span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-primary p-12 rounded-[3rem] text-white shadow-2xl shadow-primary/30 relative overflow-hidden group"
              >
                <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-secondary/10 rounded-full blur-[60px] group-hover:bg-secondary/20 transition-all duration-700" />
                
                <h4 className="font-serif text-3xl mb-6">School of the Word</h4>
                <p className="text-slate-400 mb-10 leading-relaxed font-light">Join Pastor Gladys Iyi for intensive scriptural teaching and motivational broadcasts that reach international audiences.</p>
                <button className="premium-button w-full py-5 flex items-center justify-center group">
                  <Play className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" /> Watch Broadcast
                </button>
              </motion.div>
            </div>
          </div>

          {/* Narrative Bridge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border-t border-slate-100 pt-16 mt-20 text-center max-w-3xl mx-auto"
          >
            <p className="text-lg sm:text-xl text-slate-500 leading-relaxed font-light italic">
              These teachings are not meant to be confined to digital archives. They are the catalyst for our active deployment across the nations.
            </p>
          </motion.div>
        </div>
      </section>

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
