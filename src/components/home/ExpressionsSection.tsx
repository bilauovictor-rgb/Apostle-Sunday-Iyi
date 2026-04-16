import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Users, Heart, BookOpen, ArrowRight } from 'lucide-react';

export default function ExpressionsSection() {
  return (
    <section className="py-20 sm:py-24 bg-primary text-white relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#c0a060_1px,transparent_1px)] [background-size:40px_40px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16 relative z-10">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-secondary font-bold tracking-[0.4em] uppercase text-[10px] sm:text-xs mb-6 block"
        >
          Structured Initiatives
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl sm:text-6xl font-serif text-white mb-6"
        >
          Manifesting the <span className="gold-gradient-text italic">Vision</span>
        </motion.h2>
        <motion.div 
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          className="h-px w-24 bg-secondary mx-auto mb-8 origin-center"
        ></motion.div>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-slate-400 max-w-2xl mx-auto text-lg font-light leading-relaxed"
        >
          The apostolic mandate is not merely a spiritual concept; it is expressed through structured, tangible initiatives designed to bring holistic transformation to communities worldwide.
        </motion.p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 relative z-10">
        {[
          { title: 'The Redeemed Assemblies', desc: 'My primary apostolic platform for spiritual revival and global church planting.', icon: Users },
          { title: 'TRASS Humanitarian', desc: 'The vehicle through which I execute massive-scale poverty alleviation and civic intervention.', icon: Heart },
          { title: 'Global School of Ministry', desc: 'My academic mandate to equip the next generation of five-fold and marketplace leaders.', icon: BookOpen },
        ].map((pillar, idx) => (
          <motion.div 
            key={pillar.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white/5 p-10 sm:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl hover:bg-white/10 transition-all duration-500 group hover:-translate-y-3 hover:shadow-secondary/10"
          >
            <div className="w-16 h-16 bg-secondary/10 border border-secondary/20 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-secondary transition-all duration-500 group-hover:scale-110 group-hover:shadow-glow">
              <pillar.icon className="h-7 w-7 text-secondary group-hover:text-primary transition-colors duration-500" aria-hidden="true" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif text-white mb-6 group-hover:text-secondary transition-colors duration-300 tracking-tight">{pillar.title}</h3>
            <p className="text-slate-400 leading-relaxed mb-12 text-base font-light group-hover:text-slate-300 transition-colors">{pillar.desc}</p>
            <Link to="/mission" className="text-secondary font-bold flex items-center group/link text-[10px] tracking-[0.3em] uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded-sm">
              Explore Expression 
              <ArrowRight className="ml-4 h-4 w-4 group-hover/link:translate-x-3 transition-transform" aria-hidden="true" />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
