import { motion } from 'motion/react';
import { GraduationCap, BookOpen, Award, CheckCircle2, Send, FileText } from 'lucide-react';

export default function GSOMAdmissions() {
  const programs = [
    { 
      title: 'Apostolic Leadership', 
      duration: '12 Months',
      desc: 'Developing visionary leaders with a mandate for global transformation and institutional building.' 
    },
    { 
      title: 'Ministry of Reconciliation', 
      duration: '6 Months',
      desc: 'A deep dive into the theological and practical aspects of reconciling man to God and society.' 
    },
    { 
      title: 'Socio-Economic Mandate', 
      duration: '9 Months',
      desc: 'Equipping ministers to influence the marketplace and drive economic change through faith.' 
    }
  ];

  const requirements = [
    'Completed Application Form',
    'Personal Statement of Calling',
    'Letter of Recommendation from Ministry Leader',
    'High School Diploma or Equivalent',
    'Successful Admission Interview'
  ];

  return (
    <div className="pt-20 bg-primary min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[65vh] flex items-center justify-center overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(192,160,96,0.1),transparent_70%)]" />
          <div className="absolute inset-0 bg-primary/60 backdrop-blur-[2px]" />
          <img 
            src="https://images.unsplash.com/photo-1523050335392-9bc567597280?q=80&w=2070&auto=format&fit=crop" 
            alt="GSOM Hero" 
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
            Education
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-7xl md:text-8xl font-serif text-white mb-8 uppercase tracking-tighter leading-[0.9]"
          >
            GSOM <br />
            <span className="gold-gradient-text italic">Admissions</span>
          </motion.h1>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-20 sm:py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl sm:text-5xl font-serif text-primary mb-8 leading-tight">
                Equipping the <br />
                <span className="gold-gradient-text italic">Next Generation</span>
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed font-light mb-8">
                The Global School of Ministry (GSOM) is more than an academic institution; it is a furnace of transformation. Our curriculum is designed to bridge the gap between spiritual depth and practical leadership.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed font-light">
                We believe in raising ministers who are not only sound in doctrine but also effective in their spheres of influence, manifesting the Jerusalem Mandate globally.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-video rounded-[2.5rem] overflow-hidden shadow-premium">
                <img 
                  src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop" 
                  alt="GSOM Classroom" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-secondary p-8 rounded-2xl text-primary shadow-xl hidden sm:block">
                <GraduationCap className="h-8 w-8" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Programs Offered */}
      <section className="py-20 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-serif text-primary mb-4">Academic <span className="gold-gradient-text italic">Programs</span></h2>
            <p className="text-slate-500 font-light">Specialized tracks for diverse ministry callings.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {programs.map((program, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-premium transition-all duration-500 group"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-500">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">{program.duration}</span>
                </div>
                <h3 className="text-2xl font-serif text-primary mb-4">{program.title}</h3>
                <p className="text-slate-500 font-light text-sm leading-relaxed">{program.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Admission Requirements */}
      <section className="py-20 sm:py-24 bg-primary relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-serif text-white mb-8">Admission <span className="gold-gradient-text italic">Requirements</span></h2>
              <div className="space-y-6">
                {requirements.map((req, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center space-x-4 text-slate-300 font-light"
                  >
                    <CheckCircle2 className="h-5 w-5 text-secondary shrink-0" />
                    <span>{req}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 p-12 rounded-[3rem] text-center">
              <Award className="h-16 w-16 text-secondary mx-auto mb-6" />
              <h3 className="text-2xl font-serif text-white mb-4">Accredited Excellence</h3>
              <p className="text-slate-400 font-light text-sm leading-relaxed">
                GSOM is recognized globally for its high academic and spiritual standards, ensuring our graduates are prepared for international ministry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enrollment Form */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-serif text-primary mb-6">Enrollment <span className="gold-gradient-text italic">Application</span></h2>
            <p className="text-slate-500 font-light">Start your journey of transformation today.</p>
          </div>
          <form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">Full Name</label>
                <input type="text" className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-secondary focus:bg-white outline-none transition-all font-light" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">Email Address</label>
                <input type="email" className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-secondary focus:bg-white outline-none transition-all font-light" placeholder="email@example.com" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">Desired Program</label>
                <select className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-secondary focus:bg-white outline-none transition-all font-light appearance-none">
                  <option>Apostolic Leadership</option>
                  <option>Ministry of Reconciliation</option>
                  <option>Socio-Economic Mandate</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">Highest Qualification</label>
                <input type="text" className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-secondary focus:bg-white outline-none transition-all font-light" placeholder="e.g. Bachelor's Degree" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">Statement of Purpose</label>
              <textarea rows={6} className="w-full px-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-secondary focus:bg-white outline-none transition-all font-light resize-none" placeholder="Briefly describe your calling and why you wish to enroll in GSOM..."></textarea>
            </div>
            <div className="flex items-center space-x-3 p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <FileText className="h-6 w-6 text-secondary" />
              <p className="text-xs text-slate-500 font-light">By submitting this form, you agree to our admission process and will be contacted for an interview.</p>
            </div>
            <button className="premium-button w-full py-6 flex items-center justify-center group">
              Submit Application <Send className="ml-3 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
