import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import PublicSermonsList from '../components/PublicSermonsList';
import { ImageIcon, Loader2, X, Maximize2, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const STATES = [
  'Enugu', 'Ebonyi', 'Anambra', 'Benin', 'Akure', 'Ogun', 
  'Ekiti', 'Delta', 'Ore', 'Sabo', 'Akoko', 'Shagamu'
];

const cleanTitle = (title: string) => {
  if (!title) return "";
  // Remove file extensions
  let cleaned = title.replace(/\.[^/.]+$/, "");
  // Remove common patterns like "photo_2026-04-13_20-29-54"
  cleaned = cleaned.replace(/photo_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}/g, "");
  // Remove trailing numbers in parentheses like "(2)"
  cleaned = cleaned.replace(/\s*\(\d+\)$/, "");
  // Replace underscores and hyphens with spaces
  cleaned = cleaned.replace(/[_-]/g, " ");
  // Trim
  cleaned = cleaned.trim();
  
  // If it's still empty or looks like a random string, return a fallback
  if (!cleaned || cleaned.length < 2) return "";
  
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
};

export default function Teachings() {
  const [selectedCity, setSelectedCity] = useState('Enugu');
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [selectedImage, setSelectedImage] = useState<any | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setLoadingGallery(true);
    setActiveIndex(0);
    // Safest query: filter by state only
    const q = query(
      collection(db, 'state_galleries'),
      where('state', '==', selectedCity)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const images = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        // Filter in memory for safety
        .filter((img: any) => img.status === 'active')
        // Sort in memory for safety
        .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
        
      setGalleryImages(images);
      setLoadingGallery(false);
    }, (error) => {
      console.error("Error fetching gallery:", error);
      setLoadingGallery(false);
    });

    return () => unsubscribe();
  }, [selectedCity]);

  const nextSlide = useCallback(() => {
    if (galleryImages.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % galleryImages.length);
  }, [galleryImages.length]);

  const prevSlide = useCallback(() => {
    if (galleryImages.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  }, [galleryImages.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

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
      <section className="py-24 sm:py-32 bg-primary relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(192,160,96,0.03),transparent_70%)]" />
        </div>
        
        <div className="max-w-[100vw] mx-auto relative z-10 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-secondary font-bold tracking-[0.4em] uppercase text-[10px] sm:text-xs mb-6 block"
            >
              Visual Testimony
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-5xl sm:text-6xl md:text-7xl font-serif text-white mb-8 tracking-tight"
            >
              Ministry Moments <span className="gold-gradient-text italic">Across States</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 max-w-2xl mx-auto text-lg sm:text-xl font-light leading-relaxed"
            >
              Witness the impact of the apostolic mandate as we traverse the nations, bringing the reality of heaven to every soul.
            </motion.p>
          </div>

          {/* State Selection - Refined */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-20">
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              {STATES.map((city, idx) => (
                <motion.button 
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.03 }}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-500 border ${
                    selectedCity === city 
                      ? 'bg-secondary text-primary border-secondary shadow-[0_0_20px_rgba(192,160,96,0.3)] scale-105' 
                      : 'bg-white/5 text-slate-400 border-white/10 hover:border-secondary/50 hover:text-secondary'
                  }`}
                >
                  {city}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Cinematic Carousel Display */}
          <div className="relative min-h-[500px] flex flex-col items-center justify-center">
            {loadingGallery ? (
              <div className="flex flex-col items-center gap-6">
                <div className="relative">
                  <div className="w-16 h-16 border-2 border-secondary/20 rounded-full animate-ping absolute inset-0" />
                  <Loader2 className="w-16 h-16 animate-spin text-secondary relative z-10" />
                </div>
                <span className="text-secondary font-bold tracking-[0.3em] uppercase text-[10px]">Loading Cinematic Gallery...</span>
              </div>
            ) : galleryImages.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-24 px-12 rounded-[4rem] bg-white/[0.02] border border-white/5 backdrop-blur-md max-w-xl mx-auto"
              >
                <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                  <ImageIcon className="w-10 h-10 text-secondary/50" />
                </div>
                <h3 className="text-3xl font-serif text-white mb-4 italic">Moments Coming Soon</h3>
                <p className="text-slate-400 font-light text-lg leading-relaxed">
                  Images for <span className="text-secondary font-medium">{selectedCity}</span> are being curated. Stay tuned for visual testimonies from this region.
                </p>
              </motion.div>
            ) : (
              <div className="w-full relative px-4 sm:px-0 overflow-visible">
                {/* Carousel Container */}
                <div className="relative h-[380px] sm:h-[500px] md:h-[600px] w-full flex items-center justify-center overflow-visible">
                  <AnimatePresence initial={false}>
                    {galleryImages.map((image, idx) => {
                      const offset = (idx - activeIndex + galleryImages.length) % galleryImages.length;
                      const isCenter = offset === 0;
                      const isPrev = offset === galleryImages.length - 1;
                      const isNext = offset === 1;
                      
                      if (!isCenter && !isPrev && !isNext) return null;

                      const displayTitle = cleanTitle(image.title);

                      return (
                        <motion.div
                          key={image.id}
                          initial={{ 
                            opacity: 0, 
                            scale: 0.8,
                            x: isNext ? '50%' : isPrev ? '-50%' : 0,
                            zIndex: 0
                          }}
                          animate={{ 
                            opacity: isCenter ? 1 : 0.4,
                            scale: isCenter ? 1 : 0.85,
                            x: isCenter ? '0%' : isNext ? '60%' : '-60%',
                            zIndex: isCenter ? 20 : 10,
                            filter: isCenter ? 'blur(0px)' : 'blur(4px)'
                          }}
                          exit={{ 
                            opacity: 0, 
                            scale: 0.8,
                            x: isNext ? '50%' : isPrev ? '-50%' : 0,
                            zIndex: 0
                          }}
                          transition={{ 
                            type: 'spring', 
                            stiffness: 300, 
                            damping: 30 
                          }}
                          drag="x"
                          dragConstraints={{ left: 0, right: 0 }}
                          onDragEnd={(_, info) => {
                            if (info.offset.x > 100) prevSlide();
                            else if (info.offset.x < -100) nextSlide();
                          }}
                          onClick={() => isCenter ? setSelectedImage(image) : setActiveIndex(idx)}
                          className={`absolute w-[88%] sm:w-[70%] md:w-[60%] lg:w-[50%] aspect-[4/3] sm:aspect-[16/9] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border cursor-pointer transition-colors duration-500 ${
                            isCenter ? 'border-secondary/30 ring-1 ring-secondary/20' : 'border-white/5'
                          }`}
                        >
                          <img 
                            src={image.imageUrl} 
                            alt={image.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          
                          {/* Featured Badge */}
                          {image.featured && isCenter && (
                            <motion.div 
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="absolute top-4 right-4 sm:top-8 sm:right-8 bg-secondary text-primary px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-widest flex items-center shadow-2xl z-30"
                            >
                              <Star className="w-3 sm:w-3.5 h-3 sm:h-3.5 mr-1.5 sm:mr-2 fill-current" />
                              <span className="hidden xs:inline">Featured Moment</span>
                              <span className="xs:hidden">Featured</span>
                            </motion.div>
                          )}

                          {/* Overlay Gradient */}
                          <div className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent transition-opacity duration-700 ${isCenter ? 'opacity-100' : 'opacity-0'}`} />
                          
                          {/* Center Content */}
                          {isCenter && (
                            <motion.div 
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="absolute bottom-0 left-0 w-full p-5 sm:p-12 z-20"
                            >
                              <div className="flex items-end justify-between gap-4 sm:gap-6">
                                <div className="flex-grow min-w-0">
                                  <span className="text-secondary font-bold tracking-[0.3em] sm:tracking-[0.4em] uppercase text-[9px] sm:text-[10px] mb-2 sm:mb-3 block">{selectedCity}</span>
                                  <h4 className="text-white font-serif text-lg sm:text-4xl mb-2 sm:mb-3 tracking-tight line-clamp-1 sm:line-clamp-2">
                                    {displayTitle || "Ministry Moment"}
                                  </h4>
                                  {image.caption && (
                                    <p className="text-slate-300 text-xs sm:text-base font-light max-w-xl line-clamp-2 leading-relaxed opacity-80 sm:opacity-100">{image.caption}</p>
                                  )}
                                </div>
                                <div className="hidden sm:flex w-14 h-14 rounded-full bg-secondary/90 items-center justify-center text-primary shadow-xl hover:scale-110 transition-transform flex-shrink-0">
                                  <Maximize2 className="w-6 h-6" />
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>

                {/* Navigation Controls */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20 flex flex-col sm:flex-row items-center justify-between gap-8 sm:gap-0">
                  <div className="flex items-center gap-6 order-2 sm:order-1">
                    <button 
                      onClick={prevSlide}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-secondary hover:text-primary hover:border-secondary transition-all duration-500 group shadow-xl"
                    >
                      <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <button 
                      onClick={nextSlide}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-secondary hover:text-primary hover:border-secondary transition-all duration-500 group shadow-xl"
                    >
                      <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* Pagination Dots */}
                  <div className="flex items-center gap-3 order-1 sm:order-2">
                    {galleryImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        className={`transition-all duration-500 rounded-full ${
                          activeIndex === idx 
                            ? 'w-8 sm:w-10 h-1.5 sm:h-2 bg-secondary shadow-[0_0_10px_rgba(192,160,96,0.5)]' 
                            : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/20 hover:bg-white/40'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="hidden sm:block text-slate-500 font-bold tracking-[0.3em] uppercase text-[10px] order-3">
                    {activeIndex + 1} <span className="mx-2 text-white/20">/</span> {galleryImages.length}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Lightbox Modal - Enhanced */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-primary/98 backdrop-blur-2xl"
            onClick={() => setSelectedImage(null)}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-8 right-8 p-4 bg-white/5 text-white rounded-full hover:bg-secondary hover:text-primary transition-all duration-500 z-[110] border border-white/10"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <X className="w-6 h-6" />
            </motion.button>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative max-w-6xl w-full max-h-[90vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full aspect-video sm:aspect-auto sm:h-[75vh] rounded-[3rem] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.8)] border border-white/10 bg-black/40">
                <img 
                  src={selectedImage.imageUrl} 
                  alt={selectedImage.title}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="mt-10 text-center max-w-3xl px-6">
                <motion.span 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-secondary font-bold tracking-[0.4em] uppercase text-[10px] mb-4 block"
                >
                  {selectedImage.state} • {selectedImage.createdAt ? new Date(selectedImage.createdAt.toDate()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recent Moment'}
                </motion.span>
                <motion.h3 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl sm:text-5xl font-serif text-white mb-6 tracking-tight"
                >
                  {cleanTitle(selectedImage.title) || "Ministry Moment"}
                </motion.h3>
                {selectedImage.caption && (
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-slate-400 font-light text-lg sm:text-xl leading-relaxed italic"
                  >
                    "{selectedImage.caption}"
                  </motion.p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Outreach Tour */}
      <section className="py-24 sm:py-32 bg-slate-50 relative overflow-hidden">
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
              className="text-5xl sm:text-8xl font-serif text-primary mb-10 tracking-tighter"
            >
              Global <span className="gold-gradient-text italic">Teaching Tour</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-500 max-w-3xl mx-auto text-xl sm:text-2xl font-light leading-relaxed"
            >
              Equipping regional religious leaders and mobilizing the body of Christ across the nations.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Admin Access Portal Section */}
      <section className="py-24 bg-primary border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(192,160,96,0.05),transparent_70%)]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="max-w-3xl mx-auto p-16 rounded-[4rem] bg-white/[0.02] border border-white/10 backdrop-blur-md">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-secondary font-bold tracking-[0.4em] uppercase text-[10px] mb-6 block"
            >
              Internal Access
            </motion.span>
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl font-serif text-white mb-8"
            >
              Ministry <span className="gold-gradient-text italic">Management</span>
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 font-light mb-12 text-lg leading-relaxed"
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
                className="premium-button inline-flex items-center px-10 py-5"
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
