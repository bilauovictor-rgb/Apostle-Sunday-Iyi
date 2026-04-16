import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
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
  );
}
