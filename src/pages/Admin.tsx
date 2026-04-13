import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { LogIn, Loader2, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth';
import { auth } from '../firebase';
import SermonInput from '../components/SermonInput';
import AdminSermonDashboard from '../components/AdminSermonDashboard';
import StateGalleryManager from '../components/StateGalleryManager';

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error('Login error:', err);
      setError('Failed to log in. ' + err.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex justify-center items-center bg-primary">
        <Loader2 className="w-12 h-12 animate-spin text-secondary" aria-hidden="true" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col justify-center items-center bg-primary text-center px-4">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(192,160,96,0.05),transparent_70%)]" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center">
          <ShieldAlert className="w-16 h-16 text-secondary mb-6" aria-hidden="true" />
          <h2 className="text-3xl sm:text-4xl font-serif text-white mb-4">Admin Access Required</h2>
          <p className="text-slate-300 font-light mb-10 max-w-md leading-relaxed">
            You must be logged in as an authorized administrator to access the sermon management dashboard and AI tools.
          </p>
          
          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm max-w-md">
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="premium-button inline-flex items-center disabled:opacity-70 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="w-5 h-5 mr-3 animate-spin" aria-hidden="true" />
                Authenticating...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5 mr-3" aria-hidden="true" />
                Open Admin Dashboard
              </>
            )}
          </button>
          
          <p className="mt-8 text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">
            Secure Login via Google Authentication
          </p>
        </div>
      </div>
    );
  }

  // Authorization check
  const isAuthorized = user.email === 'officialgiganticcomputers@gmail.com';

  if (!isAuthorized) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col justify-center items-center bg-primary text-center px-4">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-6" aria-hidden="true" />
        <h2 className="text-3xl sm:text-4xl font-serif text-white mb-4">Access Denied</h2>
        <p className="text-slate-300 font-light mb-10 max-w-md leading-relaxed">
          The account <span className="text-secondary font-medium">{user.email}</span> is not authorized to access the management portal.
        </p>
        <div className="flex flex-col items-center space-y-6">
          <button 
            onClick={() => auth.signOut()}
            className="premium-button inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
          >
            Sign Out & Try Another Account
          </button>
          <Link to="/" className="text-slate-500 hover:text-secondary transition-colors text-xs uppercase tracking-widest font-bold">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 bg-primary min-h-screen">
      <section className="relative py-12 sm:py-20 bg-primary overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(192,160,96,0.1),transparent_70%)]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-secondary font-bold tracking-[0.3em] uppercase text-[10px] sm:text-xs mb-4 block"
          >
            Management Portal
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-serif text-white mb-6"
          >
            Admin <span className="gold-gradient-text italic">Dashboard</span>
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center text-slate-300 font-light space-x-4"
          >
            <span>Logged in as {user.email}</span>
            <button 
              onClick={() => auth.signOut()}
              className="text-secondary hover:text-white transition-colors text-sm underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded-sm"
            >
              Sign Out
            </button>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <SermonInput />
        <StateGalleryManager />
        <AdminSermonDashboard />
      </div>
    </div>
  );
}
