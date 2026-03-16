import { motion } from 'motion/react';
import { ShoppingCart, Droplets, GraduationCap, ShieldCheck, Users, Church, Globe, ArrowRight } from 'lucide-react';

export default function Mission() {
  const expressions = [
    {
      title: 'The Redeemed Assemblies',
      icon: Church,
      desc: 'My primary apostolic vehicle for global revival, church planting, and the Ministry of Reconciliation.',
      details: ['Multi-racial Model', 'Cross-cultural Revival', 'Global Apostolic Network']
    },
    {
      title: 'TRASS Humanitarian',
      icon: ShoppingCart,
      desc: 'Executing my mandate to relieve severe need, financial hardship, and emotional distress through systemic intervention.',
      details: ['Industrial Foodbank', 'Breakfast Service', 'Hygiene Distribution']
    },
    {
      title: 'Water & Infrastructure',
      icon: Droplets,
      desc: 'My commitment to hard-infrastructure projects that combat waterborne diseases and improve local viability.',
      details: ['Benue Water Project', 'Onwubiko Mission', 'Global Philanthropy']
    },
    {
      title: 'Economic Empowerment',
      icon: GraduationCap,
      desc: 'Training and equipping the marginalized to secure permanent, sustainable employment and digital literacy.',
      details: ['CV Clinics', 'IT Computer Labs', 'Welfare Advocacy']
    },
    {
      title: 'Holistic Care Groups',
      icon: Users,
      desc: 'Proactive community hubs designed to identify and support vulnerable residents with dignity.',
      details: ['Digital Support Hubs', 'Weekly Study Sessions', 'Targeted Counseling']
    },
    {
      title: 'Civic Triage',
      icon: ShieldCheck,
      desc: 'Providing safe havens and emergency relief for the homeless and those in immediate crisis.',
      details: ['Temporary Shelters', 'Emergency Food Parcels', 'Debt Management Advice']
    }
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center bg-primary pt-32 pb-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(192,160,96,0.15),transparent_70%)] z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-transparent to-primary/95 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" 
            alt="Global Mission" 
            className="w-full h-full object-cover opacity-30 grayscale contrast-125"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-4xl"
          >
            <div className="flex items-center space-x-4 mb-8">
              <div className="h-px w-12 bg-secondary/60"></div>
              <span className="text-secondary font-medium tracking-[0.5em] uppercase text-[10px] sm:text-xs">Manifesting the Vision</span>
            </div>
            
            <h1 className="flex flex-col font-serif text-white mb-10 uppercase tracking-tighter leading-[0.85]">
              <span className="text-4xl sm:text-6xl md:text-7xl text-secondary/80 mb-4 tracking-widest">Expressions of</span>
              <span className="text-6xl sm:text-8xl md:text-[9rem] gold-gradient-text italic font-normal">My Calling</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed border-l-2 border-secondary/20 pl-8 italic font-light">
              My mission refuses to separate spiritual salvation from physical welfare. These institutions are the tangible manifestations of that mandate.
            </p>
          </motion.div>
        </div>

        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent z-30"></div>
      </section>

      {/* Expressions Grid */}
      <section className="py-24 sm:py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
            {expressions.map((exp, idx) => (
              <motion.div 
                key={exp.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.8 }}
                whileHover={{ y: -10 }}
                className="group p-10 sm:p-12 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-premium transition-all duration-700"
              >
                <div className="mb-10 inline-flex p-6 bg-white rounded-2xl text-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-500 shadow-sm border border-slate-100">
                  <exp.icon className="h-8 w-8" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif text-primary mb-6 group-hover:text-secondary transition-colors duration-300">{exp.title}</h3>
                <p className="text-slate-600 mb-10 leading-relaxed text-base sm:text-lg font-light">
                  {exp.desc}
                </p>
                <div className="space-y-4">
                  <div className="h-px bg-slate-200 w-full mb-8" />
                  <ul className="space-y-4">
                    {exp.details.map((detail) => (
                      <li key={detail} className="flex items-center text-sm text-slate-500 font-medium">
                        <ArrowRight className="h-3 w-3 text-secondary mr-4 opacity-50" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Narrative Bridge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border-t border-slate-100 pt-16 mt-20 text-center max-w-3xl mx-auto"
          >
            <p className="text-lg sm:text-xl text-slate-500 leading-relaxed font-light italic">
              While these local initiatives form the bedrock of our community impact, the apostolic mandate inherently demands a global perspective.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Global Philanthropy */}
      <section className="py-24 sm:py-32 bg-primary text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(#c0a060_1px,transparent_1px)] [background-size:40px_40px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white/5 rounded-[3rem] sm:rounded-[4rem] p-10 sm:p-20 lg:p-28 border border-white/10 backdrop-blur-sm shadow-2xl overflow-hidden relative">
            {/* Decorative Glow */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary/10 rounded-full blur-[100px]" />
            
            <div className="flex flex-col lg:flex-row items-center gap-20 lg:gap-32 relative z-10">
              <div className="lg:w-1/2">
                <motion.span 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="text-secondary font-bold tracking-[0.4em] uppercase text-[10px] sm:text-xs mb-8 block"
                >
                  Global Philanthropy
                </motion.span>
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="text-4xl sm:text-6xl font-serif mb-10 leading-[1.1]"
                >
                  Transnational <br />
                  <span className="gold-gradient-text italic font-normal">Impact</span>
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-lg sm:text-xl text-slate-400 mb-14 leading-relaxed font-light"
                >
                  My mandate extends far beyond the borders of the United Kingdom. Through strategic hard-infrastructure and humanitarian projects, I deploy capital to execute life-saving missions in the global south.
                </motion.p>
                
                <div className="space-y-12">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-start space-x-8 group"
                  >
                    <div className="bg-secondary/10 p-5 rounded-2xl text-secondary group-hover:bg-secondary group-hover:text-primary transition-all duration-500 border border-secondary/20 shadow-lg">
                      <Droplets className="h-8 w-8" />
                    </div>
                    <div>
                      <h4 className="text-xl sm:text-2xl font-serif mb-3 text-white group-hover:text-secondary transition-colors">Benue Water Project</h4>
                      <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-light">Providing clean, accessible drinking water to remote communities in Nigeria, combating waterborne diseases at the source.</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-start space-x-8 group"
                  >
                    <div className="bg-secondary/10 p-5 rounded-2xl text-secondary group-hover:bg-secondary group-hover:text-primary transition-all duration-500 border border-secondary/20 shadow-lg">
                      <Globe className="h-8 w-8" />
                    </div>
                    <div>
                      <h4 className="text-xl sm:text-2xl font-serif mb-3 text-white group-hover:text-secondary transition-colors">Onwubiko Mission</h4>
                      <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-light">Expanding my apostolic footprint in Ivory Coast and Benin Republic, establishing sustainable community support networks.</p>
                    </div>
                  </motion.div>
                </div>
              </div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="lg:w-1/2 w-full"
              >
                <div className="relative group">
                  {/* Decorative Frames */}
                  <div className="absolute -inset-4 border border-secondary/20 rounded-[3rem] pointer-events-none group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute -inset-8 border border-secondary/10 rounded-[4rem] pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
                  
                  <div className="aspect-[4/5] sm:aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                    <img 
                      src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop" 
                      alt="Global Mission" 
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-60" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
