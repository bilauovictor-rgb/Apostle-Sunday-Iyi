import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Download, FileText, ChevronRight, BookOpen, Info } from 'lucide-react';

// Lesson data - Update these with actual content from the manual
const LESSONS = [
  { id: 1, title: "The Apostolic Mandate: Reconciling Nations", page: 1, description: "Understanding the core mission of the end-time church." },
  { id: 2, title: "Spiritual Authority & Kingdom Governance", page: 8, description: "Walking in the power and order of the heavenly realm." },
  { id: 3, title: "The Ministry of Reconciliation", page: 15, description: "Bridging the gap between humanity and divinity." },
  { id: 4, title: "Kingdom Stewardship & Divine Honor", page: 22, description: "Principles for managing heavenly resources on earth." },
  { id: 5, title: "Prophetic Activation & Manifestation", page: 29, description: "Activating the gifts of the Spirit for global impact." },
];

export default function SundaySchoolManual() {
  const [activePage, setActivePage] = useState(1);
  const [isNavigating, setIsNavigating] = useState(false);

  const basePreviewUrl = "https://drive.google.com/file/d/1DxsIMSAJy1bG6-MpSuVDbbm-g77_Mcb4/preview";
  const downloadUrl = "https://drive.google.com/uc?export=download&id=1DxsIMSAJy1bG6-MpSuVDbbm-g77_Mcb4";
  const fullScreenBaseUrl = "https://drive.google.com/file/d/1DxsIMSAJy1bG6-MpSuVDbbm-g77_Mcb4/view";

  // Construct URL with page parameter for the iframe
  const previewUrl = `${basePreviewUrl}?page=${activePage}`;

  const handleJumpToPage = (page: number) => {
    if (page === activePage) return;
    setIsNavigating(true);
    setActivePage(page);
    // Brief timeout to show transition
    setTimeout(() => setIsNavigating(false), 600);
  };

  return (
    <div className="pt-20 bg-primary min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(192,160,96,0.1),transparent_70%)]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-secondary font-bold tracking-[0.3em] uppercase text-[10px] sm:text-xs mb-6 block"
          >
            Study to Show Thyself Approved
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-serif text-white mb-6 uppercase tracking-tight"
          >
            Sunday School <span className="gold-gradient-text italic">Manual</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-light"
          >
            Access the official weekly teaching manual. Dive deep into the word and equip yourself for the work of the ministry.
          </motion.p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Top Action Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 p-6 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h2 className="text-white font-serif text-xl tracking-tight">Weekly Lesson <span className="gold-gradient-text italic">Navigator</span></h2>
                <p className="text-slate-400 text-xs font-light">Select a lesson to jump to its section</p>
              </div>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <a 
                href={downloadUrl}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-primary rounded-xl font-bold uppercase tracking-widest text-[10px] hover:shadow-[0_0_20px_rgba(192,160,96,0.3)] transition-all duration-300"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left: Lesson Index */}
            <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
              <div className="space-y-4">
                {LESSONS.map((lesson, idx) => (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative group"
                  >
                    <button
                      onClick={() => handleJumpToPage(lesson.page)}
                      className={`w-full text-left p-5 rounded-2xl border transition-all duration-500 relative overflow-hidden ${
                        activePage === lesson.page 
                          ? 'bg-secondary/10 border-secondary/50 shadow-[0_0_25px_rgba(192,160,96,0.1)]' 
                          : 'bg-white/[0.03] border-white/5 hover:border-secondary/30 hover:bg-white/[0.05]'
                      }`}
                    >
                      {/* Active Indicator */}
                      {activePage === lesson.page && (
                        <motion.div 
                          layoutId="active-lesson"
                          className="absolute left-0 top-0 w-1 h-full bg-secondary"
                        />
                      )}
                      
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 rounded bg-secondary/20 text-secondary text-[9px] font-bold uppercase tracking-widest">
                              Page {lesson.page}
                            </span>
                            {activePage === lesson.page && (
                              <span className="text-[9px] text-secondary font-medium animate-pulse">Currently Viewing</span>
                            )}
                          </div>
                          <h3 className={`text-base font-serif tracking-tight mb-2 transition-colors ${activePage === lesson.page ? 'text-secondary' : 'text-white'}`}>
                            {lesson.title}
                          </h3>
                          <p className="text-slate-400 text-xs font-light leading-relaxed line-clamp-2">
                            {lesson.description}
                          </p>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                          <ChevronRight className={`w-5 h-5 transition-transform duration-500 ${activePage === lesson.page ? 'text-secondary translate-x-1' : 'text-slate-700 group-hover:text-secondary/50'}`} />
                          <a 
                            href={`${fullScreenBaseUrl}#page=${lesson.page}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 rounded-lg bg-white/5 text-slate-500 hover:bg-secondary hover:text-primary transition-all duration-300"
                            title="Open this lesson in new tab"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* Reliability Note */}
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 flex items-start gap-4">
                <Info className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-500 leading-relaxed italic">
                  Note: If the viewer does not automatically jump to the section, please use the <span className="text-secondary font-bold">Page Number</span> indicated on the lesson card to scroll manually.
                </p>
              </div>
            </div>

            {/* Right: The Viewer */}
            <div className="lg:col-span-8 order-1 lg:order-2">
              <div className="relative">
                {/* Viewer Header */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 px-6 py-2 rounded-full bg-primary/80 backdrop-blur-md border border-white/10 shadow-2xl flex items-center gap-3 pointer-events-none">
                  <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Live Document Viewer</span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div 
                    key={activePage}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="relative bg-black/40 border border-white/10 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.5)] overflow-visible"
                  >
                    {isNavigating && (
                      <div className="absolute inset-0 z-20 bg-primary/60 backdrop-blur-md flex flex-col items-center justify-center rounded-[2.5rem]">
                        <div className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full animate-spin mb-4" />
                        <span className="text-secondary font-bold tracking-widest text-[10px] uppercase">Navigating to Page {activePage}...</span>
                      </div>
                    )}
                    <iframe 
                      src={previewUrl}
                      className="w-full min-h-[65vh] md:min-h-[75vh] lg:min-h-[850px] border-none rounded-[2.5rem]"
                      allow="autoplay"
                      title="Sunday School Manual Viewer"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Full Screen Fallback Overlay */}
                <div className="mt-8 flex justify-center">
                  <a 
                    href={fullScreenBaseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 text-slate-400 hover:text-secondary transition-colors text-xs font-medium group"
                  >
                    <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>Having trouble viewing? Open Full Screen Manual</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
