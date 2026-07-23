import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { HeroBanner } from './components/HeroBanner';
import { ListingCard } from './components/ListingCard';
import { ListingDetailModal } from './components/ListingDetailModal';
import { PaymentModal } from './components/PaymentModal';
import { EscrowOrderFlowModal } from './components/EscrowOrderFlowModal';
import { CreateListingModal } from './components/CreateListingModal';
import { AdminPanel } from './components/AdminPanel';
import { SellerVerificationModal } from './components/SellerVerificationModal';
import { WalletModal } from './components/WalletModal';
import { SecureChat } from './components/SecureChat';
import { ReferralCouponModal } from './components/ReferralCouponModal';
import { UserProfileModal } from './components/UserProfileModal';
import { AccountListing, Order } from './types';
import { ShieldCheck, Flame, Trophy, Search, Heart, Sparkles, Filter, Gamepad2 } from 'lucide-react';

function MainApp() {
  const {
    listings,
    orders,
    wishlist,
    currentUser,
    t
  } = useApp();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServer, setSelectedServer] = useState('ALL');
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [minLevel, setMinLevel] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [activeTab, setActiveTab] = useState<'home' | 'wishlist' | 'orders'>('home');

  // Modals state
  const [selectedListing, setSelectedListing] = useState<AccountListing | null>(null);
  const [paymentListing, setPaymentListing] = useState<AccountListing | null>(null);
  const [activeEscrowOrder, setActiveEscrowOrder] = useState<Order | null>(null);

  const [showListAccount, setShowListAccount] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showKyc, setShowKyc] = useState(false);
  const [showReferral, setShowReferral] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatOrderId, setChatOrderId] = useState<string | undefined>();

  // Filter listings logic
  const filteredListings = listings.filter((l) => {
    // Server filter
    if (selectedServer !== 'ALL' && l.server !== selectedServer) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        l.title.toLowerCase().includes(q) ||
        l.uid.includes(q) ||
        l.rank.toLowerCase().includes(q) ||
        l.sellerName.toLowerCase().includes(q) ||
        (l.evoGuns && l.evoGuns.some(g => g.name.toLowerCase().includes(q))) ||
        (l.bundles && l.bundles.some(b => b.toLowerCase().includes(q)));
      if (!match) return false;
    }

    // Category filter
    if (selectedFilter === 'EVO' && (!l.evoGuns || l.evoGuns.length === 0)) return false;
    if (selectedFilter === 'GRANDMASTER' && !l.rank.toLowerCase().includes('grandmaster')) return false;
    if (selectedFilter === 'OG' && (!l.bundles || !l.bundles.some(b => b.toLowerCase().includes('sakura') || b.toLowerCase().includes('hip hop')))) return false;
    if (selectedFilter === 'LEVEL70' && l.level < 70) return false;

    return true;
  });

  const wishlistedListings = listings.filter((l) => wishlist.includes(l.id));
  const myOrders = orders.filter((o) => o.buyerId === currentUser.id || o.sellerId === currentUser.id || currentUser.role === 'admin');

  return (
    <div className="min-[#0B0F19] min-h-screen text-slate-100 flex flex-col font-sans pb-20 sm:pb-8 selection:bg-cyan-500 selection:text-black">
      {/* Navbar */}
      <Navbar
        onOpenListAccount={() => setShowListAccount(true)}
        onOpenWallet={() => setShowWallet(true)}
        onOpenOrders={() => setShowOrders(true)}
        onOpenAdmin={() => setShowAdmin(true)}
        onOpenKyc={() => setShowKyc(true)}
        onOpenReferral={() => setShowReferral(true)}
        onOpenProfile={() => setShowProfile(true)}
        onOpenChat={() => {
          setChatOrderId(undefined);
          setShowChat(true);
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Container */}
      <main className="flex-1">
        {/* Hero Section */}
        {activeTab === 'home' && (
          <HeroBanner
            selectedServer={selectedServer}
            setSelectedServer={setSelectedServer}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            minLevel={minLevel}
            setMinLevel={setMinLevel}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
          />
        )}

        {/* Listings Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Section Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-900/40 rounded-xl border border-blue-500/30">
                <Gamepad2 className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-white font-mono uppercase">
                  {activeTab === 'wishlist' ? 'My Wishlist Accounts' : 'Featured Free Fire Accounts'}
                </h2>
                <p className="text-xs text-slate-400">
                  {filteredListings.length} Accounts Available • Escrow Protected
                </p>
              </div>
            </div>

            {/* Quick View Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('home')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition cursor-pointer ${
                  activeTab === 'home' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                All Listings
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition cursor-pointer ${
                  activeTab === 'orders' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                My Orders ({myOrders.length})
              </button>
            </div>
          </div>

          {/* MY ORDERS TAB VIEW */}
          {activeTab === 'orders' ? (
            <div className="space-y-3">
              {myOrders.length === 0 ? (
                <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800 space-y-3">
                  <Gamepad2 className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="text-sm font-bold text-slate-400">No escrow orders found.</p>
                  <button
                    onClick={() => setActiveTab('home')}
                    className="bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-xl"
                  >
                    Browse Free Fire Accounts
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-slate-800 border border-slate-800 rounded-2xl bg-[#0F172A] overflow-hidden">
                  {myOrders.map((ord) => (
                    <div
                      key={ord.id}
                      onClick={() => setActiveEscrowOrder(ord)}
                      className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-900/60 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <img src={ord.listingImage} alt={ord.listingTitle} className="w-14 h-14 rounded-xl object-cover ring-1 ring-blue-500/40" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white">{ord.id}</span>
                            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase">
                              {ord.status.replace('_', ' ')}
                            </span>
                          </div>
                          <h4 className="text-xs text-slate-300 font-bold truncate max-w-[280px] mt-0.5">{ord.listingTitle}</h4>
                          <span className="text-[11px] text-slate-400">TrxID: {ord.paymentDetails.trxId} ({ord.paymentDetails.method})</span>
                        </div>
                      </div>

                      <div className="text-right font-mono">
                        <span className="text-base font-black text-emerald-400 block">{ord.totalPaid} BDT</span>
                        <span className="text-[10px] text-cyan-400 hover:underline">Click to view Escrow Vault →</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : activeTab === 'wishlist' ? (
            /* WISHLIST VIEW */
            wishlistedListings.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800 space-y-3">
                <Heart className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-sm font-bold text-slate-400">Your wishlist is empty.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistedListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onSelect={setSelectedListing}
                    onQuickBuy={setPaymentListing}
                  />
                ))}
              </div>
            )
          ) : (
            /* MAIN ACCOUNTS GRID */
            filteredListings.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800 space-y-3">
                <Search className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-sm font-bold text-slate-400">No Free Fire accounts found matching filters.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedServer('ALL');
                    setSelectedFilter('ALL');
                  }}
                  className="bg-slate-800 text-cyan-400 font-bold text-xs px-4 py-2 rounded-xl border border-slate-700"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onSelect={setSelectedListing}
                    onQuickBuy={setPaymentListing}
                  />
                ))}
              </div>
            )
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#0B0F19] py-8 text-xs text-slate-400 text-center space-y-2 font-mono">
        <div className="flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-slate-200">FF TRUSTED MARKET</span>
          <span>• 100% Escrow Account Marketplace</span>
        </div>
        <p className="text-slate-500 max-w-md mx-auto text-[11px]">
          Official Payment Number: <span className="text-amber-300 font-bold">01889828907</span> (bKash/Nagad/Rocket). Protected by 24h Buyer Guarantee.
        </p>
      </footer>

      {/* Mobile Bottom Bar */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenListAccount={() => setShowListAccount(true)}
        onOpenWallet={() => setShowWallet(true)}
        onOpenProfile={() => setShowProfile(true)}
        onOpenWishlist={() => setActiveTab('wishlist')}
      />

      {/* Modals */}
      {selectedListing && (
        <ListingDetailModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
          onBuyNow={(l) => {
            setSelectedListing(null);
            setPaymentListing(l);
          }}
          onOpenChatWithSeller={(sId, lId) => {
            setSelectedListing(null);
            setChatOrderId(undefined);
            setShowChat(true);
          }}
        />
      )}

      {/* REAL MANUAL PAYMENT MODAL */}
      {paymentListing && (
        <PaymentModal
          listing={paymentListing}
          onClose={() => setPaymentListing(null)}
          onSuccess={() => {
            setActiveTab('orders');
          }}
        />
      )}

      {/* ESCROW ORDER FLOW MODAL */}
      {activeEscrowOrder && (
        <EscrowOrderFlowModal
          order={activeEscrowOrder}
          onClose={() => setActiveEscrowOrder(null)}
          onOpenChat={(oId) => {
            setActiveEscrowOrder(null);
            setChatOrderId(oId);
            setShowChat(true);
          }}
        />
      )}

      {/* CREATE LISTING MODAL */}
      {showListAccount && (
        <CreateListingModal onClose={() => setShowListAccount(false)} />
      )}

      {/* ADMIN PANEL */}
      {showAdmin && (
        <AdminPanel onClose={() => setShowAdmin(false)} />
      )}

      {/* SELLER KYC */}
      {showKyc && (
        <SellerVerificationModal onClose={() => setShowKyc(false)} />
      )}

      {/* WALLET */}
      {showWallet && (
        <WalletModal onClose={() => setShowWallet(false)} />
      )}

      {/* SECURE CHAT */}
      {showChat && (
        <SecureChat
          orderId={chatOrderId}
          onClose={() => setShowChat(false)}
        />
      )}

      {/* REFERRAL & COUPONS */}
      {showReferral && (
        <ReferralCouponModal onClose={() => setShowReferral(false)} />
      )}

      {/* USER PROFILE */}
      {showProfile && (
        <UserProfileModal onClose={() => setShowProfile(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
