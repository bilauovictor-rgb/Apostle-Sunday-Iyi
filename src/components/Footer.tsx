import { Mail, Globe, Facebook, Youtube, ArrowUpRight, Music2 as Tiktok } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-primary text-slate-300 pt-24 pb-12 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-footer" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-footer)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 mb-20">
          <div className="md:col-span-5">
            <Link to="/" onClick={scrollToTop} className="inline-block group">
              <h3 className="font-serif text-3xl text-white mb-8 uppercase tracking-tighter">
                Sunday <span className="gold-gradient-text">Iyi</span>
              </h3>
            </Link>
            <p className="text-slate-400 max-w-md leading-relaxed font-light text-lg mb-10">
              A visionary leader, teacher, and fifth-generation minister dedicated to the Ministry of Reconciliation and global socio-economic transformation.
            </p>
            <div className="flex space-x-5">
              {[
                { name: "Facebook", icon: Facebook, href: "https://web.facebook.com/sunday.osas.9/" },
                { name: "TikTok", icon: Tiktok, href: "https://www.tiktok.com/@apostlesundayiyi?_r=1&_t=ZN-94kNzz3rsMk" },
                { name: "YouTube", icon: Youtube, href: "https://youtube.com/@apostlesundayiyi?si=2aeYqaFrQ6LmioPo" }
              ].map((social, idx) => (
                <motion.a 
                  key={idx}
                  href={social.href}
                  target={social.href !== "#" ? "_blank" : undefined}
                  rel={social.href !== "#" ? "noopener noreferrer" : undefined}
                  aria-label={`Visit Apostle Sunday Iyi on ${social.name}`}
                  whileHover={{ y: -5, scale: 1.1 }}
                  className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-secondary hover:border-secondary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary transition-all duration-300"
                >
                  <social.icon className="h-5 w-5" aria-hidden="true" />
                </motion.a>
              ))}
            </div>
          </div>

          <div className="md:col-span-3 md:ml-auto">
            <h4 className="text-white font-bold mb-8 uppercase tracking-[0.2em] text-xs">Navigation</h4>
            <ul className="space-y-5">
              {[
                { name: 'The Man', path: '/about' },
                { name: 'The Mission', path: '/mission' },
                { name: 'The Message', path: '/teachings' },
                { name: 'Partnership', path: '/connect' }
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    onClick={scrollToTop}
                    className="group flex items-center text-slate-400 hover:text-secondary transition-colors duration-300 font-light"
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-1 translate-x-1" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-white font-bold mb-8 uppercase tracking-[0.2em] text-xs">Engagement</h4>
            <div className="space-y-8">
              <div className="flex items-start space-x-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-500">
                  <Mail className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <span className="block text-xs text-slate-500 uppercase tracking-widest mb-1">Email Inquiry</span>
                  <span className="text-white font-light group-hover:text-secondary transition-colors">Trachurch@yahoo.co.uk</span>
                </div>
              </div>
              <div className="flex items-start space-x-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-500">
                  <Globe className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <span className="block text-xs text-slate-500 uppercase tracking-widest mb-1">Global Office</span>
                  <span className="text-white font-light group-hover:text-secondary transition-colors">London, United Kingdom</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-slate-500 tracking-wider uppercase">
            © {new Date().getFullYear()} Apostle Sunday Iyi. All Rights Reserved.
          </p>
          <div className="flex items-center space-x-8 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            <Link to="/admin" onClick={scrollToTop} className="hover:text-secondary transition-colors">Admin Access</Link>
            <a href="#" className="hover:text-secondary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-secondary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
