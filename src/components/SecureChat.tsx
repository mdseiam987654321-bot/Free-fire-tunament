import React, { useState } from 'react';
import { X, Send, ShieldCheck, Image, Lock, MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SecureChatProps {
  orderId?: string;
  sellerId?: string;
  onClose: () => void;
}

export const SecureChat: React.FC<SecureChatProps> = ({ orderId, sellerId, onClose }) => {
  const { currentUser, chatMessages, sendChatMessage, orders, users } = useApp();
  const [message, setMessage] = useState('');

  const targetOrder = orders.find((o) => o.id === orderId);
  const otherUserId = targetOrder
    ? currentUser.id === targetOrder.buyerId ? targetOrder.sellerId : targetOrder.buyerId
    : sellerId || 'user_seller_1';

  const otherUser = users.find((u) => u.id === otherUserId) || {
    username: 'BooyahKing_BD',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    verifiedSeller: true
  };

  const relevantMessages = chatMessages.filter(
    (m) =>
      (orderId && m.orderId === orderId) ||
      (m.senderId === currentUser.id && m.receiverId === otherUserId) ||
      (m.senderId === otherUserId && m.receiverId === currentUser.id)
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    sendChatMessage(orderId || 'ORD-9828-01', otherUserId, message);
    setMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
      <div className="bg-[#0F172A] border border-blue-900/90 rounded-3xl max-w-lg w-full h-[600px] shadow-2xl relative text-white my-auto flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="bg-[#0F172A] border-b border-slate-800 p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <img src={otherUser.avatar} alt={otherUser.username} className="w-9 h-9 rounded-full object-cover ring-2 ring-cyan-500/40" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-white">{otherUser.username}</span>
                {otherUser.verifiedSeller && <ShieldCheck className="w-4 h-4 text-cyan-400" />}
              </div>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Escrow Encrypted Chat
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-slate-900 border border-slate-800 hover:border-cyan-500 rounded-xl text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message History Container */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/60">
          {relevantMessages.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No messages yet. Send a message to start chatting!
            </div>
          ) : (
            relevantMessages.map((msg) => {
              const isMe = msg.senderId === currentUser.id;
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                      isMe
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                        : 'bg-slate-900 border border-slate-800 text-slate-200'
                    }`}
                  >
                    <p>{msg.message}</p>
                    <span className="text-[9px] text-slate-300/80 mt-1 block font-mono text-right">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Send Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-[#0F172A] border-t border-slate-800 flex gap-2 shrink-0">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type private message..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl transition cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
