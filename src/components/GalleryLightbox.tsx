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
  if (!image) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-primary/98 backdrop-blur-3xl"
      onClick={onClose}
    >
      {/* Navigation Arrows */}
      <div className="absolute inset-x-4 sm:inset-x-12 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-[120]">
        <button
          onClick={onPrev}
          className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-secondary hover:text-primary transition-all duration-500 pointer-events-auto shadow-2xl group"
        >
          <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 group-hover:-translate-x-1 transition-transform" />
        </button>
        <button
          onClick={onNext}
          className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-secondary hover:text-primary transition-all duration-500 pointer-events-auto shadow-2xl group"
        >
          <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <button
        className="absolute top-6 right-6 sm:top-8 sm:right-8 p-3 sm:p-4 bg-white/5 text-white rounded-full hover:bg-secondary hover:text-primary transition-all duration-500 z-[130] border border-white/10 shadow-2xl"
        onClick={onClose}
      >
        <X className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <motion.div
        key={image.id}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative max-w-6xl w-full max-h-[90vh] flex flex-col items-center z-[110]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full aspect-video sm:aspect-auto sm:h-[65vh] rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.9)] border border-white/10 bg-black/40">
          <img 
            src={optimizeUrl(image.imageUrl, { width: 1600, quality: 80 })} 
            alt={image.title}
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
            loading="eager"
            fetchPriority="high"
          />
        </div>
        
        <div className="mt-8 sm:mt-12 text-center max-w-4xl px-4 sm:px-8">
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <span className="text-secondary font-black tracking-[0.5em] uppercase text-[8px] sm:text-[10px] bg-secondary/10 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full border border-secondary/20">
              {image.state}
            </span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="text-slate-500 font-bold tracking-[0.2em] uppercase text-[8px] sm:text-[10px]">
              {image.createdAt ? new Date(image.createdAt.toDate()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recent Moment'}
            </span>
          </div>
          <h3 className="text-2xl sm:text-6xl font-serif text-white mb-4 sm:mb-8 tracking-tight leading-tight">
            {cleanTitle(image.title) || "Ministry Moment"}
          </h3>
          {image.caption && (
            <p className="text-slate-400 font-light text-base sm:text-2xl leading-relaxed italic max-w-3xl mx-auto">
              "{image.caption}"
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
