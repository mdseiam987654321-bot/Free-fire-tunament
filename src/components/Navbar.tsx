import React, { useState } from 'react';
import {
  ShieldCheck,
  Gamepad2,
  Wallet,
  Bell,
  Search,
  Globe,
  User,
  PlusCircle,
  Sparkles,
  CheckCircle2,
  Lock,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

interface NavbarProps {
  onOpenListAccount: () => void;
  onOpenWallet: () => void;
  onOpenOrders: () => void;
  onOpenAdmin: () => void;
  onOpenKyc: () => void;
  onOpenReferral: () => void;
  onOpenProfile: () => void;
  onOpenChat: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenListAccount,
  onOpenWallet,
  onOpenOrders,
  onOpenAdmin,
  onOpenKyc,
  onOpenReferral,
  onOpenProfile,
  onOpenChat,
  searchQuery,
  setSearchQuery,
}) => {
  const {
    currentUser,
    switchRole,
    lang,
    setLang,
    t,
    notifications,
    markNotificationRead,
    officialPaymentNumber
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const unreadCount = notifications.filter((n) => n.userId === currentUser.id && !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-[#0B0F19]/90 backdrop-blur-md border-b border-blue-900/40 text-white transition-all">
      {/* Top Ticker Bar */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 py-1 px-4 border-b border-blue-900/30 text-xs text-blue-200/90 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-medium text-emerald-400">100% Escrow Protected:</span>
          <span className="hidden sm:inline">Buyer pays first → Admin verifies → Credentials delivered → Payment released to seller</span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 bg-blue-900/40 px-2 py-0.5 rounded border border-blue-700/40">
            <span className="text-blue-300 font-bold">bKash/Nagad:</span>
            <span className="text-amber-300 font-extrabold">{officialPaymentNumber}</span>
          </div>

          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
            className="flex items-center gap-1 text-slate-300 hover:text-cyan-400 transition cursor-pointer font-sans"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold uppercase">{lang}</span>
            <span className="text-[10px] text-slate-400">({lang === 'en' ? 'বাংলা' : 'English'})</span>
          </button>
        </div>
      </div>

      {/* Main Header Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-[#0F172A] border border-blue-500/40 rounded-xl p-2.5 flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg sm:text-xl font-black tracking-tight bg-gradient-to-r from-white via-blue-100 to-cyan-400 bg-clip-text text-transparent uppercase font-mono">
                {t.appName}
              </span>
              <span className="bg-blue-600/30 text-cyan-300 border border-cyan-500/40 text-[10px] px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wider">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">FF Account Escrow Marketplace</p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md hidden md:block relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-slate-900/80 border border-blue-900/60 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition shadow-inner"
          />
        </div>

        {/* Right Actions & Navigation */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Role Switcher (For Demo & Testing) */}
          <div className="hidden lg:flex items-center bg-slate-900/90 border border-blue-900/60 p-1 rounded-xl text-xs font-medium">
            <span className="text-[10px] text-slate-400 uppercase font-bold px-2">Role:</span>
            {(['buyer', 'seller', 'admin'] as UserRole[]).map((role) => (
              <button
                key={role}
                onClick={() => switchRole(role)}
                className={`px-2.5 py-1 rounded-lg capitalize transition cursor-pointer font-mono ${
                  currentUser.role === role
                    ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          {/* Wallet Balance Badge */}
          <button
            onClick={onOpenWallet}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-900/50 to-slate-900 border border-cyan-500/30 hover:border-cyan-400 px-3 py-1.5 rounded-xl transition cursor-pointer shadow-sm group"
          >
            <Wallet className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition" />
            <div className="text-left">
              <span className="text-[10px] text-slate-400 block leading-tight">{t.wallet}</span>
              <span className="text-xs font-bold text-emerald-400 font-mono">{currentUser.walletBalance} BDT</span>
            </div>
          </button>

          {/* List Account Button (Seller feature) */}
          <button
            onClick={onOpenListAccount}
            className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-lg shadow-blue-600/20 transition hover:scale-105 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t.listAccount}</span>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 bg-slate-900/90 border border-blue-900/60 hover:border-cyan-500/50 rounded-xl text-slate-300 hover:text-cyan-400 transition relative cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-blue-800/60 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <Bell className="w-4 h-4 text-cyan-400" /> Notifications
                  </h4>
                  <span className="text-xs text-slate-400">{notifications.length} Total</span>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60 my-2 space-y-1">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">No notifications yet.</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationRead(n.id);
                          if (n.type === 'payment' || n.type === 'order') {
                            onOpenOrders();
                          }
                          setShowNotifications(false);
                        }}
                        className={`p-2.5 rounded-xl text-xs transition cursor-pointer ${
                          n.read ? 'bg-slate-900/40 text-slate-400' : 'bg-blue-950/40 border-l-2 border-cyan-400 text-slate-200'
                        }`}
                      >
                        <div className="font-bold text-cyan-300 mb-0.5">{n.title}</div>
                        <p className="text-slate-300 leading-snug">{n.message}</p>
                        <span className="text-[10px] text-slate-500 mt-1 block">
                          {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 p-1.5 bg-slate-900/90 border border-blue-900/60 hover:border-cyan-500/50 rounded-xl transition cursor-pointer"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.username}
                className="w-7 h-7 rounded-lg object-cover ring-2 ring-cyan-500/40"
              />
              <span className="text-xs font-bold text-slate-200 hidden md:block max-w-[100px] truncate font-mono">
                {currentUser.username}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-[#0F172A] border border-blue-800/80 rounded-2xl shadow-2xl py-2 z-50 divide-y divide-slate-800">
                <div className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white truncate">{currentUser.username}</span>
                    {currentUser.verifiedSeller && (
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" title="Trusted Seller" />
                    )}
                  </div>
                  <span className="text-xs text-cyan-400 font-mono capitalize font-bold">{currentUser.role} Mode</span>
                </div>

                <div className="py-1 text-xs text-slate-300">
                  <button
                    onClick={() => {
                      onOpenOrders();
                      setShowUserDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-blue-900/30 flex items-center gap-2.5 transition cursor-pointer"
                  >
                    <Gamepad2 className="w-4 h-4 text-blue-400" /> {t.myOrders}
                  </button>

                  <button
                    onClick={() => {
                      onOpenChat();
                      setShowUserDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-blue-900/30 flex items-center gap-2.5 transition cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" /> {t.chat}
                  </button>

                  <button
                    onClick={() => {
                      onOpenKyc();
                      setShowUserDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-blue-900/30 flex items-center gap-2.5 transition cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> {t.sellerVerification}
                  </button>

                  <button
                    onClick={() => {
                      onOpenReferral();
                      setShowUserDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-blue-900/30 flex items-center gap-2.5 transition cursor-pointer"
                  >
                    <Globe className="w-4 h-4 text-purple-400" /> {t.referral} & {t.coupons}
                  </button>

                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => {
                        onOpenAdmin();
                        setShowUserDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 bg-gradient-to-r from-red-950/60 to-slate-900 hover:from-red-900/80 font-bold text-red-300 flex items-center gap-2.5 transition cursor-pointer border-t border-b border-red-900/40 my-1"
                    >
                      <Lock className="w-4 h-4 text-red-400" /> {t.adminPanel}
                    </button>
                  )}

                  <button
                    onClick={() => {
                      onOpenProfile();
                      setShowUserDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-blue-900/30 flex items-center gap-2.5 transition cursor-pointer"
                  >
                    <User className="w-4 h-4 text-cyan-400" /> {t.profile}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
