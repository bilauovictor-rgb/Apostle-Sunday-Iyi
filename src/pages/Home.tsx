import { useState, lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { optimizeUnsplashUrl } from '../lib/imageUtils';

// Lazy load below-the-fold sections
const ConvictionsSection = lazy(() => import('../components/home/ConvictionsSection'));
const ExpressionsSection = lazy(() => import('../components/home/ExpressionsSection'));
const TestimonialsSection = lazy(() => import('../components/home/TestimonialsSection'));
const JoinMissionSection = lazy(() => import('../components/home/JoinMissionSection'));

export default function Home() {
  const [heroLoaded, setHeroLoaded] = useState(false);

  return (
    <div className="overflow-hidden">
      <Helmet>
        <title>Apostle Sunday Iyi | Teaching, Equipping & Transforming Lives</title>
        <meta name="description" content="Apostle Sunday Iyi is a preacher, teacher, and transformational leader committed to building faith, raising leaders, and impacting nations through biblical teaching and leadership development." />
        <link rel="canonical" href="https://apostlesundayiyi.com" />
      </Helmet>
      {/* Hero Section */}
      <section className="hero-section bg-primary">
        {/* Background Placeholder & Image */}
        <div className="absolute inset-0 z-0 bg-primary">
          {/* Lightweight Gradient Placeholder */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-[#0a192f] to-primary opacity-100"></div>

          {/* Optimized Hero Image - Loaded with high priority */}
          <img 
            onLoad={() => setHeroLoaded(true)}
            src={optimizeUnsplashUrl("https://images.unsplash.com/photo-1438232992991-995b7058bbb3", { width: 400, quality: 50 })}
            srcSet={`
              ${optimizeUnsplashUrl("https://images.unsplash.com/photo-1438232992991-995b7058bbb3", { width: 400, quality: 50 })} 400w,
              ${optimizeUnsplashUrl("https://images.unsplash.com/photo-1438232992991-995b7058bbb3", { width: 600, quality: 50 })} 600w,
              ${optimizeUnsplashUrl("https://images.unsplash.com/photo-1438232992991-995b7058bbb3", { width: 1200, quality: 70 })} 1200w,
              ${optimizeUnsplashUrl("https://images.unsplash.com/photo-1438232992991-995b7058bbb3", { width: 1600, quality: 70 })} 1600w
            `}
            sizes="(max-width: 600px) 100vw, 100vw"
            alt="Hero Background"
            className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 opacity-100"
            loading="eager"
            fetchPriority="high"
            decoding="sync"
          />

          {/* Deep Cinematic Overlays - Simplified for FCP */}
          <div className="absolute inset-0 bg-primary/80 z-10 sm:bg-primary/70"></div>
          
          {/* Subtle Texture Overlay - Hidden on Mobile & Deferred */}
          {heroLoaded && (
            <div className="absolute inset-0 opacity-[0.03] z-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] hidden sm:block"></div>
          )}
        </div>
        
        {/* Animated Light Beams - Hidden on Mobile & Deferred */}
        {heroLoaded && (
          <div className="absolute inset-0 z-20 opacity-10 pointer-events-none hidden sm:block">
            <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-secondary to-transparent blur-sm"></div>
            <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-secondary/50 to-transparent blur-sm"></div>
          </div>
        )}

        {/* Radial Glow - Hidden on Mobile & Deferred */}
        {heroLoaded && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-secondary/[0.02] rounded-full blur-[150px] pointer-events-none z-20 hidden sm:block"></div>
        )}

        <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            {/* Left Side: Content */}
            <div className="text-center lg:text-left lg:col-span-7">
              <div>
                <div className="inline-flex items-center space-x-4 mb-8">
                  <div className="h-px w-12 bg-secondary"></div>
                  <span className="text-secondary font-bold tracking-[0.5em] uppercase text-[10px] sm:text-xs drop-shadow-sm">The Apostolic Mandate</span>
                </div>
              </div>
              
              <h1 className="flex flex-col font-serif text-white leading-[0.85] mb-10 uppercase tracking-tighter">
                <span className="text-xl sm:text-3xl tracking-[0.4em] text-secondary/90 mb-6 font-serif italic drop-shadow-md">
                  Apostle
                </span>
                <span className="text-6xl sm:text-8xl md:text-[10rem] drop-shadow-2xl">Sunday</span>
                <span className="gold-gradient-text italic font-normal text-5xl sm:text-7xl md:text-[8.5rem] sm:ml-6 -mt-6 drop-shadow-2xl">Iyi</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-slate-300/90 mb-12 leading-relaxed max-w-xl mx-auto lg:mx-0 border-l-4 border-secondary/40 pl-10 italic font-light drop-shadow-lg">
                "Reconciling humanity back to God and manifesting the reality of heaven on earth through power, truth, and systemic compassion."
              </p>
              
              <div className="flex flex-wrap justify-center lg:justify-start gap-8">
                <Link 
                  to="/connect" 
                  className="premium-button flex items-center group"
                >
                  Partner With Him
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform" aria-hidden="true" />
                </Link>
                <Link 
                  to="/about" 
                  className="secondary-button flex items-center group"
                >
                  The Journey
                </Link>
              </div>
            </div>

            {/* Right Side: Portrait Card - Hidden on Mobile for LCP Optimization */}
            <div className="relative hidden lg:flex justify-center lg:justify-end mt-8 lg:mt-0 lg:col-span-5">
              <div className="relative w-full max-w-[400px] aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl group">
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent opacity-80"></div>
                <img 
                  src="https://i.ibb.co/PzmYRgM6/Apostle-4.jpg" 
                  alt="Apostle Sunday Iyi" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                
                {/* Decorative Frame */}
                <div className="absolute inset-6 border border-white/10 rounded-[2.5rem] pointer-events-none z-20"></div>
                
                {/* Centered Floating Label */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[85%] z-30">
                  <div className="glass-card py-5 px-6 rounded-2xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.5)] bg-primary/60 backdrop-blur-xl">
                    <p className="text-white font-serif italic text-lg sm:text-xl leading-snug text-center">
                      "Manifesting the reality of heaven."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Suspense fallback={<div className="h-96 bg-white" />}>
        <ConvictionsSection />
        <ExpressionsSection />
        <TestimonialsSection />
        <JoinMissionSection />
      </Suspense>
    </div>
  );
}
