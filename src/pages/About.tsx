import { useState } from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';

export default function About() {
  const [heroLoaded, setHeroLoaded] = useState(false);
  return (
    <div className="overflow-hidden">
      <Helmet>
        <title>About Apostle Sunday Iyi | Fifth-Generation Global Minister</title>
        <meta name="description" content="Discover the spiritual pedigree and apostolic calling of Apostle Sunday Iyi. A fifth-generation teacher and visionary leader of the Global School of Ministry." />
        <meta name="keywords" content="Sunday Iyi biography, Sunday Iyi heritage, Gladys Iyi, fifth generation minister, apostolic leader, GSOM, ministry founder" />
        <link rel="canonical" href="https://apostlesundayiyi.org/about" />
      </Helmet>
      {/* Page Header */}
      <section className="relative min-h-[65vh] flex items-center bg-primary text-white overflow-hidden pt-32 pb-20">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,#0a192f_0%,#020c1b_100%)]"></div>
        
        {/* Subtle Cross Light Texture */}
        <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center opacity-[0.04]">
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute w-[2px] h-[70%] bg-gradient-to-b from-transparent via-secondary/30 to-transparent blur-[3px]"></div>
            <div className="absolute w-[50%] h-[2px] bg-gradient-to-r from-transparent via-secondary/30 to-transparent blur-[3px] -translate-y-20"></div>
          </div>
        </div>

        {/* Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-secondary/[0.03] rounded-full blur-[150px] pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-4xl text-center lg:text-left"
          >
            <div className="flex items-center justify-center lg:justify-start space-x-4 mb-8">
              <div className="h-px w-12 bg-secondary/50"></div>
              <span className="text-secondary font-medium tracking-[0.5em] uppercase text-[10px] sm:text-xs">The Man Behind the Mission</span>
            </div>
            
            <h1 className="flex flex-col font-serif mb-10 uppercase tracking-tighter leading-[0.85]">
              <span className="text-3xl sm:text-5xl md:text-6xl text-secondary/80 mb-2 tracking-widest">Apostle</span>
              <span className="text-6xl sm:text-8xl md:text-[9rem]">Sunday</span>
              <span className="gold-gradient-text italic font-normal text-5xl sm:text-7xl md:text-[7.5rem] sm:ml-4 mt-2">Iyi</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed border-l-2 lg:border-l border-secondary/20 pl-8 italic font-light">
              A fifth-generation minister and visionary leader dedicated to manifesting the reality of heaven on earth through power, truth, and systemic compassion.
            </p>
          </motion.div>
        </div>

        {/* Bottom Fade for Smooth Transition */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Biography */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            {/* Left Column: Image, Quote (Mobile), Stats */}
            <div className="lg:sticky lg:top-32 space-y-12">
              <div className="relative group">
                {/* Decorative Frame */}
                <div className="absolute -inset-4 border border-secondary/10 rounded-[3rem] -z-10 transition-transform group-hover:scale-105 duration-700"></div>
                
                <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-premium grayscale hover:grayscale-0 transition-all duration-1000 shimmer">
                  <img 
                    src="https://i.ibb.co/PzmYRgM6/Apostle-4.jpg" 
                    alt="Apostle Sunday Iyi" 
                    className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000"
                    referrerPolicy="no-referrer"
                    onLoad={(e) => (e.currentTarget.parentElement?.classList.remove('shimmer'))}
                  />
                </div>
              </div>

              {/* Quote Card - Mobile Only */}
              <div className="lg:hidden relative py-8 px-6 rounded-3xl bg-slate-50 overflow-hidden group border border-slate-100 shadow-sm">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-secondary"></div>
                <div className="relative z-10">
                  <span className="text-secondary text-5xl font-serif absolute -top-4 -left-2 opacity-20">"</span>
                  <p className="text-lg font-serif text-primary italic leading-relaxed">
                    Apostle Sunday Iyi believes the contemporary church fundamentally owes the secular world a definitive, undeniable encounter with the divine.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-8 sm:gap-12">
                <div className="flex flex-col space-y-2">
                  <div className="text-4xl sm:text-5xl font-serif text-primary">5th</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-[0.3em] font-bold leading-tight">Generation <br />Minister</div>
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="text-4xl sm:text-5xl font-serif text-primary">30+</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-[0.3em] font-bold leading-tight">Years of <br />Leadership</div>
                </div>
              </div>
            </div>

            {/* Right Column: Text Content */}
            <div className="space-y-12 text-lg sm:text-xl text-slate-600 leading-relaxed font-light mt-10 lg:mt-0">
              <div className="space-y-6">
                <div className="inline-flex items-center space-x-4">
                  <span className="text-secondary font-bold tracking-[0.3em] uppercase text-[10px] sm:text-xs">The Heritage</span>
                  <div className="h-px w-10 bg-secondary/40"></div>
                </div>
                <h2 className="text-4xl sm:text-6xl font-serif text-primary leading-[1.1]">
                  A Legacy of <span className="text-secondary italic">Power</span>
                </h2>
              </div>

              <div className="space-y-6">
                <p>
                  Apostle Sunday Iyi’s spiritual pedigree is characterized by a deep, multi-generational entrenchment in Christian orthodoxy and Pentecostal tradition. As a fifth-generation teacher, he possesses a rich heritage in the theology and experiential reality of the Holy Spirit.
                </p>
                <p>
                  This ancestral lineage provides the foundational bedrock for his current pastoral methodology, effectively rooting his modern institutional practices in a long continuum of historical faith.
                </p>
              </div>

              {/* Quote Card - Desktop Only */}
              <div className="hidden lg:block relative py-12 px-10 rounded-[2.5rem] bg-slate-50 overflow-hidden group shadow-sm border border-slate-100 my-10">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-secondary"></div>
                <div className="relative z-10">
                  <span className="text-secondary text-6xl font-serif absolute -top-6 -left-4 opacity-20">"</span>
                  <p className="text-xl font-serif text-primary italic leading-relaxed">
                    Apostle Sunday Iyi believes the contemporary church fundamentally owes the secular world a definitive, undeniable encounter with the divine.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <p>
                  His theological worldview crystallizes around a profound, literalized understanding of the biblical phrase "on earth as it is in heaven". He teaches that healing, miracles, and profound spiritual encounters should be viewed as normalized components of the standard Christian experience.
                </p>
                <p>
                  At the absolute core of his spiritual philosophy is a defining mantra: <span className="text-primary font-bold italic">"God's plan is his mission"</span>. He interprets this divine mission specifically through the lens of the "Ministry of Reconciliation," democratizing the work of the church to mobilize every believer.
                </p>
              </div>
              
              {/* Narrative Bridge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="border-t border-slate-100 pt-8 mt-12"
              >
                <p className="text-base text-slate-500 leading-relaxed font-light italic">
                  This individual calling, however, is not carried alone. It is powerfully amplified through a synergistic partnership that addresses the whole person.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Co-Leadership */}
      <section className="py-20 sm:py-24 bg-primary text-white relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/2 right-0 w-[800px] h-[800px] bg-secondary/[0.05] rounded-full blur-[150px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="order-2 lg:order-1 space-y-10">
              <div className="space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center justify-center lg:justify-start space-x-4 mb-2">
                  <div className="h-px w-10 bg-secondary/60 hidden lg:block"></div>
                  <span className="text-secondary font-medium tracking-[0.5em] uppercase text-[10px] sm:text-xs block">Spiritual Synergy</span>
                </div>
                <h2 className="text-4xl sm:text-6xl font-serif leading-[1.1]">With Pastor <br /><span className="gold-gradient-text italic font-normal">Gladys Iyi</span></h2>
              </div>
              
              <div className="space-y-6 text-lg sm:text-xl text-slate-400 leading-relaxed text-center lg:text-left font-light">
                <p>
                  The life and ministry of Apostle Sunday Iyi are inextricably linked to the co-leadership of Pastor Gladys Iyi. As a Senior Leader, author, and chief intercessor, her ministry giftings provide the necessary counterbalance to the ministry’s expansive operations.
                </p>
                <p>
                  Her focus on joyful intercession and holistic human welfare ensures that the mission addresses the tripartite nature of man: body, soul, and spirit.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-all duration-500 shadow-2xl">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:bg-secondary transition-colors duration-500">
                    <div className="w-2 h-2 rounded-full bg-secondary group-hover:bg-white transition-colors"></div>
                  </div>
                  <h4 className="text-secondary font-serif text-xl mb-3">Intercession</h4>
                  <p className="text-sm text-slate-400 leading-relaxed font-light">Strategic insight into prayer methodologies and spiritual warfare.</p>
                </div>
                <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 backdrop-blur-sm group hover:bg-white/10 transition-all duration-500 shadow-2xl">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:bg-secondary transition-colors duration-500">
                    <div className="w-2 h-2 rounded-full bg-secondary group-hover:bg-white transition-colors"></div>
                  </div>
                  <h4 className="text-secondary font-serif text-xl mb-3">Wholeness</h4>
                  <p className="text-sm text-slate-400 leading-relaxed font-light">A deep passion for health, restoration, and physical well-being.</p>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="relative group max-w-[440px] mx-auto lg:ml-auto">
                <div className="absolute -inset-4 border border-secondary/10 rounded-[3rem] -z-10 transition-transform group-hover:scale-105 duration-700"></div>
                <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000">
                  <img 
                    src="https://i.ibb.co/1JRg4jsL/mama-iyi.jpg" 
                    alt="Pastor Gladys Iyi" 
                    className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Mandate */}
      <section className="py-20 sm:py-24 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex flex-col items-center space-y-4 mb-6">
              <span className="text-secondary font-bold tracking-[0.5em] uppercase text-[10px] sm:text-xs">Academic Leadership</span>
              <div className="h-px w-16 bg-secondary/30"></div>
            </div>
            <h2 className="text-4xl sm:text-6xl font-serif text-primary mb-8">Global School of Ministry</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg sm:text-xl leading-relaxed italic font-light">
              "Equipping believers for high-level leadership in every sphere of society, blending scriptural depth with practical influence."
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { title: 'Scriptural Accuracy', desc: 'Demanding exemplary accuracy in the knowledge and application of the Word.' },
              { title: 'Character Build', desc: 'The rigorous development of Godly character, integrity, and spiritual maturity.' },
              { title: 'Marketplace Influence', desc: 'Equipping leaders to influence secular spheres with divine truth and wisdom.' },
              { title: 'Apostolic Praxis', desc: 'Blending intellectual energy with effective, real-world apostolic practice.' },
            ].map((item) => (
              <div key={item.title} className="bg-white p-8 sm:p-10 rounded-[2rem] border border-slate-100 hover:bg-primary hover:text-white transition-all duration-700 group relative overflow-hidden shadow-sm hover:shadow-premium">
                <div className="absolute top-0 left-0 w-full h-1 bg-secondary/20 group-hover:bg-secondary transition-colors"></div>
                <h3 className="text-xl sm:text-2xl font-serif mb-4 group-hover:text-secondary transition-colors">{item.title}</h3>
                <p className="text-sm sm:text-base text-slate-500 group-hover:text-slate-300 leading-relaxed font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
