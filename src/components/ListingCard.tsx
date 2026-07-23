import React from 'react';
import { ShieldCheck, Heart, Eye, Flame, Trophy, ExternalLink, Zap, Star } from 'lucide-react';
import { AccountListing } from '../types';
import { useApp } from '../context/AppContext';

interface ListingCardProps {
  listing: AccountListing;
  onSelect: (listing: AccountListing) => void;
  onQuickBuy: (listing: AccountListing) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, onSelect, onQuickBuy }) => {
  const { wishlist, toggleWishlist, t } = useApp();
  const isWishlisted = wishlist.includes(listing.id);

  const maxEvoGunsCount = listing.evoGuns ? listing.evoGuns.length : 0;

  return (
    <div className="bg-[#0F172A] border border-blue-900/50 hover:border-cyan-500/60 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-blue-950/50 transition-all duration-300 flex flex-col group relative">
      {/* Top Media Preview Container */}
      <div className="relative aspect-video overflow-hidden bg-slate-950 cursor-pointer" onClick={() => onSelect(listing)}>
        <img
          src={listing.images[0] || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80'}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-black/60"></div>

        {/* Server Tag & Level Pill */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
          <span className="bg-blue-600/90 backdrop-blur-md text-white font-mono text-[10px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wide shadow-md">
            {listing.server} SERVER
          </span>
          <span className="bg-slate-900/90 text-cyan-300 border border-cyan-500/40 font-mono text-[10px] font-extrabold px-2 py-0.5 rounded-lg shadow-md">
            LVL {listing.level}
          </span>
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(listing.id);
          }}
          className="absolute top-2.5 right-2.5 z-10 p-2 bg-slate-900/80 backdrop-blur-md border border-slate-700/60 hover:border-red-500 rounded-xl text-slate-300 hover:text-red-400 transition cursor-pointer"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Badges Overlay */}
        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between z-10">
          <div className="flex items-center gap-1">
            {maxEvoGunsCount > 0 && (
              <span className="bg-amber-500/90 text-slate-950 font-mono text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1 shadow-md">
                <Flame className="w-3 h-3 fill-slate-950" /> {maxEvoGunsCount} EVO GUNS
              </span>
            )}
          </div>
          <span className="bg-slate-900/90 text-slate-300 text-[10px] px-2 py-0.5 rounded font-mono flex items-center gap-1">
            <Eye className="w-3 h-3 text-cyan-400" /> {listing.views}
          </span>
        </div>
      </div>

      {/* Account Info Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Title */}
          <h3
            onClick={() => onSelect(listing)}
            className="text-sm font-bold text-white group-hover:text-cyan-400 transition line-clamp-2 cursor-pointer leading-snug"
          >
            {listing.title}
          </h3>

          {/* Rank & Stats Highlights */}
          <div className="mt-2.5 grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="bg-slate-900/80 border border-slate-800 p-1.5 rounded-lg text-slate-300 flex items-center gap-1.5 truncate">
              <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{listing.rank}</span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-1.5 rounded-lg text-slate-300 flex items-center gap-1.5 truncate">
              <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">{listing.elitePasses} Elite Pass</span>
            </div>
          </div>

          {/* Rare Bundles Preview */}
          {listing.bundles && listing.bundles.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {listing.bundles.slice(0, 2).map((b, idx) => (
                <span key={idx} className="bg-blue-950/60 text-blue-300 border border-blue-800/40 text-[10px] px-1.5 py-0.5 rounded truncate max-w-[140px]">
                  {b}
                </span>
              ))}
              {listing.bundles.length > 2 && (
                <span className="text-[10px] text-slate-500 font-mono py-0.5">+{listing.bundles.length - 2} more</span>
              )}
            </div>
          )}
        </div>

        {/* Footer: Seller & Price & Buy Button */}
        <div className="pt-3 border-t border-slate-800/80 space-y-2.5">
          {/* Seller Tag */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 truncate">
              <img src={listing.sellerAvatar} alt={listing.sellerName} className="w-5 h-5 rounded-full object-cover ring-1 ring-cyan-500/40" />
              <span className="text-slate-300 font-medium truncate text-[11px]">{listing.sellerName}</span>
              {listing.sellerVerified && (
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" title="Verified Trusted Seller" />
              )}
            </div>

            <div className="flex items-center gap-1 text-[11px] font-mono text-amber-400">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{listing.sellerRating}</span>
            </div>
          </div>

          {/* Price & Action */}
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-xs text-slate-400 block font-mono">Price</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-black text-emerald-400 font-mono">{listing.price} BDT</span>
                {listing.originalPrice && (
                  <span className="text-xs text-slate-500 line-through font-mono">{listing.originalPrice} BDT</span>
                )}
              </div>
            </div>

            <button
              onClick={() => onQuickBuy(listing)}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md shadow-blue-600/30 transition hover:scale-105 cursor-pointer flex items-center gap-1"
            >
              <span>{t.buyNow}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
