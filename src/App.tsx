import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ScrollToTopButton from './components/ScrollToTopButton';
import Home from './pages/Home';

// Lazy load non-critical components
const ChatAssistant = lazy(() => import('./components/ChatAssistant'));
const WhatsAppPopup = lazy(() => import('./components/WhatsAppPopup'));

// Lazy load pages
const About = lazy(() => import('./pages/About'));
const Mission = lazy(() => import('./pages/Mission'));
const Teachings = lazy(() => import('./pages/Teachings'));
const Gallery = lazy(() => import('./pages/Gallery'));
const SundaySchoolManual = lazy(() => import('./pages/SundaySchoolManual'));
const SermonDetail = lazy(() => import('./pages/SermonDetail'));
const Contact = lazy(() => import('./pages/Contact'));
const SpeakingInvitations = lazy(() => import('./pages/SpeakingInvitations'));
const MinistryPartnership = lazy(() => import('./pages/MinistryPartnership'));
const GSOMAdmissions = lazy(() => import('./pages/GSOMAdmissions'));
const Admin = lazy(() => import('./pages/Admin'));

export default function App() {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Apostle Sunday Iyi | Teaching, Equipping & Transforming Lives</title>
        <meta name="description" content="Apostle Sunday Iyi is a preacher, teacher, and transformational leader committed to building faith, raising leaders, and impacting nations through biblical teaching, discipleship, leadership development, and prayer." />
        <meta name="keywords" content="Apostle Sunday Iyi, Apostolic Mandate, TRASS Humanitarian, Global School of Ministry, Christian Ministry, Teaching, Equipping, Transforming Lives" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={"https://apostlesundayiyi.com" + window.location.pathname} />
        
        <meta property="og:site_name" content="Apostle Sunday Iyi" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={"https://apostlesundayiyi.com" + window.location.pathname} />
        <meta property="og:title" content="Apostle Sunday Iyi | Teaching, Equipping & Transforming Lives" />
        <meta property="og:description" content="Apostle Sunday Iyi is a preacher, teacher, and transformational leader committed to building faith, raising leaders, and impacting nations through biblical teaching, discipleship, and prayer." />
        <meta property="og:image" content="https://res.cloudinary.com/dg5zoqaxo/image/upload/v1778169660/Apostle_Sunday_Iyi_Og_fuf85q.png" />
        <meta property="og:locale" content="en_US" />
        
        <meta name="twitter:site" content="@ApostleSundayIyi" />
        <meta name="twitter:creator" content="@ApostleSundayIyi" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Apostle Sunday Iyi | Teaching, Equipping & Transforming Lives" />
        <meta name="twitter:description" content="Apostle Sunday Iyi is a preacher, teacher, and transformational leader committed to building faith, raising leaders, and impacting nations." />
        <meta name="twitter:image" content="https://res.cloudinary.com/dg5zoqaxo/image/upload/v1778169660/Apostle_Sunday_Iyi_Og_fuf85q.png" />

        {/* Structured Data (JSON-LD) for the Person/Organization */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Sunday Iyi",
            "jobTitle": "Apostle",
            "url": "https://apostlesundayiyi.com",
            "description": "Apostle Sunday Iyi is a preacher, teacher, and transformational leader committed to building faith, raising leaders, and impacting nations.",
            "sameAs": [
              "https://twitter.com/ApostleSundayIyi",
              "https://www.facebook.com/ApostleSundayIyi",
              "https://www.youtube.com/@ApostleSundayIyi"
            ],
            "worksFor": {
              "@type": "ReligiousOrganization",
              "name": "The Redeemed Assemblies",
              "alternateName": "The Apostolic Mandate"
            }
          })}
        </script>
      </Helmet>
      <Router>
        <ScrollToTop />
        <ScrollToTopButton />
        <Suspense fallback={null}>
          <ChatAssistant />
          <WhatsAppPopup />
        </Suspense>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Suspense fallback={<div className="min-h-screen bg-primary" />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/mission" element={<Mission />} />
                <Route path="/teachings" element={<Teachings />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/resources/sunday-school-manual" element={<SundaySchoolManual />} />
                <Route path="/teachings/:sermonId" element={<SermonDetail />} />
                <Route path="/connect" element={<Contact />} />
                <Route path="/speaking-invitations" element={<SpeakingInvitations />} />
                <Route path="/ministry-partnership" element={<MinistryPartnership />} />
                <Route path="/gsom-admissions" element={<GSOMAdmissions />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </HelmetProvider>
  );
}
