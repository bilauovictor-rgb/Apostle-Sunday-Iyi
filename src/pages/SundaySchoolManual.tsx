import { motion } from 'motion/react';
import { ExternalLink, Download, FileText } from 'lucide-react';

export default function SundaySchoolManual() {
  const previewUrl = "https://drive.google.com/file/d/1DxsIMSAJy1bG6-MpSuVDbbm-g77_Mcb4/preview";
  const downloadUrl = "https://drive.google.com/uc?export=download&id=1DxsIMSAJy1bG6-MpSuVDbbm-g77_Mcb4";
  const fullScreenUrl = "https://drive.google.com/file/d/1DxsIMSAJy1bG6-MpSuVDbbm-g77_Mcb4/view";

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

      {/* Manual Section */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <a 
              href={fullScreenUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl hover:bg-white/10 transition-all duration-300 group shadow-lg"
            >
              <ExternalLink className="w-6 h-6 text-secondary group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold uppercase tracking-[0.2em]">Open Full Screen Manual</span>
            </a>
            <a 
              href={downloadUrl}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-secondary text-primary rounded-2xl hover:shadow-[0_0_30px_rgba(192,160,96,0.4)] transition-all duration-300 group"
            >
              <Download className="w-6 h-6 group-hover:translate-y-0.5 transition-transform" />
              <span className="text-sm font-bold uppercase tracking-[0.2em]">Download Manual</span>
            </a>
          </motion.div>

          {/* Iframe Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="relative bg-white/[0.02] border border-white/10 rounded-[2rem] shadow-2xl overflow-visible"
          >
            <div className="absolute inset-0 bg-primary/20 pointer-events-none rounded-[2rem]" />
            <iframe 
              src={previewUrl}
              className="w-full min-h-[65vh] md:min-h-[75vh] lg:min-h-[900px] border-none rounded-[2rem]"
              allow="autoplay"
              title="Sunday School Manual PDF"
            />
          </motion.div>

          {/* Footer Note */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center space-y-4"
          >
            <div className="inline-flex flex-col items-center gap-2 px-8 py-4 rounded-[2rem] bg-white/5 border border-white/10 text-slate-400 text-xs sm:text-sm">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-secondary" />
                <span className="font-medium text-slate-300">Updated weekly for the global body of Christ.</span>
              </div>
              <div className="h-px w-12 bg-white/10 my-1" />
              <p className="italic opacity-80">
                This document will be updated before the end of May 21. Presently, it covers January 1 to May 21.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
