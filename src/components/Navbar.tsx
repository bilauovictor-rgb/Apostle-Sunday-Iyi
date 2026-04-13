import { NavLink } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Mission', path: '/mission' },
    { name: 'Teachings', path: '/teachings' },
    { 
      name: 'Connect', 
      path: '/connect',
      dropdown: [
        { name: 'Speaking Invitations', path: '/speaking-invitations' },
        { name: 'Ministry Partnership', path: '/ministry-partnership' },
        { name: 'GSOM Admissions', path: '/gsom-admissions' },
      ]
    },
    { name: 'Admin', path: '/admin' },
  ];

  return (
    <nav 
      role="navigation"
      aria-label="Main Navigation"
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-primary/95 backdrop-blur-lg py-4 shadow-2xl' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center group" aria-label="Home">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-[0.2em] uppercase transition-all group-hover:text-secondary text-white">
                Sunday <span className="text-secondary italic font-normal">Iyi</span>
              </span>
            </NavLink>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-10">
            {navItems.map((item) => (
              <div key={item.name} className="relative group">
                <NavLink
                  to={item.path}
                  aria-haspopup={item.dropdown ? "true" : undefined}
                  aria-expanded={item.dropdown ? "false" : undefined}
                  className={({ isActive }) =>
                    `flex items-center text-[10px] font-bold uppercase tracking-[0.3em] transition-all hover:text-secondary focus-visible:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-4 focus-visible:ring-offset-primary rounded-sm relative py-2 ${
                      isActive ? 'text-secondary' : 'text-slate-300'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.name}
                      {item.dropdown && <ChevronDown className="ml-1 w-3 h-3 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" aria-hidden="true" />}
                      {isActive && (
                        <motion.div 
                          layoutId="nav-underline"
                          className="absolute -bottom-1 left-0 w-full h-px bg-secondary"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
                
                {item.dropdown && (
                  <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 group-focus-within:translate-y-0">
                    <div className="bg-primary/95 backdrop-blur-lg border border-white/10 rounded-xl shadow-2xl py-3 min-w-[240px] flex flex-col">
                      {item.dropdown.map((dropItem) => (
                        <NavLink
                          key={dropItem.name}
                          to={dropItem.path}
                          className={({ isActive }) =>
                            `px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors hover:bg-white/5 hover:text-secondary focus-visible:bg-white/5 focus-visible:text-secondary focus-visible:outline-none ${
                              isActive ? 'text-secondary bg-white/5' : 'text-slate-300'
                            }`
                          }
                        >
                          {dropItem.name}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              className="text-slate-200 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary rounded-md transition-colors p-2"
            >
              {isOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 w-full bg-primary/98 backdrop-blur-xl border-t border-white/5 shadow-2xl max-h-[calc(100vh-80px)] overflow-y-auto"
          >
            <div className="px-6 py-10 space-y-6">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <NavLink
                    to={item.path}
                    onClick={() => !item.dropdown && setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between text-lg font-serif tracking-widest uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary rounded-md p-1 ${
                        isActive ? 'text-secondary italic' : 'text-slate-300'
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                  {item.dropdown && (
                    <div className="mt-4 ml-4 space-y-4 border-l border-white/10 pl-4">
                      {item.dropdown.map((dropItem) => (
                        <NavLink
                          key={dropItem.name}
                          to={dropItem.path}
                          onClick={() => setIsOpen(false)}
                          className={({ isActive }) =>
                            `block text-sm font-serif tracking-widest uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary rounded-md p-1 ${
                              isActive ? 'text-secondary italic' : 'text-slate-400'
                            }`
                          }
                        >
                          {dropItem.name}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
