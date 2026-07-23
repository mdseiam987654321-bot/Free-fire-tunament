import React, { useState } from 'react';
import { X, Globe, Copy, Check, Tag, Gift, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ReferralCouponModalProps {
  onClose: () => void;
}

export const ReferralCouponModal: React.FC<ReferralCouponModalProps> = ({ onClose }) => {
  const { currentUser, coupons, t } = useApp();
  const [copied, setCopied] = useState(false);

  const referralLink = `${window.location.origin}?ref=${currentUser.referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
      <div className="bg-[#0F172A] border border-blue-900/90 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative text-white my-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-950/80 rounded-xl border border-purple-500/40">
              <Gift className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">{t.referral} & Active Coupons</h3>
              <p className="text-xs text-slate-400">Earn Rewards & Save Money</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-slate-900 border border-slate-800 hover:border-cyan-500 rounded-xl text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Referral Card */}
        <div className="bg-gradient-to-br from-purple-950/80 via-slate-900 to-blue-950 border border-purple-500/40 p-5 rounded-2xl space-y-3 font-mono">
          <div className="flex items-center justify-between">
            <span className="text-xs text-purple-300 font-bold uppercase">Your Invite Code</span>
            <span className="text-xs bg-purple-900/60 px-2 py-0.5 rounded text-purple-200">100 BDT Reward</span>
          </div>

          <div className="bg-slate-950 border border-purple-900/80 p-3 rounded-xl flex items-center justify-between">
            <span className="text-xl font-black text-amber-300 tracking-wider select-all">{currentUser.referralCode}</span>
            <button
              onClick={handleCopyLink}
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer font-sans"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Link'}</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
            Invite friends to trade Free Fire accounts. You get <span className="text-emerald-400 font-bold">100 BDT wallet bonus</span> after their first completed order!
          </p>
        </div>

        {/* Active Coupons List */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-cyan-400 font-mono uppercase flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-cyan-400" /> Available Promo Coupons
          </h4>

          <div className="space-y-2">
            {coupons.map((c) => (
              <div key={c.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between font-mono">
                <div>
                  <span className="text-xs font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                    {c.code}
                  </span>
                  <span className="text-xs text-slate-300 ml-2">
                    {c.discountPercent ? `${c.discountPercent}% OFF` : `${c.fixedDiscount} BDT OFF`}
                  </span>
                </div>

                <span className="text-[10px] text-slate-400">Exp: {c.expiryDate}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
