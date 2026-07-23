import React, { useState } from 'react';
import { X, Wallet, ArrowDownRight, ArrowUpRight, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface WalletModalProps {
  onClose: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({ onClose }) => {
  const { currentUser, withdrawals, requestWithdrawal, t } = useApp();

  const [withdrawMethod, setWithdrawMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Bank'>('bKash');
  const [accountNumber, setAccountNumber] = useState('01889828907');
  const [amount, setAmount] = useState<number>(1000);
  const [activeTab, setActiveTab] = useState<'balance' | 'withdraw' | 'history'>('balance');

  const myWithdrawals = withdrawals.filter((w) => w.sellerId === currentUser.id);

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || amount > currentUser.walletBalance) {
      alert("Invalid amount or insufficient wallet balance!");
      return;
    }

    if (!accountNumber.trim()) {
      alert("Please enter account number!");
      return;
    }

    requestWithdrawal(amount, withdrawMethod, accountNumber);
    alert(`Cashout request of ${amount} BDT submitted to Admin!`);
    setActiveTab('history');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
      <div className="bg-[#0F172A] border border-blue-900/90 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl relative text-white my-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-950/80 rounded-xl border border-emerald-500/40">
              <Wallet className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">{t.wallet} & Cashout Portal</h3>
              <p className="text-xs text-slate-400">Escrow Balance Management</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-slate-900 border border-slate-800 hover:border-cyan-500 rounded-xl text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-blue-950 border border-cyan-500/40 p-5 rounded-2xl shadow-xl flex items-center justify-between font-mono">
          <div>
            <span className="text-xs text-slate-400 block uppercase">Available Wallet Balance</span>
            <span className="text-3xl font-black text-emerald-400">{currentUser.walletBalance} BDT</span>
            {currentUser.pendingBalance > 0 && (
              <span className="text-xs text-amber-300 block mt-1">Pending Payouts: {currentUser.pendingBalance} BDT</span>
            )}
          </div>

          <button
            onClick={() => setActiveTab('withdraw')}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-emerald-600/30"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Withdraw</span>
          </button>
        </div>

        {/* Nav Tabs */}
        <div className="flex border-b border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab('balance')}
            className={`pb-2 px-3 font-bold border-b-2 transition ${
              activeTab === 'balance' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400'
            }`}
          >
            Info
          </button>

          <button
            onClick={() => setActiveTab('withdraw')}
            className={`pb-2 px-3 font-bold border-b-2 transition ${
              activeTab === 'withdraw' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400'
            }`}
          >
            Request Cashout
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`pb-2 px-3 font-bold border-b-2 transition ${
              activeTab === 'history' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400'
            }`}
          >
            Cashout History ({myWithdrawals.length})
          </button>
        </div>

        {/* Tab 1: Info */}
        {activeTab === 'balance' && (
          <div className="space-y-3 text-xs text-slate-300">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <h5 className="font-bold text-cyan-300 font-mono">🛡️ Escrow Payout Protection</h5>
              <p className="leading-relaxed text-slate-400">
                Earnings from sold Free Fire accounts are held safely in your wallet balance as soon as the buyer confirms receiving account credentials.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Withdraw Form */}
        {activeTab === 'withdraw' && (
          <form onSubmit={handleWithdraw} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 font-mono uppercase">Cashout Method</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['bKash', 'Nagad', 'Rocket', 'Bank'] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setWithdrawMethod(method)}
                    className={`p-2 rounded-xl text-xs font-bold font-mono border transition cursor-pointer ${
                      withdrawMethod === method ? 'bg-blue-600 border-cyan-400 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 font-mono uppercase">{withdrawMethod} Account Number</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="01889828907"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 font-mono uppercase">Amount to Cashout (BDT)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                max={currentUser.walletBalance}
                className="w-full bg-slate-900 border border-emerald-500/50 rounded-xl px-3.5 py-2.5 text-xs text-emerald-400 font-mono font-black focus:border-emerald-400 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-black py-3 rounded-2xl shadow-xl transition hover:scale-105 cursor-pointer font-mono uppercase text-xs"
            >
              Submit Cashout Request
            </button>
          </form>
        )}

        {/* Tab 3: History */}
        {activeTab === 'history' && (
          <div className="space-y-2 max-h-60 overflow-y-auto font-mono text-xs">
            {myWithdrawals.length === 0 ? (
              <p className="text-center text-slate-500 py-6">No cashout history yet.</p>
            ) : (
              myWithdrawals.map((w) => (
                <div key={w.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white">{w.method} - {w.accountNumber}</span>
                    <span className="text-[10px] text-slate-400 block">{new Date(w.requestedAt).toLocaleDateString()}</span>
                  </div>

                  <div className="text-right">
                    <span className="font-black text-emerald-400 block">{w.amount} BDT</span>
                    <span className={`text-[10px] font-bold uppercase ${w.status === 'approved' ? 'text-emerald-400' : 'text-amber-300'}`}>
                      {w.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
