import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import PublicSermonsList from '../components/PublicSermonsList';
import { ImageIcon, Loader2 } from 'lucide-react';

const STATES = [
  'Enugu', 'Ebonyi', 'Anambra', 'Benin', 'Akure', 'Ogun', 
  'Ekiti', 'Delta', 'Ore', 'Sabo', 'Akoko', 'Shagamu'
];

export default function Teachings() {
  const [selectedCity, setSelectedCity] = useState('Enugu');
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(true);

  useEffect(() => {
    setLoadingGallery(true);
    const q = query(
      collection(db, 'state_galleries'),
      where('state', '==', selectedCity),
      where('status', '==', 'active'),
      orderBy('order', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const images = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setGalleryImages(images);
      setLoadingGallery(false);
    }, (error) => {
      console.error("Error fetching gallery:", error);
      setLoadingGallery(false);
    });

    return () => unsubscribe();
  }, [selectedCity]);

  return (
    <div className="pt-20 bg-primary">
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
            src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop" 
            alt="Teachings Background" 
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
            The Message
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-serif text-white mb-8 uppercase tracking-tighter leading-[0.9]"
          >
            Truth & <br />
            <span className="gold-gradient-text italic">Revelation</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light"
          >
            Deep scriptural insights and prophetic revelations designed to activate your calling and manifest the reality of heaven.
          </motion.p>
        </div>
      </section>

      {/* Public Teachings List */}
      <PublicSermonsList />

      {/* State Gallery Section */}
      <section className="py-20 sm:py-24 bg-primary relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(192,160,96,0.05),transparent_70%)]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-secondary font-bold tracking-[0.3em] uppercase text-[10px] sm:text-xs mb-4 block"
            >
              Visual Testimony
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl font-serif text-white mb-6"
            >
              Ministry Moments <span className="gold-gradient-text italic">Across States</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 max-w-2xl mx-auto text-lg font-light leading-relaxed"
            >
              Witness the impact of the apostolic mandate as we traverse the nations, bringing the reality of heaven to every soul.
            </motion.p>
          </div>

          {/* Gallery Display */}
          <div className="mb-16 min-h-[400px] flex flex-col items-center justify-center">
            {loadingGallery ? (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-secondary" />
                <span className="text-slate-400 font-light tracking-widest text-xs uppercase">Loading Gallery...</span>
              </div>
            ) : galleryImages.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 px-8 rounded-[3rem] bg-white/[0.02] border border-white/5 backdrop-blur-sm max-w-md"
              >
                <ImageIcon className="w-12 h-12 text-slate-700 mx-auto mb-6 opacity-50" />
                <h3 className="text-xl font-serif text-white mb-3">Moments Coming Soon</h3>
                <p className="text-slate-400 font-light text-sm leading-relaxed">
                  Images for <span className="text-secondary font-medium">{selectedCity}</span> will be added soon. Stay tuned for visual testimonies from this region.
                </p>
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedCity}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full"
                >
                  {galleryImages.map((image, idx) => (
                    <motion.div
                      key={image.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl border border-white/5 transition-all duration-500"
                    >
                      <img 
                        src={image.imageUrl} 
                        alt={image.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <span className="text-secondary font-bold tracking-widest text-[10px] uppercase mb-2 block">{selectedCity}</span>
                        <h4 className="text-white font-serif text-xl">{image.title}</h4>
                        {image.caption && (
                          <p className="text-slate-300 text-xs font-light mt-2 line-clamp-2">{image.caption}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* State Selection Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            {STATES.map((city, idx) => (
              <motion.button 
                key={city}
                onClick={() => setSelectedCity(city)}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -5 }}
                className={`p-6 sm:p-8 rounded-3xl text-center border font-serif text-lg sm:text-xl transition-all duration-300 shadow-sm hover:shadow-premium ${
                  selectedCity === city 
                    ? 'bg-secondary text-primary border-secondary shadow-premium' 
                    : 'bg-white/5 text-slate-300 border-white/10 hover:border-secondary hover:text-secondary'
                }`}
              >
                <span className={selectedCity === city ? 'italic font-bold' : ''}>{city}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Global Outreach Tour - Keeping the header but it's now integrated with the gallery above */}
      <section className="py-20 sm:py-24 bg-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-teachings" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-teachings)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-secondary font-bold tracking-[0.3em] uppercase text-[10px] sm:text-xs mb-6 block"
            >
              Apostolic Deployment
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-7xl font-serif text-primary mb-8"
            >
              Global <span className="gold-gradient-text italic">Teaching Tour</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-500 max-w-2xl mx-auto text-lg sm:text-xl font-light leading-relaxed"
            >
              Equipping regional religious leaders and mobilizing the body of Christ across the nations.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Admin Access Portal Section */}
      <section className="py-20 bg-primary border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(192,160,96,0.05),transparent_70%)]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="max-w-2xl mx-auto p-12 rounded-[3rem] bg-white/[0.02] border border-white/10 backdrop-blur-sm">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-secondary font-bold tracking-[0.3em] uppercase text-[10px] mb-4 block"
            >
              Internal Access
            </motion.span>
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-2xl sm:text-3xl font-serif text-white mb-6"
            >
              Ministry <span className="gold-gradient-text italic">Management</span>
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 font-light mb-10 text-sm sm:text-base"
            >
              Authorized personnel can access the sermon management dashboard and AI content generation tools here.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Link 
                to="/admin" 
                className="premium-button inline-flex items-center"
              >
                Open Admin Dashboard
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
