import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ScrollToTopButton from './components/ScrollToTopButton';
import ChatAssistant from './components/ChatAssistant';
import Home from './pages/Home';
import About from './pages/About';
import Mission from './pages/Mission';
import Teachings from './pages/Teachings';
import Contact from './pages/Contact';
import SpeakingInvitations from './pages/SpeakingInvitations';
import MinistryPartnership from './pages/MinistryPartnership';
import GSOMAdmissions from './pages/GSOMAdmissions';

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <ScrollToTopButton />
      <ChatAssistant />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/mission" element={<Mission />} />
            <Route path="/teachings" element={<Teachings />} />
            <Route path="/connect" element={<Contact />} />
            <Route path="/speaking-invitations" element={<SpeakingInvitations />} />
            <Route path="/ministry-partnership" element={<MinistryPartnership />} />
            <Route path="/gsom-admissions" element={<GSOMAdmissions />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
