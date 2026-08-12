import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { updateProfile } from 'firebase/auth';
import { X, Check } from 'lucide-react';
import { auth } from '../firebase/config';

const EditProfileModal = ({ isOpen, onClose, user }) => {
  const [name, setName] = useState(user?.displayName || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name cannot be empty.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await updateProfile(auth.currentUser, { displayName: name.trim() });
      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
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
            {/* Window Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(0,0,0,0.05)] dark:border-white/5 bg-[rgba(255,255,255,0.4)] dark:bg-white/5">
              <div className="flex items-center gap-2">
                <button 
                  onClick={onClose}
                  className="w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/80 flex items-center justify-center border border-[#e0443e] cursor-pointer group"
                >
                  <X size={8} className="opacity-0 group-hover:opacity-100 text-[#4c0000] transition-opacity" />
                </button>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]" />
              </div>
              <div className="text-xs font-medium text-[#0f172a]/40 dark:text-slate-100/40 select-none">
                Edit Profile
              </div>
              <div className="w-12" /> {/* spacer for center alignment */}
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold tracking-tight mb-2">Profile Settings</h2>
                <p className="text-sm text-[#0f172a]/60 dark:text-slate-100/60">
                  Update your personal information
                </p>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#0f172a]/80 dark:text-slate-100/80">Display Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(255,255,255,0.05)] border border-[rgba(0,0,0,0.1)] dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/30 focus:border-[#0ea5e9]/50 transition-all text-[#0f172a] dark:text-slate-100 placeholder:text-[#0f172a]/30 dark:placeholder:text-slate-100/30"
                  />
                </div>

                {error && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium">
                    {error}
                  </motion.div>
                )}
                
                {success && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-center gap-2">
                    <Check size={16} /> {success}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-[#0f172a] dark:bg-white text-white dark:text-[#0f172a] rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center shadow-md disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin" />
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EditProfileModal;
