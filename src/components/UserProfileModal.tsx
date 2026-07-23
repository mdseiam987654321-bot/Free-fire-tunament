import React from 'react';
import { X, User as UserIcon, ShieldCheck, Star, Smartphone, Clock, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface UserProfileModalProps {
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ onClose }) => {
  const { currentUser, reviews, orders, t } = useApp();

  const myReviews = reviews.filter((r) => r.sellerId === currentUser.id);
  const completedOrders = orders.filter((o) => (o.buyerId === currentUser.id || o.sellerId === currentUser.id) && o.status === 'completed');

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
      <div className="bg-[#0F172A] border border-blue-900/90 rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl relative text-white my-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <img src={currentUser.avatar} alt={currentUser.username} className="w-12 h-12 rounded-full object-cover ring-2 ring-cyan-500/50" />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-base text-white">{currentUser.username}</h3>
                {currentUser.verifiedSeller && <ShieldCheck className="w-4 h-4 text-cyan-400" title="Trusted Seller" />}
              </div>
              <p className="text-xs text-slate-400 font-mono">{currentUser.email} • {currentUser.phone}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-slate-900 border border-slate-800 hover:border-cyan-500 rounded-xl text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Stats Grid */}
        <div className="grid grid-cols-3 gap-3 font-mono text-center">
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">Completed Trades</span>
            <span className="text-lg font-black text-cyan-400">{completedOrders.length + currentUser.totalSales}</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">Rating</span>
            <span className="text-lg font-black text-amber-400 flex items-center justify-center gap-1">
              <Star className="w-4 h-4 fill-amber-400" /> {currentUser.rating}
            </span>
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">KYC Status</span>
            <span className="text-xs font-bold text-emerald-400 uppercase block mt-1">
              {currentUser.verifiedSeller ? 'Verified' : currentUser.kycStatus}
            </span>
          </div>
        </div>

        {/* Device Login Protection Log */}
        {currentUser.deviceHistory && currentUser.deviceHistory.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-cyan-400 font-mono uppercase flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-cyan-400" /> Device Login History & Security Protection
            </h4>

            <div className="space-y-1.5 text-xs font-mono">
              {currentUser.deviceHistory.map((d, idx) => (
                <div key={idx} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-200 block">{d.device}</span>
                    <span className="text-[10px] text-slate-400">IP: {d.ip}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{d.lastLogin}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-amber-400 font-mono uppercase flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-amber-400" /> Customer Ratings & Reviews ({myReviews.length})
          </h4>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {myReviews.length === 0 ? (
              <p className="text-center text-slate-500 text-xs py-4">No reviews yet.</p>
            ) : (
              myReviews.map((r) => (
                <div key={r.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{r.buyerName}</span>
                    <span className="text-amber-400 flex items-center gap-1 font-mono">
                      <Star className="w-3 h-3 fill-amber-400" /> {r.rating}
                    </span>
                  </div>
                  <p className="text-slate-300">{r.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
