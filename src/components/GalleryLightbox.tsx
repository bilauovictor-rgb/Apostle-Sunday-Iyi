import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxProps {
  image: any;
  onClose: () => void;
  onNext: (e: React.MouseEvent) => void;
  onPrev: (e: React.MouseEvent) => void;
  cleanTitle: (title: string) => string;
  optimizeUrl: (url: string, options?: any) => string;
}

export default function GalleryLightbox({ 
  image, 
  onClose, 
  onNext, 
  onPrev, 
  cleanTitle, 
  optimizeUrl 
}: LightboxProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reset loaded state when image changes
  useEffect(() => {
    setImageLoaded(false);
  }, [image.id]);

  if (!image) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-primary/98 ${isMobile ? 'backdrop-blur-xl' : 'backdrop-blur-3xl p-4 sm:p-8'}`}
      onClick={onClose}
    >
      {/* Delayed UI Controls - Only fade in after image is visible */}
      <AnimatePresence>
        {imageLoaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 pointer-events-none z-[120]"
          >
            {/* Navigation Arrows */}
            <div className="absolute inset-x-4 sm:inset-x-12 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
              <button
                onClick={onPrev}
                className={`${isMobile ? 'w-12 h-12' : 'w-14 h-14 sm:w-20 sm:h-20'} rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-secondary hover:text-primary transition-all duration-500 pointer-events-auto shadow-2xl group`}
              >
                <ChevronLeft className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6 sm:w-8 sm:h-8'} group-hover:-translate-x-1 transition-transform`} />
              </button>
              <button
                onClick={onNext}
                className={`${isMobile ? 'w-12 h-12' : 'w-14 h-14 sm:w-20 sm:h-20'} rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-secondary hover:text-primary transition-all duration-500 pointer-events-auto shadow-2xl group`}
              >
                <ChevronRight className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6 sm:w-8 sm:h-8'} group-hover:translate-x-1 transition-transform`} />
              </button>
            </div>

            {/* Close Button */}
            <button
              className={`absolute ${isMobile ? 'top-4 right-4 p-2' : 'top-6 right-6 sm:top-8 sm:right-8 p-3 sm:p-4'} bg-white/5 text-white rounded-full hover:bg-secondary hover:text-primary transition-all duration-500 pointer-events-auto border border-white/10 shadow-2xl`}
              onClick={onClose}
            >
              <X className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5 sm:w-6 sm:h-6'}`} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        key={image.id}
        initial={isMobile ? { opacity: 0, scale: 0.98 } : { opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={isMobile ? { opacity: 0, scale: 0.98 } : { opacity: 0, scale: 0.95, y: 20 }}
        transition={isMobile ? { duration: 0.2 } : { type: "spring", stiffness: 300, damping: 30 }}
        className={`relative flex flex-col items-center z-[110] ${isMobile ? 'w-full' : 'max-w-6xl w-full max-h-[90vh]'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`relative w-full overflow-hidden bg-black/40 ${
          isMobile 
            ? 'aspect-[4/5] rounded-none border-y border-white/5 shadow-none' 
            : 'aspect-video sm:aspect-auto sm:h-[65vh] rounded-[2rem] sm:rounded-[3rem] shadow-[0_40px_120px_rgba(0,0,0,0.9)] border border-white/10'
        }`}>
          <img 
            src={optimizeUrl(image.imageUrl, { width: isMobile ? 800 : 1600, quality: isMobile ? 60 : 80 })} 
            alt={image.title}
            className={`w-full h-full object-contain transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            referrerPolicy="no-referrer"
            loading="eager"
            fetchPriority="high"
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Mobile Loading Indicator - Minimal */}
          {!imageLoaded && isMobile && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-secondary/20 border-t-secondary rounded-full animate-spin" />
            </div>
          )}
        </div>
        
        {/* Metadata & Caption - Delayed on Mobile */}
        <AnimatePresence>
          {imageLoaded && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${isMobile ? 'mt-6 px-6' : 'mt-8 sm:mt-12'} text-center max-w-4xl sm:px-8`}
            >
              <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <span className="text-secondary font-black tracking-[0.5em] uppercase text-[8px] sm:text-[10px] bg-secondary/10 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full border border-secondary/20">
                  {image.state}
                </span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span className="text-slate-500 font-bold tracking-[0.2em] uppercase text-[8px] sm:text-[10px]">
                  {image.createdAt ? new Date(image.createdAt.toDate()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recent Moment'}
                </span>
              </div>
              <h3 className={`${isMobile ? 'text-xl' : 'text-2xl sm:text-6xl'} font-serif text-white mb-4 sm:mb-8 tracking-tight leading-tight`}>
                {cleanTitle(image.title) || "Ministry Moment"}
              </h3>
              {image.caption && (
                <p className={`${isMobile ? 'text-sm' : 'text-base sm:text-2xl'} text-slate-400 font-light leading-relaxed italic max-w-3xl mx-auto`}>
                  "{image.caption}"
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
