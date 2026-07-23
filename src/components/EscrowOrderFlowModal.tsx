import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Key,
  Lock,
  AlertTriangle,
  MessageSquare,
  Copy,
  Check,
  Send,
  Eye,
  EyeOff
} from 'lucide-react';
import { Order } from '../types';
import { useApp } from '../context/AppContext';

interface EscrowOrderFlowModalProps {
  order: Order | null;
  onClose: () => void;
  onOpenChat: (orderId: string) => void;
}

export const EscrowOrderFlowModal: React.FC<EscrowOrderFlowModalProps> = ({ order, onClose, onOpenChat }) => {
  if (!order) return null;

  const {
    currentUser,
    sellerDeliverCredentials,
    buyerConfirmReceived,
    openDispute,
    adminApprovePayment,
    adminRejectPayment,
    t
  } = useApp();

  const [loginType, setLoginType] = useState<'Facebook' | 'Google' | 'VK' | 'Twitter'>('Facebook');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [backupCodes, setBackupCodes] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  const [disputeReason, setDisputeReason] = useState('');
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);

  const isBuyer = currentUser.id === order.buyerId;
  const isSeller = currentUser.id === order.sellerId;
  const isAdmin = currentUser.role === 'admin';

  const handleDeliver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      alert("Please enter both Login Email/Phone and Password!");
      return;
    }

    sellerDeliverCredentials(order.id, {
      loginType,
      loginEmail,
      loginPassword,
      backupCodes,
      additionalInfo
    });
  };

  const handleConfirmReceived = () => {
    if (window.confirm("Are you sure you tested the account and confirm receiving full access? Once confirmed, money will be released to the seller.")) {
      buyerConfirmReceived(order.id);
    }
  };

  const handleOpenDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeReason.trim()) return;
    openDispute(order.id, disputeReason);
    setShowDisputeForm(false);
  };

  const copyCredentials = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPass(true);
    setTimeout(() => setCopiedPass(false), 2000);
  };

  // Step statuses
  const step1 = order.status !== 'cancelled' && order.status !== 'refunded';
  const step2 = order.status === 'payment_verified' || order.status === 'delivered' || order.status === 'completed' || order.status === 'disputed';
  const step3 = order.status === 'delivered' || order.status === 'completed' || order.status === 'disputed';
  const step4 = order.status === 'completed';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
      <div className="bg-[#0F172A] border border-blue-900/90 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-white my-auto p-5 sm:p-6 space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-900/50 rounded-xl border border-blue-500/30">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Escrow Vault: {order.id}</h3>
              <p className="text-xs text-slate-400">Order Security Lifecycle</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-slate-900 border border-slate-800 hover:border-cyan-500 rounded-xl text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Account Info Summary */}
        <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img src={order.listingImage} alt={order.listingTitle} className="w-12 h-12 rounded-xl object-cover ring-1 ring-blue-500/40" />
            <div>
              <h4 className="text-xs font-bold text-white truncate max-w-[220px]">{order.listingTitle}</h4>
              <p className="text-[11px] text-slate-400">Buyer: {order.buyerName} | Seller: {order.sellerName}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block font-mono">Paid Amount</span>
            <span className="text-base font-black text-emerald-400 font-mono">{order.totalPaid} BDT</span>
          </div>
        </div>

        {/* Visual Escrow Timeline Tracker */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-cyan-400 font-mono uppercase">Escrow Progress Tracker</h4>

          <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
            <div className={`p-2 rounded-xl border transition ${step1 ? 'bg-blue-900/40 border-cyan-500/60 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
              <CheckCircle2 className={`w-4 h-4 mx-auto mb-1 ${step1 ? 'text-cyan-400' : 'text-slate-600'}`} />
              <span>1. Paid (TrxID)</span>
            </div>

            <div className={`p-2 rounded-xl border transition ${step2 ? 'bg-blue-900/40 border-cyan-500/60 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
              <ShieldCheck className={`w-4 h-4 mx-auto mb-1 ${step2 ? 'text-emerald-400' : 'text-slate-600'}`} />
              <span>2. Admin Verified</span>
            </div>

            <div className={`p-2 rounded-xl border transition ${step3 ? 'bg-blue-900/40 border-cyan-500/60 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
              <Key className={`w-4 h-4 mx-auto mb-1 ${step3 ? 'text-amber-400' : 'text-slate-600'}`} />
              <span>3. Delivered</span>
            </div>

            <div className={`p-2 rounded-xl border transition ${step4 ? 'bg-emerald-950 border-emerald-500/60 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
              <CheckCircle2 className={`w-4 h-4 mx-auto mb-1 ${step4 ? 'text-emerald-400' : 'text-slate-600'}`} />
              <span>4. Completed</span>
            </div>
          </div>
        </div>

        {/* Admin Payment Approval Panel (For Admin User Preview) */}
        {isAdmin && order.status === 'pending_payment' && (
          <div className="bg-amber-950/40 border border-amber-500/50 p-4 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-mono font-bold text-xs">
              <Clock className="w-4 h-4" /> Admin Action Needed: Verify Payment TrxID
            </div>

            <div className="bg-slate-900 p-3 rounded-xl text-xs font-mono space-y-1">
              <div>Method: <span className="text-white font-bold">{order.paymentDetails.method}</span></div>
              <div>TrxID: <span className="text-amber-300 font-bold">{order.paymentDetails.trxId}</span></div>
              <div>Sender Number: <span className="text-cyan-300">{order.paymentDetails.senderNumber}</span></div>
              <div>Amount: <span className="text-emerald-400">{order.paymentDetails.amount} BDT</span></div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => adminApprovePayment(order.id)}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 rounded-xl transition cursor-pointer"
              >
                Approve Payment (TrxID Valid)
              </button>

              <button
                onClick={() => adminRejectPayment(order.id, 'TrxID not found in bKash/Nagad statement')}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold text-xs py-2 rounded-xl transition cursor-pointer"
              >
                Reject Payment
              </button>
            </div>
          </div>
        )}

        {/* SELLER: Credentials Delivery Form (When Payment is Verified) */}
        {(isSeller || isAdmin) && order.status === 'payment_verified' && !order.credentialsDelivered && (
          <form onSubmit={handleDeliver} className="bg-slate-900 border border-cyan-500/40 p-4 rounded-2xl space-y-3">
            <h4 className="text-xs font-bold text-cyan-300 font-mono uppercase flex items-center gap-1.5">
              <Key className="w-4 h-4 text-amber-400" /> {t.deliverCredentials}
            </h4>

            <p className="text-xs text-slate-400">
              Payment is verified by Admin! Please enter login details below. They will be encrypted & revealed only to buyer {order.buyerName}.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 font-mono uppercase block mb-1">Bind Method</label>
                <select
                  value={loginType}
                  onChange={(e: any) => setLoginType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="Facebook">Facebook Bind</option>
                  <option value="Google">Google Account Bind</option>
                  <option value="VK">VK Bind</option>
                  <option value="Twitter">Twitter Bind</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-mono uppercase block mb-1">Login Email / Phone</label>
                <input
                  type="text"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="e.g. ff_acc@gmail.com or 01889828907"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 font-mono uppercase block mb-1">Login Password</label>
                <input
                  type="text"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 font-mono uppercase block mb-1">Backup Codes / 2FA Info</label>
                <input
                  type="text"
                  value={backupCodes}
                  onChange={(e) => setBackupCodes(e.target.value)}
                  placeholder="8901-1123 | 9920-8812"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-2.5 rounded-xl shadow-lg transition cursor-pointer text-xs uppercase font-mono flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Submit Credentials to Buyer
            </button>
          </form>
        )}

        {/* DELIVERED CREDENTIALS VAULT (Visible to Buyer / Seller / Admin once delivered) */}
        {order.credentialsDelivered && (
          <div className="bg-slate-900 border border-emerald-500/50 p-4 rounded-2xl space-y-3 font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="text-xs font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                <Lock className="w-4 h-4" /> {t.credentialsVault}
              </h4>
              <span className="text-[10px] text-slate-400">Delivered: {new Date(order.credentialsDelivered.deliveredAt).toLocaleTimeString()}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Login Method</span>
                <span className="font-bold text-cyan-300">{order.credentialsDelivered.loginType}</span>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Email / Username</span>
                <span className="font-bold text-white select-all">{order.credentialsDelivered.loginEmail}</span>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 col-span-1 sm:col-span-2 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-[10px] block">Password</span>
                  <span className="font-bold text-amber-300 select-all">
                    {showPass ? order.credentialsDelivered.loginPassword : '••••••••••••'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowPass(!showPass)}
                    className="p-1.5 bg-slate-800 text-slate-300 hover:text-white rounded cursor-pointer"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => copyCredentials(order.credentialsDelivered?.loginPassword || '')}
                    className="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-500 transition cursor-pointer"
                  >
                    {copiedPass ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {order.credentialsDelivered.backupCodes && (
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 col-span-1 sm:col-span-2">
                  <span className="text-slate-400 text-[10px] block">2FA Backup Codes</span>
                  <span className="font-bold text-cyan-300 select-all">{order.credentialsDelivered.backupCodes}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dispute Resolution Status Banner */}
        {order.status === 'disputed' && (
          <div className="bg-red-950/60 border border-red-500/60 p-4 rounded-2xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-red-400 font-bold font-mono">
              <AlertTriangle className="w-4 h-4" /> Dispute Open on Order
            </div>
            <p className="text-slate-300">Reason: {order.dispute?.reason}</p>
            <p className="text-slate-400 text-[11px]">Admin Official is reviewing chat logs and login details.</p>
          </div>
        )}

        {/* BUYER ACTIONS: Confirm Login or Open Dispute */}
        {isBuyer && order.status === 'delivered' && (
          <div className="space-y-3 pt-2">
            <button
              onClick={handleConfirmReceived}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3 rounded-2xl shadow-xl shadow-emerald-600/30 transition hover:scale-105 cursor-pointer font-mono uppercase text-xs flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> {t.confirmAccountReceived}
            </button>

            {!showDisputeForm ? (
              <button
                onClick={() => setShowDisputeForm(true)}
                className="w-full bg-slate-900 border border-red-900/60 hover:border-red-500 text-red-400 font-bold py-2 rounded-xl text-xs transition cursor-pointer"
              >
                Need Help? Open Dispute
              </button>
            ) : (
              <form onSubmit={handleOpenDispute} className="bg-slate-950 border border-red-900/60 p-3 rounded-xl space-y-2">
                <label className="text-[11px] font-bold text-red-400 block font-mono">Describe Dispute Issue:</label>
                <textarea
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  placeholder="e.g. Credentials wrong or password changed..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                  rows={2}
                  required
                />
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-red-600 text-white font-bold py-1.5 rounded text-xs">
                    Submit Dispute to Admin
                  </button>
                  <button type="button" onClick={() => setShowDisputeForm(false)} className="px-3 bg-slate-800 text-slate-300 rounded text-xs">
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Chat Drawer Toggle Button */}
        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => onOpenChat(order.id)}
            className="bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs px-4 py-2 rounded-xl border border-slate-700 flex items-center gap-2 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <span>Open Order Live Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
};
