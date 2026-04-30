import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';

export default function JoinMissionSection() {
  return (
    <section className="py-24 sm:py-32 bg-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-secondary font-bold tracking-[0.4em] uppercase text-[10px] sm:text-xs mb-8 block"
        >
          Take Action
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl sm:text-7xl font-serif text-primary mb-10 tracking-tighter"
        >
          Join the <span className="gold-gradient-text italic">Mission</span>
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xl sm:text-2xl text-slate-600 font-light leading-relaxed mb-16 max-w-3xl mx-auto"
        >
          Partner with the ministry to manifest the reality of heaven on earth. Whether through strategic partnership or immersing yourself in the teachings, your journey of transformation starts here.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8"
        >
          <Link 
            to="/ministry-partnership" 
            className="premium-button w-full sm:w-auto flex items-center justify-center group"
          >
            Partner With the Mission <ArrowRight className="ml-4 h-5 w-5 group-hover:translate-x-2 transition-transform" aria-hidden="true" />
          </Link>
          <Link 
            to="/teachings" 
            className="w-full sm:w-auto px-12 py-5 rounded-xl border-2 border-slate-200 text-primary font-bold tracking-[0.2em] uppercase text-xs hover:border-secondary hover:text-secondary hover:bg-white transition-all duration-500 flex items-center justify-center group shadow-sm hover:shadow-xl hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
          >
            Explore Teachings <BookOpen className="ml-4 h-4 w-4 group-hover:scale-110 transition-transform" aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
