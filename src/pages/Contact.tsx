import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { Mail, Globe, Users, Heart, BookOpen, Send, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Contact() {
  const engagement = [
    {
      title: 'Speaking Invitations',
      desc: 'Invite Apostle Sunday Iyi to speak at your conference, church, or leadership summit.',
      icon: Users,
      path: '/speaking-invitations'
    },
    {
      title: 'Ministry Partnership',
      desc: 'Join the global mission through strategic financial and prayer partnership.',
      icon: Heart,
      path: '/ministry-partnership'
    },
    {
      title: 'GSOM Admissions',
      desc: 'Inquire about enrollment in the Global School of Ministry under the deanship of Apostle Sunday Iyi.',
      icon: BookOpen,
      path: '/gsom-admissions'
    }
  ];

  return (
    <div className="pt-20 bg-primary">
      <Helmet>
        <title>Connect & Partner | Apostle Sunday Iyi | Teaching, Equipping & Transforming Lives</title>
        <meta name="description" content="Get in touch with the ministry of Apostle Sunday Iyi. Invite for speaking engagements, explore partnership opportunities, or inquire about the Global School of Ministry." />
        <link rel="canonical" href="https://apostlesundayiyi.org/connect" />
      </Helmet>
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
            src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=2070&auto=format&fit=crop" 
            alt="Contact Background" 
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
            Connect
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-serif text-white mb-8 uppercase tracking-tighter leading-[0.9]"
          >
            Partnership & <br />
            <span className="gold-gradient-text italic">Invitation</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light"
          >
            Apostle Sunday Iyi is dedicated to building strategic relationships that advance the Kingdom and manifest the reality of heaven across the globe.
          </motion.p>
        </div>
      </section>

      <section className="py-20 sm:py-24 bg-white relative">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary to-transparent opacity-5" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl sm:text-6xl font-serif text-primary mb-12 leading-tight">
                Engagement <br />
                <span className="gold-gradient-text italic">Inquiry</span>
              </h2>
              <form className="space-y-8 sm:space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label htmlFor="contact-name" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">Full Name</label>
                    <input 
                      id="contact-name"
                      type="text" 
                      className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-secondary focus:bg-white outline-none transition-all text-base font-light" 
                      placeholder="John Doe" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label htmlFor="contact-email" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">Email Address</label>
                    <input 
                      id="contact-email"
                      type="email" 
                      className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-secondary focus:bg-white outline-none transition-all text-base font-light" 
                      placeholder="john@example.com" 
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label htmlFor="contact-type" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">Inquiry Type</label>
                  <div className="relative">
                    <select id="contact-type" className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-secondary focus:bg-white outline-none transition-all appearance-none text-base font-light">
                      <option>Speaking Invitation</option>
                      <option>Ministry Partnership</option>
                      <option>GSOM Inquiry</option>
                      <option>Media Request</option>
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <label htmlFor="contact-message" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">Message / Request Details</label>
                  <textarea 
                    id="contact-message"
                    rows={6} 
                    className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-secondary focus:bg-white outline-none transition-all text-base font-light resize-none" 
                    placeholder="How can the ministry partner with you?"
                  ></textarea>
                </div>
                <button type="submit" className="premium-button px-12 py-5 flex items-center justify-center group w-full sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2">
                  Submit Inquiry <Send className="ml-3 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" aria-hidden="true" />
                </button>
              </form>
            </motion.div>

            {/* Engagement Options */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-16 sm:space-y-24"
            >
              <div>
                <h2 className="text-4xl sm:text-6xl font-serif text-primary mb-12 leading-tight">
                  Ways to <br />
                  <span className="gold-gradient-text italic">Connect</span>
                </h2>
                <div className="space-y-8">
                  {engagement.map((item, idx) => (
                    <Link 
                      key={item.title}
                      to={item.path}
                      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 rounded-[2.5rem]"
                    >
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="bg-slate-50 p-8 sm:p-12 rounded-[2.5rem] border border-slate-100 flex flex-col sm:flex-row items-start space-y-8 sm:space-y-0 sm:space-x-10 group hover:bg-white hover:shadow-premium transition-all duration-500 relative overflow-hidden"
                      >
                        <div className="bg-white p-5 rounded-2xl text-secondary shadow-sm group-hover:bg-secondary group-hover:text-white transition-all duration-500 flex-shrink-0 border border-slate-100">
                          <item.icon className="h-8 w-8" aria-hidden="true" />
                        </div>
                        <div className="flex-grow pr-8">
                          <h3 className="text-2xl sm:text-3xl font-serif text-primary mb-4 group-hover:text-secondary transition-colors duration-300">{item.title}</h3>
                          <p className="text-slate-500 leading-relaxed text-base sm:text-lg font-light">{item.desc}</p>
                        </div>
                        <div className="absolute right-8 top-1/2 -translate-y-1/2 text-secondary opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500 hidden sm:block">
                          <ArrowRight className="h-8 w-8" aria-hidden="true" />
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-16 border-t border-slate-100">
                <span className="text-secondary font-bold tracking-[0.3em] uppercase text-[10px] sm:text-xs mb-10 block">Global Office</span>
                <div className="space-y-8">
                  <motion.div 
                    whileHover={{ x: 10 }}
                    className="flex items-center text-primary group cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mr-6 group-hover:bg-secondary/10 transition-colors">
                      <Mail className="h-5 w-5 text-secondary" aria-hidden="true" />
                    </div>
                    <span className="text-xl sm:text-2xl font-serif">Trachurch@yahoo.co.uk</span>
                  </motion.div>
                  <motion.div 
                    whileHover={{ x: 10 }}
                    className="flex items-center text-primary group cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mr-6 group-hover:bg-secondary/10 transition-colors">
                      <Globe className="h-5 w-5 text-secondary" aria-hidden="true" />
                    </div>
                    <span className="text-xl sm:text-2xl font-serif">London, United Kingdom</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
