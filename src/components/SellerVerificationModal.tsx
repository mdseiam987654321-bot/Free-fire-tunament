import React, { useState } from 'react';
import { X, ShieldCheck, Upload, CheckCircle2, AlertCircle, Phone } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SellerVerificationModalProps {
  onClose: () => void;
}

export const SellerVerificationModal: React.FC<SellerVerificationModalProps> = ({ onClose }) => {
  const { currentUser, submitKycVerification, t } = useApp();

  const [idNumber, setIdNumber] = useState('');
  const [idDocumentUrl, setIdDocumentUrl] = useState('https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=500&auto=format&fit=crop&q=80');
  const [selfieUrl, setSelfieUrl] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idNumber.trim()) {
      alert("Please enter NID or Passport Number!");
      return;
    }

    submitKycVerification(idDocumentUrl, selfieUrl, idNumber);
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
      <div className="bg-[#0F172A] border border-blue-900/90 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative text-white my-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-950/80 rounded-xl border border-emerald-500/40">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">{t.sellerVerification}</h3>
              <p className="text-xs text-slate-400">Get Trusted Seller Badge</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-slate-900 border border-slate-800 hover:border-cyan-500 rounded-xl text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {currentUser.verifiedSeller ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-500/20 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-black text-emerald-400 font-mono">YOU ARE A TRUSTED SELLER!</h4>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              Your NID and selfie verification are approved. The Trusted Seller badge is displayed on all your Free Fire listings.
            </p>
          </div>
        ) : isSubmitted || currentUser.kycStatus === 'pending' ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 bg-amber-500/20 border-2 border-amber-500 rounded-full flex items-center justify-center mx-auto text-amber-400 shadow-xl shadow-amber-500/20">
              <ShieldCheck className="w-8 h-8 animate-pulse" />
            </div>
            <h4 className="text-lg font-black text-amber-300 font-mono">KYC UNDER ADMIN REVIEW</h4>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              Your NID document and selfie submission have been received. Admin will verify within 1-2 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-slate-900 border border-blue-900/60 p-3 rounded-2xl text-xs text-slate-300 leading-relaxed">
              ⚡ <span className="font-bold text-cyan-300">Why verify?</span> Verified sellers gain 5x higher buyer trust, higher search ranking, and instant payout approvals!
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 font-mono uppercase">NID / Passport Number</label>
              <input
                type="text"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder="e.g. BD-NID-1982938190"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 font-mono uppercase flex items-center gap-1">
                <Upload className="w-3.5 h-3.5 text-cyan-400" /> Upload NID / Passport Document
              </label>
              <input
                type="text"
                value={idDocumentUrl}
                onChange={(e) => setIdDocumentUrl(e.target.value)}
                placeholder="Paste document image URL"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 font-mono uppercase flex items-center gap-1">
                <Upload className="w-3.5 h-3.5 text-cyan-400" /> Upload Selfie Verification
              </label>
              <input
                type="text"
                value={selfieUrl}
                onChange={(e) => setSelfieUrl(e.target.value)}
                placeholder="Paste selfie image URL"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-black py-3 rounded-2xl shadow-xl transition hover:scale-105 cursor-pointer uppercase font-mono text-xs"
            >
              Submit KYC for Admin Review
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
