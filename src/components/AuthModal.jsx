import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile, 
  linkWithCredential, 
  EmailAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  linkWithPopup
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { AlertTriangle, User, Mail, Lock, KeyRound } from 'lucide-react';
import { cn } from '../lib/utils';



const AuthModal = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [isHoveringBar, setIsHoveringBar] = useState(false);

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      if (auth.currentUser && auth.currentUser.isAnonymous) {
        await linkWithPopup(auth.currentUser, provider);
      } else {
        await signInWithPopup(auth, provider);
      }
      onClose();
    } catch (err) {
      console.error("Google Auth Error:", err);
      if (err.code === 'auth/credential-already-in-use') {
        setError("This Google account is already linked to another user.");
      } else if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        setError(err.message || "Google authentication failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignUp) {
        if (auth.currentUser && auth.currentUser.isAnonymous) {
          const credential = EmailAuthProvider.credential(email, password);
          const userCredential = await linkWithCredential(auth.currentUser, credential);
          if (name) await updateProfile(userCredential.user, { displayName: name });
        } else {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          if (name) await updateProfile(userCredential.user, { displayName: name });
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onClose();
    } catch (err) {
      let msg = "Authentication failed.";
      if (err.code === 'auth/email-already-in-use') msg = "Email already in use.";
      if (err.code === 'auth/credential-already-associated') msg = "Account already linked.";
      if (err.code === 'auth/wrong-password') msg = "Incorrect password.";
      if (err.code === 'auth/user-not-found') msg = "User not found.";
      if (err.code === 'auth/weak-password') msg = "Password too weak.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[200] p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
            style={{ background: 'rgba(2, 6, 23, 0.65)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
            onClick={onClose}
          />
          
          {/* macOS Window */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: "spring", bounce: 0.18, duration: 0.5 }}
            className="relative z-10 rounded-2xl w-full max-w-md overflow-hidden bg-[rgba(255,255,255,0.92)] dark:bg-[rgba(15,23,42,0.85)] backdrop-blur-[20px] border border-[rgba(200,210,230,0.6)] dark:border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.18)] text-[#0f172a] dark:text-slate-100"
          >
            {/* ── macOS Title Bar ── */}
            <div
              className="flex items-center px-4 h-11 relative select-none border-b border-[rgba(0,0,0,0.08)] dark:border-white/10 bg-[rgba(240,243,250,0.95)] dark:bg-slate-800/80"
              onMouseEnter={() => setIsHoveringBar(true)}
              onMouseLeave={() => setIsHoveringBar(false)}
            >
              <div className="flex gap-2">
                {/* Red — Close */}
                <button type="button" onClick={onClose}
                  className="w-3 h-3 rounded-full flex items-center justify-center"
                  style={{ background: '#ff5f57', boxShadow: '0 0 0 0.5px rgba(0,0,0,0.15)' }}
                >
                  {isHoveringBar && <span className="text-[7px] font-black text-red-900 leading-none">✕</span>}
                </button>
                {/* Yellow & Green (Disabled for this modal, purely visual for Apple aesthetic) */}
                <button type="button" disabled
                  className="w-3 h-3 rounded-full opacity-50 cursor-not-allowed"
                  style={{ background: '#febc2e', boxShadow: '0 0 0 0.5px rgba(0,0,0,0.15)' }}
                ></button>
                <button type="button" disabled
                  className="w-3 h-3 rounded-full opacity-50 cursor-not-allowed"
                  style={{ background: '#28c840', boxShadow: '0 0 0 0.5px rgba(0,0,0,0.15)' }}
                ></button>
              </div>
              <span className="absolute left-1/2 -translate-x-1/2 text-xs font-semibold tracking-wide flex items-center gap-1.5 text-[#64748b] dark:text-slate-400">
                <KeyRound size={11} /> {isSignUp ? 'Create Account' : 'Welcome Back'}
              </span>
            </div>

            <div className="p-8">
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-500/10 border border-red-500/20 text-red-600 p-3 rounded-xl text-sm mb-6 flex items-center gap-2 overflow-hidden font-medium"
                  >
                    <AlertTriangle size={16} /> {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {isSignUp && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-[#64748b] dark:text-slate-400">Name</label>
                      <div className="relative">
                        <User size={16} className="absolute left-3 top-3.5 text-[#94a3b8] dark:text-slate-400" />
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl p-3 pl-10 text-sm placeholder:text-slate-400 transition-all w-full outline-none focus:ring-2 focus:ring-sky-500/50 bg-[rgba(255,255,255,0.5)] dark:bg-slate-800/60 border border-[rgba(0,0,0,0.1)] dark:border-white/10 text-[#0f172a] dark:text-slate-200" placeholder="Your Name" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-[#64748b] dark:text-slate-400">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-3.5 text-[#94a3b8] dark:text-slate-400" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl p-3 pl-10 text-sm placeholder:text-slate-400 transition-all w-full outline-none focus:ring-2 focus:ring-sky-500/50 bg-[rgba(255,255,255,0.5)] dark:bg-slate-800/60 border border-[rgba(0,0,0,0.1)] dark:border-white/10 text-[#0f172a] dark:text-slate-200" placeholder="hello@example.com" required />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-[#64748b] dark:text-slate-400">Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-3.5 text-[#94a3b8] dark:text-slate-400" />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-xl p-3 pl-10 text-sm placeholder:text-slate-400 transition-all w-full outline-none focus:ring-2 focus:ring-sky-500/50 bg-[rgba(255,255,255,0.5)] dark:bg-slate-800/60 border border-[rgba(0,0,0,0.1)] dark:border-white/10 text-[#0f172a] dark:text-slate-200" placeholder="••••••••" required />
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(14,165,233,0.35)] bg-gradient-to-br from-sky-500 to-blue-500 hover:brightness-110"
                  >
                    {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (isSignUp ? 'Sign Up' : 'Log In')}
                  </button>
                </div>
              </form>

              <div className="relative mt-6 mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[rgba(0,0,0,0.1)] dark:border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-transparent text-[#64748b] dark:text-slate-400">Or continue with</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-[rgba(0,0,0,0.1)] dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-medium text-[#0f172a] dark:text-slate-200 shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  <path fill="none" d="M1 1h22v22H1z" />
                </svg>
                Google
              </button>

              <div className="mt-6 text-center">
                <p className="text-sm text-[#64748b] dark:text-slate-400">
                  {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                  <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-sky-500 hover:text-sky-400 font-semibold transition-colors">{isSignUp ? "Log In" : "Sign Up"}</button>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
