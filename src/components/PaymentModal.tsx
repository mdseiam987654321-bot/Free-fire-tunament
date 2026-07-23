import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Copy,
  Check,
  Upload,
  Clock,
  AlertCircle,
  Tag,
  ArrowRight,
  Send,
  Sparkles
} from 'lucide-react';
import { AccountListing } from '../types';
import { useApp } from '../context/AppContext';

interface PaymentModalProps {
  listing: AccountListing | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ listing, onClose, onSuccess }) => {
  if (!listing) return null;

  const {
    officialPaymentNumber,
    submitPaymentOrder,
    coupons,
    t
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Bank'>('bKash');
  const [senderNumber, setSenderNumber] = useState('01889828907');
  const [trxId, setTrxId] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const finalAmount = Math.max(0, listing.price - appliedDiscount);

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(officialPaymentNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyCoupon = () => {
    setCouponError('');
    setCouponSuccess('');
    if (!couponCode.trim()) return;

    const matched = coupons.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase() && c.isActive);
    if (!matched) {
      setCouponError('Invalid or expired coupon code');
      setAppliedDiscount(0);
      return;
    }

    if (matched.minSpend && listing.price < matched.minSpend) {
      setCouponError(`Minimum spend for this coupon is ${matched.minSpend} BDT`);
      setAppliedDiscount(0);
      return;
    }

    let disc = 0;
    if (matched.discountPercent) {
      disc = Math.round((listing.price * matched.discountPercent) / 100);
    } else if (matched.fixedDiscount) {
      disc = matched.fixedDiscount;
    }

    setAppliedDiscount(disc);
    setCouponSuccess(`Coupon applied! ${disc} BDT discount`);
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!senderNumber.trim() || senderNumber.length < 11) {
      alert("Please enter a valid 11-digit Sender Phone Number!");
      return;
    }

    if (!trxId.trim() || trxId.length < 6) {
      alert("Please enter a valid Transaction ID (TrxID)!");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      try {
        submitPaymentOrder(
          listing.id,
          paymentMethod,
          senderNumber,
          trxId,
          finalAmount,
          screenshotUrl || 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
          couponCode
        );
        setIsSubmitting(false);
        setSubmitted(true);
      } catch (err: any) {
        alert(err.message || "Failed to submit payment");
        setIsSubmitting(false);
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
      <div className="bg-[#0F172A] border border-blue-900/90 rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl relative text-white my-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-900/50 rounded-xl border border-blue-500/30">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">{t.manualPaymentTitle}</h3>
              <p className="text-xs text-slate-400">Escrow Protected Payment</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-slate-900 border border-slate-800 hover:border-cyan-500 rounded-xl text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          /* Submitted State Confirmation */
          <div className="py-8 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-500/20 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-500/20">
              <Clock className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-black text-emerald-400 font-mono">PAYMENT SUBMITTED!</h4>
              <p className="text-sm font-bold text-slate-200">{t.waitingAdminApproval}</p>
              <p className="text-xs text-slate-400 max-w-md mx-auto pt-2">
                Your payment of <span className="text-amber-300 font-bold">{finalAmount} BDT</span> with TrxID <span className="text-cyan-300 font-mono font-bold">{trxId}</span> has been saved as <span className="text-amber-400">Pending Verification</span>.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-blue-900/60 p-4 rounded-2xl text-left text-xs text-slate-300 space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Listing:</span>
                <span className="font-bold text-white truncate max-w-[200px]">{listing.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Method:</span>
                <span className="font-bold text-cyan-400">{paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Sender Number:</span>
                <span className="font-bold text-white">{senderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded font-bold">
                  Pending Admin Approval
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onSuccess();
                onClose();
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-3 rounded-2xl shadow-xl hover:scale-105 transition cursor-pointer"
            >
              View Order in Dashboard
            </button>
          </div>
        ) : (
          /* Payment Form */
          <form onSubmit={handleSubmitPayment} className="space-y-4">
            {/* Account Summary */}
            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl flex items-center gap-3">
              <img
                src={listing.images[0] || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80'}
                alt={listing.title}
                className="w-14 h-14 rounded-xl object-cover ring-1 ring-blue-500/40"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-white truncate">{listing.title}</h4>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5 font-mono">
                  <span>Server: {listing.server}</span>
                  <span>•</span>
                  <span>LVL {listing.level}</span>
                </div>
                <div className="text-sm font-black text-emerald-400 font-mono mt-0.5">
                  {listing.price} BDT
                </div>
              </div>
            </div>

            {/* Official Payment Number Box */}
            <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-blue-950 border border-cyan-500/40 p-4 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300 font-mono uppercase">{t.officialPaymentNumber}</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded font-mono font-bold">
                  24/7 Active
                </span>
              </div>

              <div className="bg-slate-950 border border-blue-900/80 p-3 rounded-xl flex items-center justify-between">
                <span className="text-2xl font-black text-amber-300 tracking-wider font-mono">
                  {officialPaymentNumber}
                </span>
                <button
                  type="button"
                  onClick={handleCopyNumber}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : t.copyNumber}</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-300 leading-tight pt-1">
                📌 Send Money or Cash Out <span className="text-amber-300 font-bold">{finalAmount} BDT</span> to the number above, then enter your TrxID below.
              </p>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 font-mono uppercase">{t.paymentMethod}</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['bKash', 'Nagad', 'Rocket', 'Bank'] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`p-2.5 rounded-xl border text-xs font-bold font-mono transition cursor-pointer ${
                      paymentMethod === method
                        ? 'bg-blue-600 border-cyan-400 text-white shadow-lg'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {/* Coupon Code Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 font-mono uppercase flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-cyan-400" /> Apply Coupon Code (Optional)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="e.g. FFTRUST10"
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white uppercase font-mono focus:border-cyan-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold px-4 py-2 rounded-xl border border-slate-700 cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {couponError && <p className="text-[11px] text-red-400">{couponError}</p>}
              {couponSuccess && <p className="text-[11px] text-emerald-400 font-bold">{couponSuccess}</p>}
            </div>

            {/* Inputs: Sender Number & TrxID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 font-mono uppercase">{t.senderNumber}</label>
                <input
                  type="text"
                  value={senderNumber}
                  onChange={(e) => setSenderNumber(e.target.value)}
                  placeholder="e.g. 01889828907"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 font-mono uppercase">{t.trxId}</label>
                <input
                  type="text"
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value)}
                  placeholder="e.g. 8N7A2X9P1L"
                  className="w-full bg-slate-900 border border-cyan-500/50 rounded-xl px-3.5 py-2.5 text-xs text-amber-300 font-mono font-bold focus:border-cyan-400 focus:outline-none uppercase"
                  required
                />
              </div>
            </div>

            {/* Screenshot Upload / Attachment */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 font-mono uppercase flex items-center gap-1">
                <Upload className="w-3.5 h-3.5 text-cyan-400" /> {t.uploadScreenshot} (Optional)
              </label>
              <input
                type="text"
                value={screenshotUrl}
                onChange={(e) => setScreenshotUrl(e.target.value)}
                placeholder="Paste screenshot image URL or leave default"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            {/* Final Total Bar */}
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between font-mono">
              <div>
                <span className="text-xs text-slate-400 block">Total Amount to Verify</span>
                {appliedDiscount > 0 && (
                  <span className="text-[10px] text-emerald-400">Discount: -{appliedDiscount} BDT</span>
                )}
              </div>
              <span className="text-xl font-black text-emerald-400">{finalAmount} BDT</span>
            </div>

            {/* Submit Payment Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black py-3.5 rounded-2xl shadow-xl shadow-cyan-500/20 transition hover:scale-105 cursor-pointer flex items-center justify-center gap-2 text-sm uppercase font-mono"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting Payment...' : t.submitPayment}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
