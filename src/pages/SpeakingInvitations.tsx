import { motion } from 'motion/react';
import { Users, Calendar, Mic2, MapPin, Send } from 'lucide-react';

export default function SpeakingInvitations() {
  const eventTypes = [
    { title: 'Conferences', desc: 'Apostolic and leadership conferences focused on spiritual growth and global impact.' },
    { title: 'Church Services', desc: 'Sunday services, mid-week revivals, and special ministry anniversaries.' },
    { title: 'Leadership Summits', desc: 'Intensive training sessions for pastors, ministry leaders, and executives.' },
    { title: 'Academic Forums', desc: 'Theological seminars and academic discussions on faith and society.' }
  ];

  const topics = [
    'The Ministry of Reconciliation',
    'Apostolic Leadership in the 21st Century',
    'Socio-Economic Transformation through Faith',
    'The Jerusalem Mandate: Local Evangelism',
    'Spiritual Authority and Global Revival'
  ];

  return (
    <div className="pt-20 bg-primary min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[65vh] flex items-center justify-center overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(192,160,96,0.1),transparent_70%)]" />
          <div className="absolute inset-0 bg-primary/60 backdrop-blur-[2px]" />
          <img 
            src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=2070&auto=format&fit=crop" 
            alt="Speaking Hero" 
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
            Invitations
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-7xl md:text-8xl font-serif text-white mb-8 uppercase tracking-tighter leading-[0.9]"
          >
            Speaking <br />
            <span className="gold-gradient-text italic">Invitations</span>
          </motion.h1>
        </div>
      </section>

      {/* Description Section */}
      <section className="py-20 sm:py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl sm:text-5xl font-serif text-primary mb-8 leading-tight">
                A Voice for <br />
                <span className="gold-gradient-text italic">Global Reconciliation</span>
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed font-light mb-8">
                Apostle Sunday Iyi is a visionary leader and teacher dedicated to the Ministry of Reconciliation. His speaking ministry is characterized by deep scriptural insight, prophetic revelation, and a call to socio-economic transformation.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed font-light">
                Whether addressing a local congregation or a global leadership summit, his message is clear: to reconcile man to God and manifest the reality of heaven on earth.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-video rounded-[2rem] overflow-hidden shadow-premium">
                <img 
                  src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2012&auto=format&fit=crop" 
                  alt="Speaking Event" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-secondary p-8 rounded-2xl text-primary shadow-xl hidden sm:block">
                <Mic2 className="h-8 w-8" aria-hidden="true" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Event Types & Topics */}
      <section className="py-20 sm:py-24 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h3 className="text-3xl font-serif text-primary mb-12">Types of Events</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {eventTypes.map((type, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-premium transition-all duration-300"
                  >
                    <h4 className="text-xl font-serif text-primary mb-3">{type.title}</h4>
                    <p className="text-slate-500 text-sm font-light leading-relaxed">{type.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-serif text-primary mb-12">Speaking Topics</h3>
              <div className="space-y-4">
                {topics.map((topic, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center space-x-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
                  >
                    <div className="w-2 h-2 bg-secondary rounded-full" />
                    <span className="text-primary font-light">{topic}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Request Form */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-serif text-primary mb-6">Invitation <span className="gold-gradient-text italic">Request</span></h2>
            <p className="text-slate-500 font-light">Please provide the details of your event below. The ministry's office will review your request and get back to you shortly.</p>
          </div>
          <form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label htmlFor="invite-org" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">Organization Name</label>
                <input id="invite-org" type="text" className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-secondary focus:bg-white outline-none transition-all font-light" placeholder="Church or Organization Name" />
              </div>
              <div className="space-y-2">
                <label htmlFor="invite-contact" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">Contact Person</label>
                <input id="invite-contact" type="text" className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-secondary focus:bg-white outline-none transition-all font-light" placeholder="Full Name" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label htmlFor="invite-email" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">Email Address</label>
                <input id="invite-email" type="email" className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-secondary focus:bg-white outline-none transition-all font-light" placeholder="email@example.com" />
              </div>
              <div className="space-y-2">
                <label htmlFor="invite-date" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">Event Date</label>
                <input id="invite-date" type="date" className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-secondary focus:bg-white outline-none transition-all font-light" />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="invite-location" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">Event Location</label>
              <div className="relative">
                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" aria-hidden="true" />
                <input id="invite-location" type="text" className="w-full pl-14 pr-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-secondary focus:bg-white outline-none transition-all font-light" placeholder="City, Country" />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="invite-desc" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">Event Description</label>
              <textarea id="invite-desc" rows={6} className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-secondary focus:bg-white outline-none transition-all font-light resize-none" placeholder="Provide more details about the event and the expected audience..."></textarea>
            </div>
            <button type="submit" className="premium-button w-full py-6 flex items-center justify-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2">
              Send Invitation Request <Send className="ml-3 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" aria-hidden="true" />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
