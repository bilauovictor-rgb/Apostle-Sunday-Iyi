import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { ImageIcon, X, Maximize2, Star, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const STATES = [
  'Enugu', 'Ebonyi', 'Anambra', 'Benin', 'Akure', 'Ogun', 
  'Ekiti', 'Delta', 'Ore', 'Sabo', 'Akoko', 'Shagamu'
];

const INITIAL_GRID_SIZE = 9;

const cleanTitle = (title: string) => {
  if (!title) return "";
  let cleaned = title.replace(/\.[^/.]+$/, "");
  cleaned = cleaned.replace(/photo_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}/g, "");
  cleaned = cleaned.replace(/\s*\(\d+\)$/, "");
  cleaned = cleaned.replace(/[_-]/g, " ");
  cleaned = cleaned.trim();
  if (!cleaned || cleaned.length < 2) return "";
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
};

const optimizeCloudinaryUrl = (url: string, options: { width?: number; height?: number; crop?: string; blur?: number } = {}) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  
  const transforms = ['f_auto', 'q_auto'];
  if (options.width) transforms.push(`w_${options.width}`);
  if (options.height) transforms.push(`h_${options.height}`);
  if (options.crop) transforms.push(`c_${options.crop},g_auto`);
  if (options.blur) transforms.push(`e_blur:${options.blur}`);
  
  return url.replace('/upload/', `/upload/${transforms.join(',')}/`);
};

