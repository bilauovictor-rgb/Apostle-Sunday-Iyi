import { motion } from 'motion/react';
import { Heart, Users, UserCheck, Globe, ArrowRight, ShieldCheck } from 'lucide-react';

export default function MinistryPartnership() {
  const impactAreas = [
    {
      icon: Heart,
      title: 'Marriage and Family Development',
      desc: 'Strengthening homes through biblical wisdom, counseling, and practical guidance for building healthy and resilient families.'
    },
    {
      icon: UserCheck,
      title: 'Women and Leadership',
      desc: 'Empowering women to discover their purpose, grow in faith, and lead with confidence in both ministry and society.'
    },
    {
      icon: Globe,
      title: 'Community Transformation',
      desc: 'Encouraging holistic transformation that addresses spiritual growth, personal development, and social responsibility.'
    }
  ];

  return (
    <div className="overflow-hidden bg-white">
      {/* SECTION 1 — HERO INTRODUCTION */}
      <section className="relative min-h-screen flex items-center bg-primary pt-32 pb-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(192,160,96,0.15),transparent_70%)] z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-transparent to-primary/95 z-10" />
          <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-secondary/[0.03] rounded-full blur-[120px] pointer-events-none"></div>
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Text Column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="max-w-2xl"
            >
              <div className="flex items-center space-x-4 mb-8">
                <div className="h-px w-12 bg-secondary/60"></div>
                <span className="text-secondary font-medium tracking-[0.5em] uppercase text-[10px] sm:text-xs">Ministry Partnership</span>
              </div>
              
              <h1 className="font-serif text-white mb-10 uppercase tracking-tighter leading-[0.85]">
                <span className="block text-4xl sm:text-6xl text-secondary/80 mb-4 tracking-widest">With Pastor</span>
                <span className="block text-6xl sm:text-8xl md:text-[8rem] gold-gradient-text italic font-normal">Gladys Iyi</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-slate-400 leading-relaxed border-l-2 border-secondary/20 pl-8 italic font-light">
                The apostolic journey is rarely walked alone. Great mandates are strengthened through divine partnership, shared conviction, and complementary grace. In the administration of his ministry, Apostle Sunday Iyi is joined by his wife, Pastor Gladys Iyi, whose wisdom, spiritual insight, and leadership provide strength and balance to the expanding scope of the ministry.
              </p>
            </motion.div>

            {/* Image Column */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative"
            >
              <div className="relative group p-4 sm:p-8">
                {/* Decorative Frames */}
                <div className="absolute inset-0 border border-secondary/10 rounded-[3rem] -z-10 transition-transform group-hover:scale-105 duration-700"></div>
                <div className="absolute -inset-4 border border-secondary/5 rounded-[3.5rem] -z-10 transition-transform group-hover:scale-110 duration-1000"></div>
                
                <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000">
                  <img 
                    src="https://i.ibb.co/1JRg4jsL/mama-iyi.jpg" 
                    alt="Pastor Gladys Iyi" 
                    className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Transition Divider */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent z-30"></div>
      </section>

      {/* SECTION 2 — SHARED CALLING */}
      <section className="py-24 sm:py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-1"
            >
              <div className="mb-8">
                <h2 className="text-4xl sm:text-6xl font-serif text-primary mb-6 leading-[1.1]">
                  A Shared <br />
                  <span className="gold-gradient-text italic font-normal">Apostolic Calling</span>
                </h2>
                <div className="h-1 w-24 bg-secondary/40 rounded-full"></div>
              </div>
              
              <div className="space-y-6 text-xl text-slate-600 leading-relaxed font-light">
                <p>
                  My life and ministry are strengthened by the leadership and spiritual depth of Pastor Gladys Iyi. As a teacher, author, and devoted intercessor, she brings wisdom, balance, and discernment that enrich the work of the ministry.
                </p>
                <p>
                  Her voice and counsel help shape a ministry that ministers not only to the spirit of man, but also to the emotional and practical realities of everyday life.
                </p>
                <p>
                  Through her commitment to prayer, mentorship, and compassionate service, she helps ensure that our mission addresses the full dimension of human transformation — spirit, soul, and body.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="order-2 lg:order-2 relative"
            >
              <div className="aspect-square rounded-[3rem] overflow-hidden shadow-premium group">
                <img 
                  src="https://i.ibb.co/BVLTgMhN/papa-mama-iyi-2.jpg" 
                  alt="Apostolic Calling" 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-primary p-8 rounded-3xl border border-white/10 shadow-2xl hidden sm:block">
                <Users className="h-10 w-10 text-secondary" aria-hidden="true" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — AREAS OF IMPACT */}
      <section className="py-24 sm:py-32 bg-white relative overflow-hidden">
        {/* Background Watermark */}
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 text-[20rem] font-serif text-slate-50/50 select-none pointer-events-none leading-none">
          Impact
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mb-20">
            <div className="inline-flex items-center space-x-4 mb-6">
              <span className="text-secondary font-bold tracking-[0.3em] uppercase text-[10px] sm:text-xs">Strategic Focus</span>
              <div className="h-px w-10 bg-secondary/40"></div>
            </div>
            <h2 className="text-4xl sm:text-6xl font-serif text-primary mb-8 leading-[1.1]">
              Expressions of <br />
              <span className="gold-gradient-text italic font-normal">Ministry Impact</span>
            </h2>
            <p className="text-xl text-slate-500 font-light leading-relaxed border-l-2 border-secondary/10 pl-8">
              Through their partnership in ministry, several initiatives and focus areas have emerged to serve the spiritual and social needs of communities, reflecting a holistic apostolic mandate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {impactAreas.map((area, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.8 }}
                className="group relative bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-700 flex flex-col h-full overflow-hidden"
              >
                {/* Decorative Corner Accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-bl-[4rem] -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-700"></div>
                
                <div className="relative z-10">
                  <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center text-secondary mb-10 shadow-xl group-hover:scale-110 transition-transform duration-500">
                    <area.icon className="h-10 w-10" aria-hidden="true" />
                  </div>
                  
                  <h3 className="text-2xl sm:text-3xl font-serif text-primary mb-6 group-hover:text-secondary transition-colors duration-500 leading-tight">
                    {area.title}
                  </h3>
                  
                  <p className="text-slate-500 font-light leading-relaxed mb-8 flex-grow text-lg">
                    {area.desc}
                  </p>
                  
                  <div className="flex items-center text-secondary font-medium tracking-widest text-xs uppercase group-hover:translate-x-2 transition-transform duration-500">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </div>
                </div>

                {/* Bottom Border Accent */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary/20 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — MINISTRY PHILOSOPHY */}
      <section className="py-24 sm:py-32 bg-white relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <div className="flex justify-center items-center space-x-4">
              <div className="h-px w-8 bg-secondary/40"></div>
              <span className="text-secondary font-bold tracking-[0.3em] uppercase text-[10px] sm:text-xs">Philosophy</span>
              <div className="h-px w-8 bg-secondary/40"></div>
            </div>
            
            <h2 className="text-4xl sm:text-6xl font-serif text-primary leading-[1.1]">
              A Partnership <br />
              <span className="gold-gradient-text italic font-normal">Rooted in Purpose</span>
            </h2>
            
            <div className="space-y-8 text-xl sm:text-2xl text-slate-600 leading-relaxed font-light italic">
              <p>
                "At the core of their ministry philosophy is the conviction that transformation must be holistic. The message of reconciliation must touch not only the spirit of man but also the structures that shape families, communities, and nations."
              </p>
            </div>
            
            <div className="space-y-6 text-lg text-slate-500 leading-relaxed font-light max-w-3xl mx-auto">
              <p>
                Together, Apostle Sunday Iyi and Pastor Gladys Iyi continue to guide believers toward lives of spiritual maturity, ethical leadership, and compassionate service.
              </p>
              <p>
                Their partnership reflects a model of unity, balance, and shared responsibility in advancing the mission of reconciliation.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 5 — INVITATION TO ENGAGE */}
      <section className="py-24 sm:py-32 bg-primary text-white relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(192,160,96,0.2),transparent_70%)]" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="w-20 h-px bg-secondary/60 mx-auto mb-12"></div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <h2 className="text-4xl sm:text-6xl font-serif mb-6">
              Join the <span className="gold-gradient-text italic font-normal">Mission</span>
            </h2>
            
            <p className="text-xl text-slate-400 font-light leading-relaxed max-w-2xl mx-auto">
              The work of reconciliation continues through teaching, mentorship, humanitarian impact, and leadership formation. Those who resonate with this mandate are invited to partner in advancing the vision.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
              <button 
                onClick={() => window.location.href = '/connect'}
                className="premium-button px-10 py-5 flex items-center group w-full sm:w-auto justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
              >
                Partner With the Mission <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </button>
              <button className="px-10 py-5 rounded-full border border-white/20 hover:bg-white/5 transition-all duration-300 w-full sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-primary">
                Explore Ministry Initiatives
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
