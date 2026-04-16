import { motion } from 'motion/react';
import { StatCounter } from './StatCounter';
import { Heart, Globe, BookOpen, Award } from 'lucide-react';

const stats = [
  { label: 'Global Impact', value: 1.2, suffix: 'M+', decimals: 1, icon: Heart },
  { label: 'Nations Reached', value: 15, suffix: '+', decimals: 0, icon: Globe },
  { label: 'Leaders Trained', value: 5, suffix: 'k+', decimals: 0, icon: BookOpen },
  { label: 'Years of Ministry', value: 30, suffix: '+', decimals: 0, icon: Award },
];

export default function ConvictionsSection() {
  return (
    <section className="py-20 sm:py-28 bg-white relative overflow-visible">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Image & Quote Card Container */}
          <div className="relative order-1 lg:order-1 flex flex-col items-center lg:items-start">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="relative w-full max-w-md lg:max-w-none"
            >
              <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-premium grayscale hover:grayscale-0 transition-all duration-1000 shimmer">
                <img 
                  src="https://i.ibb.co/HRNgSzR/papa-mama-iyi-3.jpg" 
                  alt="Apostle Sunday Iyi and Pastor Gladys Iyi" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  onLoad={(e) => (e.currentTarget.parentElement?.classList.remove('shimmer'))}
                />
              </div>
              
              {/* Quote Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative lg:absolute mt-6 lg:mt-0 lg:-bottom-10 lg:-right-10 bg-primary p-8 sm:p-10 lg:p-14 rounded-[2.5rem] shadow-2xl max-w-[90%] sm:max-w-xs z-20"
              >
                <span className="text-secondary text-4xl sm:text-5xl font-serif absolute top-4 left-4 opacity-20">"</span>
                <p className="text-white font-serif italic text-xl sm:text-2xl leading-tight relative z-10">
                  The church owes the world a definitive encounter with the divine.
                </p>
              </motion.div>
            </motion.div>
          </div>

          {/* Content Block */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-2 lg:order-2 mt-8 lg:mt-0"
          >
            <div className="inline-flex items-center space-x-4 mb-6">
              <span className="text-secondary font-bold tracking-[0.3em] uppercase text-[10px] sm:text-xs">Restoring the Original Power & Purity</span>
              <div className="h-px w-10 bg-secondary/40"></div>
            </div>
            <h2 className="text-4xl sm:text-6xl font-serif text-primary mb-10 leading-[1.1]">
              Core Apostolic <span className="text-secondary italic">Convictions</span>
            </h2>
            <div className="space-y-6 text-lg sm:text-xl text-slate-600 leading-relaxed font-light mb-12">
              <p>
                At the center of Apostle Sunday Iyi’s ministry is a commitment to restoring the original power and purity of the gospel.
              </p>
              <p>
                His theological worldview affirms that healing, miracles, and supernatural encounters remain essential expressions of authentic Christian experience.
              </p>
              <p>
                Through his teaching ministry, believers are equipped to live as agents of reconciliation, transforming both individuals and institutions.
              </p>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-12">
              {stats.map((stat, idx) => (
                <motion.div 
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 + (idx * 0.1) }}
                  className="bg-slate-50/50 p-6 sm:p-8 rounded-3xl border border-slate-100 group hover:border-secondary/30 hover:bg-white hover:shadow-xl transition-all duration-500"
                >
                  <div className="text-3xl sm:text-5xl font-serif text-primary mb-3 group-hover:text-secondary transition-colors">
                    <StatCounter value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