export default function Gallery() {
  const [selectedCity, setSelectedCity] = useState('Enugu');
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [selectedImage, setSelectedImage] = useState<any | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [gridLimit, setGridLimit] = useState(INITIAL_GRID_SIZE);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile for performance optimizations
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const sortedImages = useMemo(() => {
    return [...galleryImages].sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
  }, [galleryImages]);

  const gridImages = useMemo(() => {
    return sortedImages.slice(0, gridLimit);
  }, [sortedImages, gridLimit]);

  const hasMoreImages = sortedImages.length > gridLimit;

  const loadMore = () => setGridLimit(prev => prev + 9);

  const nextLightbox = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (sortedImages.length === 0) return;
    const currentIndex = sortedImages.findIndex(img => img.id === selectedImage?.id);
    const nextIndex = (currentIndex + 1) % sortedImages.length;
    setSelectedImage(sortedImages[nextIndex]);
  }, [sortedImages, selectedImage]);

  const prevLightbox = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (sortedImages.length === 0) return;
    const currentIndex = sortedImages.findIndex(img => img.id === selectedImage?.id);
    const prevIndex = (currentIndex - 1 + sortedImages.length) % sortedImages.length;
    setSelectedImage(sortedImages[prevIndex]);
  }, [sortedImages, selectedImage]);

  useEffect(() => {
    setLoadingGallery(true);
    setActiveIndex(0);
    setGridLimit(INITIAL_GRID_SIZE);
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
        .filter((img: any) => img.status === 'active');
        
      setGalleryImages(images);
      setLoadingGallery(false);
    }, (error) => {
      console.error("Error fetching gallery:", error);
      setLoadingGallery(false);
    });

    return () => unsubscribe();
  }, [selectedCity]);

  const nextSlide = useCallback(() => {
    if (sortedImages.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % sortedImages.length);
  }, [sortedImages.length]);

  const prevSlide = useCallback(() => {
    if (sortedImages.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + sortedImages.length) % sortedImages.length);
  }, [sortedImages.length]);

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
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-32 pb-20">
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
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop" 
            alt="Gallery Background" 
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
            Visual Testimony
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-serif text-white mb-8 uppercase tracking-tighter leading-[0.9]"
          >
            Ministry <br />
            <span className="gold-gradient-text italic">Moments</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light"
          >
            Witness the impact of the apostolic mandate as we traverse the nations, bringing the reality of heaven to every soul.
          </motion.p>
        </div>
      </section>

      {/* State Gallery Section - Cinematic Carousel */}
      <section className="py-24 sm:py-32 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(192,160,96,0.05),transparent_70%)]" />
        </div>
        
        <div className="max-w-[100vw] mx-auto relative z-10 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24">
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              {STATES.map((city, idx) => (
                <motion.button 
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.03 }}
                  className={`px-8 py-3 rounded-full text-sm font-bold tracking-widest uppercase transition-all duration-500 border ${
                    selectedCity === city 
                      ? 'bg-secondary text-primary border-secondary shadow-[0_0_30px_rgba(192,160,96,0.4)] scale-110' 
                      : 'bg-white/5 text-slate-400 border-white/10 hover:border-secondary/50 hover:text-secondary'
                  }`}
                >
                  {city}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="relative min-h-[600px] flex flex-col items-center justify-center">
            {loadingGallery ? (
              <div className="w-full relative px-4 sm:px-0 overflow-visible">
                <div className="relative h-[400px] sm:h-[550px] md:h-[650px] w-full flex items-center justify-center overflow-visible">
                  <div className="absolute w-[90%] sm:w-[75%] md:w-[65%] lg:w-[55%] aspect-[16/9] rounded-[3rem] bg-white/[0.05] border border-secondary/20 shadow-2xl z-20 flex flex-col justify-end p-8 sm:p-16 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="relative z-10 space-y-6">
                      <div className="h-4 w-32 bg-secondary/20 rounded-full animate-pulse" />
                      <div className="h-12 w-3/4 bg-white/10 rounded-2xl animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            ) : sortedImages.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-32 px-16 rounded-[4rem] bg-white/[0.02] border border-white/5 backdrop-blur-md max-w-2xl mx-auto"
              >
                <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-10">
                  <ImageIcon className="w-12 h-12 text-secondary/50" />
                </div>
                <h3 className="text-4xl font-serif text-white mb-6 italic tracking-tight">Moments Coming Soon</h3>
                <p className="text-slate-400 font-light text-xl leading-relaxed">
                  Images for <span className="text-secondary font-medium">{selectedCity}</span> are being curated. Stay tuned for visual testimonies from this region.
                </p>
              </motion.div>
            ) : (
              <div className="w-full relative px-4 sm:px-0 overflow-visible">
                {/* Background Dynamic Blur - Optimized with Cloudinary Blur & Disabled on Mobile */}
                {!isMobile && (
                  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={sortedImages[activeIndex]?.id}
                        src={optimizeCloudinaryUrl(sortedImages[activeIndex]?.imageUrl, { width: 100, blur: 1000 })}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.2 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5 }}
                        className="w-full h-full object-cover scale-150"
                      />
                    </AnimatePresence>
                  </div>
                )}

                <div className="relative h-[400px] sm:h-[550px] md:h-[650px] w-full flex items-center justify-center overflow-visible z-10">
                  <AnimatePresence initial={false}>
                    {sortedImages.map((image, idx) => {
                      const offset = (idx - activeIndex + sortedImages.length) % sortedImages.length;
                      const isCenter = offset === 0;
                      const isPrev = offset === sortedImages.length - 1;
                      const isNext = offset === 1;
                      
                      // On mobile, only render the center image for performance
                      if (isMobile && !isCenter) return null;
                      // On desktop, render center and neighbors
                      if (!isMobile && !isCenter && !isPrev && !isNext) return null;

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
                            scale: isCenter ? 1.05 : 0.85,
                            x: isCenter ? '0%' : isNext ? '65%' : '-65%',
                            zIndex: isCenter ? 30 : 10,
                            filter: isCenter ? 'blur(0px)' : 'blur(8px)'
                          }}
                          exit={{ 
                            opacity: 0, 
                            scale: 0.8,
                            x: isNext ? '50%' : isPrev ? '-50%' : 0,
                            zIndex: 0
                          }}
                          transition={{ 
                            type: 'spring', 
                            stiffness: 260, 
                            damping: 26 
                          }}
                          drag="x"
                          dragElastic={0.2}
                          dragMomentum={false}
                          dragConstraints={{ left: 0, right: 0 }}
                          onDragEnd={(_, info) => {
                            if (info.offset.x > 50) prevSlide();
                            else if (info.offset.x < -50) nextSlide();
                          }}
                          onClick={() => isCenter ? setSelectedImage(image) : setActiveIndex(idx)}
                          className={`absolute w-[90%] sm:w-[75%] md:w-[65%] lg:w-[55%] aspect-[16/9] rounded-[3rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.7)] border cursor-pointer transition-all duration-700 ${
                            isCenter ? 'border-secondary/40 ring-2 ring-secondary/10' : 'border-white/5'
                          }`}
                        >
                          <img 
                            src={optimizeCloudinaryUrl(image.imageUrl, { width: isCenter ? 1000 : 600 })} 
                            alt={image.title}
                            className={`w-full h-full object-cover transition-all duration-1000 ${isCenter ? 'opacity-100 scale-100' : 'opacity-40 scale-110'}`}
                            referrerPolicy="no-referrer"
                            loading={isCenter ? "eager" : "lazy"}
                          />
                          
                          {image.featured && isCenter && (
                            <motion.div 
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="absolute top-6 right-6 sm:top-10 sm:right-10 bg-secondary text-primary px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center shadow-2xl z-30"
                            >
                              <Star className="w-4 h-4 mr-2 fill-current" />
                              <span>Featured Moment</span>
                            </motion.div>
                          )}

                          <div className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent transition-opacity duration-700 ${isCenter ? 'opacity-100' : 'opacity-0'}`} />
                          
                          {isCenter && (
                            <motion.div 
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="absolute bottom-0 left-0 w-full p-8 sm:p-16 z-20"
                            >
                              <div className="flex items-end justify-between gap-8">
                                <div className="flex-grow min-w-0">
                                  <span className="text-secondary font-black tracking-[0.5em] uppercase text-[10px] mb-4 block drop-shadow-lg">{selectedCity}</span>
                                  <h4 className="text-white font-serif text-2xl sm:text-5xl mb-4 tracking-tight line-clamp-2 drop-shadow-2xl leading-tight">
                                    {displayTitle || "Ministry Moment"}
                                  </h4>
                                  {image.caption && (
                                    <p className="text-slate-300 text-sm sm:text-lg font-light max-w-2xl line-clamp-2 leading-relaxed opacity-90 drop-shadow-xl italic">
                                      "{image.caption}"
                                    </p>
                                  )}
                                </div>
                                <div className="hidden lg:flex w-20 h-20 rounded-full bg-secondary/90 items-center justify-center text-primary shadow-2xl hover:scale-110 hover:bg-secondary transition-all duration-500 flex-shrink-0 group/expand">
                                  <Maximize2 className="w-8 h-8 group-hover/expand:scale-110 transition-transform" />
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 sm:mt-28 flex flex-col sm:flex-row items-center justify-between gap-12 sm:gap-0">
                  <div className="flex items-center gap-8 order-2 sm:order-1">
                    <button 
                      onClick={prevSlide}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-secondary hover:text-primary hover:border-secondary transition-all duration-500 group shadow-2xl"
                      aria-label="Previous Slide"
                    >
                      <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 group-hover:-translate-x-2 transition-transform" />
                    </button>
                    <button 
                      onClick={nextSlide}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-secondary hover:text-primary hover:border-secondary transition-all duration-500 group shadow-2xl"
                      aria-label="Next Slide"
                    >
                      <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 group-hover:translate-x-2 transition-transform" />
                    </button>
                  </div>

                  <div className="flex items-center gap-4 order-1 sm:order-2">
                    {sortedImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        className={`transition-all duration-700 rounded-full ${
                          activeIndex === idx 
                            ? 'w-12 sm:w-16 h-2 bg-secondary shadow-[0_0_20px_rgba(192,160,96,0.6)]' 
                            : 'w-2 h-2 bg-white/10 hover:bg-white/30'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <div className="hidden sm:block text-slate-500 font-black tracking-[0.4em] uppercase text-[11px] order-3 bg-white/5 px-6 py-3 rounded-full border border-white/10">
                    {activeIndex + 1} <span className="mx-3 text-white/20">/</span> {sortedImages.length}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Structured Browsing Area - Grid Section */}
      {!loadingGallery && sortedImages.length > 0 && (
        <section className="py-24 sm:py-32 bg-slate-50 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <span className="text-secondary font-bold tracking-[0.4em] uppercase text-[10px] mb-4 block">Archive</span>
                <h2 className="text-4xl sm:text-6xl font-serif text-primary tracking-tight">
                  Explore <span className="text-secondary italic">{selectedCity}</span>
                </h2>
              </div>
              <p className="text-slate-500 max-w-md font-light text-lg">
                Browse the complete visual record of our ministry engagements in {selectedCity}.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
              {gridImages.map((image, idx) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedImage(image)}
                  className="group relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-slate-200 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
                >
                  <img 
                    src={optimizeCloudinaryUrl(image.imageUrl, { width: 600, height: 750, crop: 'fill' })} 
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <span className="text-secondary font-bold tracking-[0.3em] uppercase text-[9px] mb-2 block">{image.state}</span>
                    <h4 className="text-white font-serif text-xl mb-2 line-clamp-1">{cleanTitle(image.title) || "Ministry Moment"}</h4>
                    <div className="flex items-center text-white/60 text-xs font-medium uppercase tracking-widest">
                      <Maximize2 className="w-3 h-3 mr-2" />
                      View Full
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Load More Button */}
            {hasMoreImages && (
              <div className="mt-20 text-center">
                <button 
                  onClick={loadMore}
                  className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-white border border-slate-200 text-primary font-bold tracking-[0.2em] uppercase text-xs hover:border-secondary hover:text-secondary transition-all duration-300 shadow-sm hover:shadow-xl group"
                >
                  <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                  Load More Moments
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-primary/98 backdrop-blur-3xl"
            onClick={() => setSelectedImage(null)}
          >
            {/* Navigation Arrows for Lightbox */}
            <div className="absolute inset-x-4 sm:inset-x-12 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-[120]">
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={prevLightbox}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-secondary hover:text-primary hover:border-secondary transition-all duration-500 pointer-events-auto shadow-2xl group"
              >
                <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
              </motion.button>
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={nextLightbox}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-secondary hover:text-primary hover:border-secondary transition-all duration-500 pointer-events-auto shadow-2xl group"
              >
                <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>

            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-8 right-8 p-4 bg-white/5 text-white rounded-full hover:bg-secondary hover:text-primary transition-all duration-500 z-[130] border border-white/10 shadow-2xl"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <X className="w-6 h-6" />
            </motion.button>

            <motion.div
              key={selectedImage.id}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative max-w-6xl w-full max-h-[90vh] flex flex-col items-center z-[110]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full aspect-video sm:aspect-auto sm:h-[70vh] rounded-[3rem] overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.9)] border border-white/10 bg-black/40 group">
                <img 
                  src={optimizeCloudinaryUrl(selectedImage.imageUrl, { width: 2000 })} 
                  alt={selectedImage.title}
                  className="w-full h-full object-contain transition-transform duration-700 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="mt-12 text-center max-w-4xl px-8">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center justify-center gap-4 mb-6"
                >
                  <span className="text-secondary font-black tracking-[0.5em] uppercase text-[10px] bg-secondary/10 px-4 py-1.5 rounded-full border border-secondary/20">
                    {selectedImage.state}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="text-slate-500 font-bold tracking-[0.2em] uppercase text-[10px]">
                    {selectedImage.createdAt ? new Date(selectedImage.createdAt.toDate()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recent Moment'}
                  </span>
                </motion.div>
                <motion.h3 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl sm:text-6xl font-serif text-white mb-8 tracking-tight leading-tight"
                >
                  {cleanTitle(selectedImage.title) || "Ministry Moment"}
                </motion.h3>
                {selectedImage.caption && (
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-slate-400 font-light text-xl sm:text-2xl leading-relaxed italic max-w-3xl mx-auto"
                  >
                    "{selectedImage.caption}"
                  </motion.p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
