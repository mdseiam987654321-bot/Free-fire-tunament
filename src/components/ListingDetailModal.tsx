import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Flame,
  Trophy,
  Check,
  Eye,
  Star,
  ExternalLink,
  MessageSquare,
  Lock,
  Play,
  Share2,
  AlertCircle
} from 'lucide-react';
import { AccountListing } from '../types';
import { useApp } from '../context/AppContext';

interface ListingDetailModalProps {
  listing: AccountListing | null;
  onClose: () => void;
  onBuyNow: (listing: AccountListing) => void;
  onOpenChatWithSeller: (sellerId: string, listingId: string) => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  listing,
  onClose,
  onBuyNow,
  onOpenChatWithSeller
}) => {
  if (!listing) return null;

  const { reviews, t } = useApp();
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const sellerReviews = reviews.filter((r) => r.sellerId === listing.sellerId);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
      <div className="bg-[#0F172A] border border-blue-900/80 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-white my-auto">
        {/* Sticky Header Close Bar */}
        <div className="sticky top-0 z-20 bg-[#0F172A]/90 backdrop-blur-md p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 font-mono text-xs px-2.5 py-1 rounded-lg font-bold text-white uppercase">
              {listing.server} Server
            </span>
            <span className="text-xs text-slate-400 font-mono">UID: {listing.uid}</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-slate-900 border border-slate-800 hover:border-cyan-500 rounded-xl text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {/* Main Title */}
          <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">{listing.title}</h2>

          {/* Image & Video Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner">
              <img
                src={listing.images[activeImageIdx] || listing.images[0]}
                alt="Account Preview"
                className="w-full h-full object-cover"
              />

              {listing.videoUrl && (
                <a
                  href={listing.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute bottom-4 right-4 bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-2 shadow-lg transition cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" /> Watch Gameplay Video
                </a>
              )}
            </div>

            {/* Thumbnail Selectors */}
            {listing.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {listing.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 transition cursor-pointer shrink-0 ${
                      activeImageIdx === idx ? 'border-cyan-400 scale-105 shadow-md' : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Key Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900/80 border border-blue-900/40 p-3 rounded-2xl text-center">
              <span className="text-[10px] text-slate-400 font-mono block uppercase">Level</span>
              <span className="text-xl font-black text-cyan-400 font-mono">{listing.level}</span>
            </div>

            <div className="bg-slate-900/80 border border-blue-900/40 p-3 rounded-2xl text-center">
              <span className="text-[10px] text-slate-400 font-mono block uppercase">Rank</span>
              <span className="text-sm font-bold text-amber-400 font-mono block truncate">{listing.rank}</span>
            </div>

            <div className="bg-slate-900/80 border border-blue-900/40 p-3 rounded-2xl text-center">
              <span className="text-[10px] text-slate-400 font-mono block uppercase">Evo Guns</span>
              <span className="text-xl font-black text-amber-400 font-mono">{listing.evoGuns?.length || 0} Max</span>
            </div>

            <div className="bg-slate-900/80 border border-blue-900/40 p-3 rounded-2xl text-center">
              <span className="text-[10px] text-slate-400 font-mono block uppercase">Elite Passes</span>
              <span className="text-xl font-black text-emerald-400 font-mono">{listing.elitePasses}</span>
            </div>
          </div>

          {/* Evo Guns Detailed List */}
          {listing.evoGuns && listing.evoGuns.length > 0 && (
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-amber-400 font-mono uppercase flex items-center gap-1.5">
                <Flame className="w-4 h-4 fill-amber-400" /> Evo Guns Collection
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {listing.evoGuns.map((gun, idx) => (
                  <div key={idx} className="bg-slate-950 border border-blue-900/30 p-2.5 rounded-xl flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">{gun.name}</span>
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                      LVL {gun.level}/{gun.maxLevel}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bundles & Characters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl space-y-2">
              <h4 className="text-xs font-bold text-cyan-400 font-mono uppercase">Rare Outfits & Bundles</h4>
              <div className="flex flex-wrap gap-1.5">
                {listing.bundles.map((b, idx) => (
                  <span key={idx} className="bg-blue-950 text-cyan-300 border border-blue-800 text-xs px-2 py-1 rounded-lg">
                    {b}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl space-y-2">
              <h4 className="text-xs font-bold text-cyan-400 font-mono uppercase">Characters Unlocked</h4>
              <div className="flex flex-wrap gap-1.5">
                {listing.characters.map((c, idx) => (
                  <span key={idx} className="bg-slate-950 text-slate-300 border border-slate-800 text-xs px-2 py-1 rounded-lg">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl space-y-2">
            <h4 className="text-xs font-bold text-slate-400 font-mono uppercase">Seller Description</h4>
            <p className="text-xs sm:text-sm text-slate-300 whitespace-pre-line leading-relaxed">{listing.description}</p>
          </div>

          {/* Credentials Privacy Banner */}
          <div className="bg-gradient-to-r from-blue-950/80 to-slate-900 border border-blue-700/50 p-3.5 rounded-2xl flex items-center gap-3">
            <Lock className="w-6 h-6 text-cyan-400 shrink-0" />
            <div className="text-xs">
              <h5 className="font-bold text-white">Escrow Security Guarantee</h5>
              <p className="text-slate-400">{t.accountDetailsHidden}</p>
            </div>
          </div>

          {/* Seller Profile Card & Chat Button */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <img
                src={listing.sellerAvatar}
                alt={listing.sellerName}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-cyan-500/50"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-white">{listing.sellerName}</span>
                  {listing.sellerVerified && (
                    <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" title="Trusted Seller" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                  <span className="flex items-center gap-1 text-amber-400 font-mono">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {listing.sellerRating}
                  </span>
                  <span>•</span>
                  <span>{sellerReviews.length} Reviews</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onOpenChatWithSeller(listing.sellerId, listing.id)}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 transition cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>Chat with Seller</span>
            </button>
          </div>

          {/* Price & Buy Now Sticky Banner */}
          <div className="sticky bottom-0 bg-[#0F172A] border-t border-slate-800 pt-4 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 block font-mono">Total Account Price</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">{listing.price} BDT</span>
            </div>

            <button
              onClick={() => onBuyNow(listing)}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-sm px-6 py-3 rounded-2xl shadow-xl shadow-cyan-500/20 transition hover:scale-105 cursor-pointer flex items-center gap-2"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>{t.buyNow} (Escrow Protected)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
