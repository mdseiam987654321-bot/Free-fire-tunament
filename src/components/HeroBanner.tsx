import React from 'react';
import { ShieldCheck, Flame, Trophy, Sparkles, Filter, CheckCircle2, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HeroBannerProps {
  selectedServer: string;
  setSelectedServer: (s: string) => void;
  selectedFilter: string;
  setSelectedFilter: (f: string) => void;
  minLevel: number;
  setMinLevel: (lvl: number) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  selectedServer,
  setSelectedServer,
  selectedFilter,
  setSelectedFilter,
  minLevel,
  setMinLevel,
  maxPrice,
  setMaxPrice
}) => {
  const { t, officialPaymentNumber } = useApp();

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#0B0F19] via-[#0F172A] to-[#0B0F19] py-8 sm:py-12 border-b border-blue-900/30">
      {/* Background Esports Glow Lines */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Text & Call to Action */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-900/60 to-cyan-950/60 border border-cyan-500/40 px-3 py-1 rounded-full text-xs font-mono font-bold text-cyan-300">
              <Zap className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              <span>FF TRUSTED MARKET V2.0 - LIVE ESCROW</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-none uppercase font-mono">
              BUY & SELL <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">FREE FIRE ACCOUNTS</span> SAFELY
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              {t.appTagline}. Powered by a strictly monitored manual bKash & Nagad escrow system. Money is only transferred to the seller after the buyer confirms login!
            </p>

            {/* Escrow Trust Features Pill */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
              <div className="bg-slate-900/80 border border-blue-900/60 p-2.5 rounded-xl flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <h5 className="text-xs font-bold text-white">Manual Verification</h5>
                  <p className="text-[10px] text-slate-400">TrxID checked by Admin</p>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-blue-900/60 p-2.5 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                <div>
                  <h5 className="text-xs font-bold text-white">Trusted Sellers</h5>
                  <p className="text-[10px] text-slate-400">KYC Verified ID</p>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-blue-900/60 p-2.5 rounded-xl flex items-center gap-2 col-span-2 sm:col-span-1">
                <Flame className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <h5 className="text-xs font-bold text-white">Fast Delivery</h5>
                  <p className="text-[10px] text-slate-400">24h Buyer Protection</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Payment Escrow Box Highlight */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-[#0F172A] to-blue-950 border border-blue-600/40 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-600 text-white font-mono text-[10px] font-extrabold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
              OFFICIAL PAYMENT NUMBER
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-900/50 rounded-xl border border-blue-500/30">
                <ShieldCheck className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Escrow Payment Gateway</h4>
                <p className="text-xs text-slate-400">bKash / Nagad / Rocket</p>
              </div>
            </div>

            <div className="bg-slate-950 border border-blue-800/60 rounded-xl p-3 mb-4 font-mono">
              <div className="text-[10px] text-slate-400 uppercase">Payment Send Money / Cashout Number:</div>
              <div className="text-xl font-black text-amber-300 tracking-wider flex items-center justify-between mt-1">
                <span>{officialPaymentNumber}</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40 font-sans">
                  Active 24/7
                </span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>Send exact amount with TrxID</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>Admin approves payment & requests seller delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>Money released only after buyer login confirmation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Server & Filter Tabs */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1 font-mono uppercase">
              <Filter className="w-3.5 h-3.5 text-cyan-400" /> Server:
            </span>
            {['ALL', 'BD', 'IN', 'SG', 'NA'].map((srv) => (
              <button
                key={srv}
                onClick={() => setSelectedServer(srv)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer font-mono ${
                  selectedServer === srv
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-cyan-400'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {srv === 'ALL' ? 'All Servers' : `${srv} Server`}
              </button>
            ))}
          </div>

          {/* Quick Categories */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'ALL', label: 'All Accounts' },
              { id: 'EVO', label: '🔥 Max Evo Guns' },
              { id: 'GRANDMASTER', label: '👑 Grandmaster' },
              { id: 'OG', label: '🌸 Sakura & HipHop' },
              { id: 'LEVEL70', label: '⚡ Level 70+' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedFilter === f.id
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                    : 'bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-cyan-400'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
