import { motion } from 'motion/react';
import { ArrowRight, Heart, Globe, BookOpen, Award, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const stats = [
    { label: 'Global Impact', value: '1.2M+', icon: Heart },
    { label: 'Nations Reached', value: '15+', icon: Globe },
    { label: 'Leaders Trained', value: '5k+', icon: BookOpen },
    { label: 'Years of Ministry', value: '30+', icon: Award },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[75vh] flex items-center bg-primary pt-24 pb-8 overflow-hidden">
        {/* Background Video / Fallback */}
        <div className="absolute inset-0 z-0">
          {/* Static Fallback for Mobile & Initial Load */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: 'url("https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2073&auto=format&fit=crop")',
              filter: 'brightness(0.3) contrast(1.2)'
            }}
          ></div>

          {/* Cinematic Background Video (Hidden on Mobile) */}
          <div className="absolute inset-0 hidden md:block overflow-hidden">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale contrast-125"
            >
              <source src="/videos/Hero - Background.mp4" type="video/mp4" />
            </video>
          </div>

          {/* Deep Cinematic Overlays */}
          <div className="absolute inset-0 bg-primary/70 z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-transparent to-primary/95 z-10"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(2,12,27,0.6)_100%)] z-10"></div>
          
          {/* Subtle Texture Overlay */}
          <div className="absolute inset-0 opacity-[0.03] z-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        </div>
        
        {/* Animated Light Beams */}
        <div className="absolute inset-0 z-20 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-secondary to-transparent blur-sm"></div>
          <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-secondary/50 to-transparent blur-sm"></div>
        </div>

        {/* Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-secondary/[0.02] rounded-full blur-[150px] pointer-events-none z-20"></div>

        <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Side: Content */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-center lg:text-left lg:col-span-7"
            >
              <div className="inline-flex items-center space-x-4 mb-6">
                <div className="h-px w-10 bg-secondary/60"></div>
                <span className="text-secondary font-medium tracking-[0.5em] uppercase text-[10px] sm:text-xs">The Apostolic Mandate</span>
              </div>
              
              <h1 className="flex flex-col font-serif text-white leading-[0.85] mb-8 uppercase tracking-tighter">
                <span className="text-xl sm:text-2xl tracking-[0.4em] text-secondary/80 mb-4 font-serif italic">Apostle</span>
                <span className="text-6xl sm:text-8xl md:text-[9rem]">Sunday</span>
                <span className="gold-gradient-text italic font-normal text-5xl sm:text-7xl md:text-[7.5rem] sm:ml-4 -mt-4">Iyi</span>
              </h1>
              
              <p className="text-base sm:text-lg text-slate-400 mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0 border-l-2 border-secondary/20 pl-8 italic">
                "Reconciling humanity back to God and manifesting the reality of heaven on earth through power, truth, and systemic compassion."
              </p>
              
              <div className="flex flex-wrap justify-center lg:justify-start gap-6">
                <Link 
                  to="/contact" 
                  className="premium-button bg-secondary text-primary px-10 py-5 rounded-full font-bold hover:bg-white flex items-center group text-sm sm:text-base"
                >
                  Partner With Me
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/about" 
                  className="premium-button border border-secondary/30 text-secondary px-10 py-5 rounded-full font-bold hover:bg-secondary/10 transition-all backdrop-blur-sm text-sm sm:text-base"
                >
                  The Journey
                </Link>
              </div>
            </motion.div>

            {/* Right Side: Portrait Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative flex justify-center lg:justify-end mt-8 lg:mt-0 lg:col-span-5"
            >
              <div className="relative w-full max-w-[400px] aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl group">
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent opacity-80"></div>
                <img 
                  src="https://i.ibb.co/PzmYRgM6/Apostle-4.jpg" 
                  alt="Apostle Sunday Iyi" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                  referrerPolicy="no-referrer"
                />
                
                {/* Decorative Frame */}
                <div className="absolute inset-6 border border-white/10 rounded-[2.5rem] pointer-events-none z-20"></div>
                
                {/* Centered Floating Label */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[85%] z-30">
                  <div className="glass-card py-5 px-6 rounded-2xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.5)] bg-primary/60 backdrop-blur-xl">
                    <p className="text-white font-serif italic text-lg sm:text-xl leading-snug text-center">
                      "Manifesting the reality of heaven."
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Transition Divider */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white via-white/40 to-transparent z-40"></div>
      </section>

      {/* Core Apostolic Convictions */}
      <section className="py-20 sm:py-28 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-premium grayscale hover:grayscale-0 transition-all duration-1000">
                <img 
                  src="https://i.ibb.co/PzmYRgM6/Apostle-4.jpg" 
                  alt="Apostle Sunday Iyi" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 bg-primary p-10 sm:p-14 rounded-[2.5rem] shadow-2xl hidden lg:block max-w-xs">
                <span className="text-secondary text-5xl font-serif absolute top-4 left-4 opacity-20">"</span>
                <p className="text-white font-serif italic text-2xl leading-tight relative z-10">
                  The church owes the world a definitive encounter with the divine.
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
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
              
              <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-12">
                {stats.map((stat) => (
                  <div key={stat.label} className="bg-slate-50/50 p-8 rounded-3xl border border-slate-100 group hover:border-secondary/30 hover:bg-white hover:shadow-xl transition-all duration-500">
                    <div className="text-4xl sm:text-5xl font-serif text-primary mb-3 group-hover:text-secondary transition-colors">{stat.value}</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expressions of the Mandate */}
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
              whileHover={{ y: -10 }}
              className="bg-white/5 p-10 sm:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl hover:bg-white/10 transition-all duration-500 group"
            >
              <div className="w-14 h-14 bg-secondary/10 border border-secondary/20 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-secondary transition-colors duration-500">
                <pillar.icon className="h-6 w-6 text-secondary group-hover:text-primary transition-colors duration-500" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif text-white mb-6 group-hover:text-secondary transition-colors duration-300">{pillar.title}</h3>
              <p className="text-slate-400 leading-relaxed mb-10 text-base font-light">{pillar.desc}</p>
              <Link to="/mission" className="text-secondary font-bold flex items-center group/link text-xs tracking-[0.2em] uppercase">
                Explore Expression 
                <ArrowRight className="ml-3 h-4 w-4 group-hover/link:translate-x-2 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Join the Mission (New Section) */}
      <section className="py-20 sm:py-28 bg-white relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-secondary font-bold tracking-[0.4em] uppercase text-[10px] sm:text-xs mb-6 block"
          >
            Take Action
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-6xl font-serif text-primary mb-8"
          >
            Join the <span className="gold-gradient-text italic">Mission</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-lg sm:text-xl text-slate-600 font-light leading-relaxed mb-12 max-w-2xl mx-auto"
          >
            Partner with us to manifest the reality of heaven on earth. Whether through strategic partnership or immersing yourself in the teachings, your journey of transformation starts here.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
          >
            <Link 
              to="/ministry-partnership" 
              className="premium-button w-full sm:w-auto px-10 py-5 flex items-center justify-center group"
            >
              Partner With the Mission <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/teachings" 
              className="w-full sm:w-auto px-10 py-5 rounded-full border border-slate-200 text-primary font-bold tracking-[0.2em] uppercase text-xs hover:border-secondary hover:text-secondary hover:bg-white transition-all duration-300 flex items-center justify-center group shadow-sm hover:shadow-md"
            >
              Explore Teachings <BookOpen className="ml-3 h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
