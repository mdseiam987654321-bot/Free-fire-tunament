import React from 'react';
import { Home, Search, Heart, Wallet, User, PlusCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenListAccount: () => void;
  onOpenWallet: () => void;
  onOpenProfile: () => void;
  onOpenWishlist: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenListAccount,
  onOpenWallet,
  onOpenProfile,
  onOpenWishlist
}) => {
  const { wishlist } = useApp();

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B0F19]/95 backdrop-blur-lg border-t border-blue-900/50 py-2 px-4 flex items-center justify-around shadow-2xl">
      <button
        onClick={() => setActiveTab('home')}
        className={`flex flex-col items-center gap-1 transition ${
          activeTab === 'home' ? 'text-cyan-400 font-bold' : 'text-slate-400'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px]">Home</span>
      </button>

      <button
        onClick={onOpenWishlist}
        className="flex flex-col items-center gap-1 text-slate-400 relative"
      >
        <Heart className="w-5 h-5" />
        <span className="text-[10px]">Wishlist</span>
        {wishlist.length > 0 && (
          <span className="absolute -top-1 right-2 bg-red-500 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
            {wishlist.length}
          </span>
        )}
      </button>

      <button
        onClick={onOpenListAccount}
        className="flex flex-col items-center justify-center bg-gradient-to-tr from-blue-600 to-cyan-500 text-white p-3 rounded-full -mt-6 shadow-xl shadow-cyan-500/30 border-2 border-[#0B0F19]"
      >
        <PlusCircle className="w-6 h-6" />
      </button>

      <button
        onClick={onOpenWallet}
        className="flex flex-col items-center gap-1 text-slate-400"
      >
        <Wallet className="w-5 h-5 text-emerald-400" />
        <span className="text-[10px]">Wallet</span>
      </button>

      <button
        onClick={onOpenProfile}
        className="flex flex-col items-center gap-1 text-slate-400"
      >
        <User className="w-5 h-5" />
        <span className="text-[10px]">Profile</span>
      </button>
    </div>
  );
};
