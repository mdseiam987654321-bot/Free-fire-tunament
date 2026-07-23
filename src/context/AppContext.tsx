import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  AccountListing,
  Order,
  Review,
  Coupon,
  WithdrawalRequest,
  NotificationItem,
  ChatMessage,
  ActivityLog,
  UserRole
} from '../types';
import {
  initialUsers,
  initialListings,
  initialOrders,
  initialReviews,
  initialCoupons,
  initialWithdrawals,
  initialNotifications,
  OFFICIAL_PAYMENT_NUMBER
} from '../data/seedData';
import { Language, translations } from '../lib/translations';

interface AppContextType {
  currentUser: User;
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>;
  switchRole: (role: UserRole) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations['en'];
  
  // Data collections
  users: User[];
  listings: AccountListing[];
  orders: Order[];
  reviews: Review[];
  coupons: Coupon[];
  withdrawals: WithdrawalRequest[];
  notifications: NotificationItem[];
  chatMessages: ChatMessage[];
  activityLogs: ActivityLog[];
  wishlist: string[];

  // Action methods
  toggleWishlist: (listingId: string) => void;
  createListing: (listingData: Omit<AccountListing, 'id' | 'sellerId' | 'sellerName' | 'sellerAvatar' | 'sellerRating' | 'sellerVerified' | 'createdAt' | 'views' | 'wishlistCount' | 'status'>) => void;
  updateListingStatus: (listingId: string, status: AccountListing['status']) => void;
  
  // Escrow & Payment
  submitPaymentOrder: (listingId: string, paymentMethod: 'bKash' | 'Nagad' | 'Rocket' | 'Bank', senderNumber: string, trxId: string, amount: number, screenshotUrl?: string, couponCode?: string) => Order;
  adminApprovePayment: (orderId: string) => void;
  adminRejectPayment: (orderId: string, reason?: string) => void;
  sellerDeliverCredentials: (orderId: string, credentials: { loginType: any; loginEmail: string; loginPassword?: string; backupCodes?: string; additionalInfo?: string }) => void;
  buyerConfirmReceived: (orderId: string) => void;
  openDispute: (orderId: string, reason: string) => void;
  adminResolveDispute: (orderId: string, resolution: 'refund_buyer' | 'release_seller', decisionNotes: string) => void;

  // KYC
  submitKycVerification: (idDocumentUrl: string, selfieUrl: string, idNumber: string) => void;
  adminApproveKyc: (userId: string) => void;
  adminRejectKyc: (userId: string) => void;

  // Wallet
  requestWithdrawal: (amount: number, method: 'bKash' | 'Nagad' | 'Rocket' | 'Bank', accountNumber: string) => void;
  adminApproveWithdrawal: (withdrawalId: string) => void;

  // Chat
  sendChatMessage: (orderId: string, receiverId: string, message: string, attachmentUrl?: string) => void;

  // Admin actions
  adminBanUser: (userId: string, ban: boolean) => void;
  createCoupon: (coupon: Omit<Coupon, 'id' | 'timesUsed'>) => void;
  deleteCoupon: (couponId: string) => void;
  markNotificationRead: (notifId: string) => void;
  
  // Helper
  officialPaymentNumber: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'FF_TRUSTED_MARKET_STATE_V1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('en');

  // Load from LocalStorage or seed data
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_users`);
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => users[0] || initialUsers[0]);

  const [listings, setListings] = useState<AccountListing[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_listings`);
    return saved ? JSON.parse(saved) : initialListings;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_orders`);
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_reviews`);
    return saved ? JSON.parse(saved) : initialReviews;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_coupons`);
    return saved ? JSON.parse(saved) : initialCoupons;
  });

  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_withdrawals`);
    return saved ? JSON.parse(saved) : initialWithdrawals;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_notifications`);
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_chats`);
    return saved ? JSON.parse(saved) : [
      {
        id: 'msg_1',
        orderId: 'ORD-9828-01',
        senderId: 'user_buyer_1',
        senderName: 'ProGamer_BD',
        senderAvatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
        receiverId: 'user_seller_1',
        message: 'Hi! I submitted bKash payment for this account. Please wait for Admin approval.',
        timestamp: '2026-07-23T08:31:00Z'
      },
      {
        id: 'msg_2',
        orderId: 'ORD-9828-01',
        senderId: 'user_seller_1',
        senderName: 'BooyahKing_BD',
        senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        receiverId: 'user_buyer_1',
        message: 'Brother received notification! Once Admin verifies TrxID 8N7A2X9P1L, I will deliver the Facebook bind details immediately.',
        timestamp: '2026-07-23T08:35:00Z'
      }
    ];
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => [
    {
      id: 'log_1',
      userId: 'user_buyer_1',
      userName: 'ProGamer_BD',
      action: 'Payment Submitted',
      details: 'bKash TrxID: 8N7A2X9P1L for 4300 BDT',
      timestamp: new Date().toISOString(),
      ipAddress: '103.145.72.12'
    }
  ]);

  const [wishlist, setWishlist] = useState<string[]>(['ff_listing_101']);

  // LocalStorage persist effects
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_users`, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_listings`, JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_orders`, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_coupons`, JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_withdrawals`, JSON.stringify(withdrawals));
  }, [withdrawals]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_notifications`, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_chats`, JSON.stringify(chatMessages));
  }, [chatMessages]);

  const t = translations[lang];

  // Helper to log system activity
  const addLog = (userId: string, userName: string, action: string, details: string) => {
    const newLog: ActivityLog = {
      id: `log_${Date.now()}`,
      userId,
      userName,
      action,
      details,
      timestamp: new Date().toISOString(),
      ipAddress: '103.145.72.12'
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  const addNotification = (userId: string, title: string, message: string, type: NotificationItem['type'], linkId?: string) => {
    const notif: NotificationItem = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      userId,
      title,
      message,
      type,
      read: false,
      timestamp: new Date().toISOString(),
      linkId
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const switchRole = (role: UserRole) => {
    const found = users.find(u => u.role === role);
    if (found) {
      setCurrentUser(found);
    } else {
      // update current user role directly
      setCurrentUser(prev => ({ ...prev, role }));
    }
  };

  const toggleWishlist = (listingId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(listingId);
      const updated = exists ? prev.filter(id => id !== listingId) : [...prev, listingId];
      
      // Update listing wishlistCount
      setListings(lPrev => lPrev.map(l => {
        if (l.id === listingId) {
          return { ...l, wishlistCount: Math.max(0, l.wishlistCount + (exists ? -1 : 1)) };
        }
        return l;
      }));
      return updated;
    });
  };

  const createListing = (listingData: Omit<AccountListing, 'id' | 'sellerId' | 'sellerName' | 'sellerAvatar' | 'sellerRating' | 'sellerVerified' | 'createdAt' | 'views' | 'wishlistCount' | 'status'>) => {
    const newListing: AccountListing = {
      ...listingData,
      id: `ff_listing_${Date.now()}`,
      sellerId: currentUser.id,
      sellerName: currentUser.username,
      sellerAvatar: currentUser.avatar,
      sellerRating: currentUser.rating,
      sellerVerified: currentUser.verifiedSeller,
      status: 'active', // Active immediately for smooth user flow
      createdAt: new Date().toISOString(),
      views: 12,
      wishlistCount: 0
    };

    setListings(prev => [newListing, ...prev]);
    addLog(currentUser.id, currentUser.username, 'Listed Free Fire Account', `UID: ${newListing.uid}, Price: ${newListing.price} BDT`);
    addNotification(currentUser.id, 'Account Listed Successfully', `Your Free Fire account "${newListing.title}" is now live on the marketplace.`, 'system', newListing.id);
  };

  const updateListingStatus = (listingId: string, status: AccountListing['status']) => {
    setListings(prev => prev.map(l => l.id === listingId ? { ...l, status } : l));
  };

  // REAL MANUAL PAYMENT & ESCROW ORDER CREATION
  const submitPaymentOrder = (
    listingId: string,
    paymentMethod: 'bKash' | 'Nagad' | 'Rocket' | 'Bank',
    senderNumber: string,
    trxId: string,
    amount: number,
    screenshotUrl?: string,
    couponCode?: string
  ): Order => {
    const listing = listings.find(l => l.id === listingId);
    if (!listing) throw new Error("Listing not found");

    let discountAmount = 0;
    if (couponCode) {
      const coupon = coupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase() && c.isActive);
      if (coupon) {
        if (coupon.discountPercent) {
          discountAmount = Math.round((listing.price * coupon.discountPercent) / 100);
        } else if (coupon.fixedDiscount) {
          discountAmount = coupon.fixedDiscount;
        }
        // Increment coupon use
        setCoupons(prev => prev.map(c => c.id === coupon.id ? { ...c, timesUsed: c.timesUsed + 1 } : c));
      }
    }

    const totalPaid = Math.max(0, listing.price - discountAmount);

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-2)}`,
      listingId: listing.id,
      listingTitle: listing.title,
      listingImage: listing.images[0] || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
      price: listing.price,
      discountAmount,
      couponCode,
      totalPaid,
      buyerId: currentUser.id,
      buyerName: currentUser.username,
      buyerAvatar: currentUser.avatar,
      sellerId: listing.sellerId,
      sellerName: listing.sellerName,
      status: 'pending_payment',
      paymentDetails: {
        method: paymentMethod,
        senderNumber,
        trxId,
        amount: totalPaid,
        screenshotUrl: screenshotUrl || 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
        submittedAt: new Date().toISOString(),
        status: 'pending',
        adminNotes: `Submitted by ${currentUser.username} via ${paymentMethod} (${senderNumber}) - TrxID: ${trxId}`
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);

    // System Log
    addLog(currentUser.id, currentUser.username, 'Submitted Payment Verification', `Order: ${newOrder.id}, ${paymentMethod} TrxID: ${trxId}, Amount: ${totalPaid} BDT`);

    // Notify Buyer
    addNotification(
      currentUser.id,
      'Payment Submitted - Pending Admin Verification',
      `Your payment of ${totalPaid} BDT with TrxID "${trxId}" has been submitted. Admin will verify shortly.`,
      'payment',
      newOrder.id
    );

    // Notify Seller
    addNotification(
      listing.sellerId,
      'New Escrow Order Pending Payment Approval',
      `Buyer ${currentUser.username} submitted payment for "${listing.title}". Awaiting Admin verification before account delivery.`,
      'order',
      newOrder.id
    );

    // Notify Admins
    const adminUser = users.find(u => u.role === 'admin');
    if (adminUser) {
      addNotification(
        adminUser.id,
        '⚠️ New Payment Verification Required',
        `New manual ${paymentMethod} payment TrxID: ${trxId} (${totalPaid} BDT) submitted by ${currentUser.username}. Verify now in Admin Panel.`,
        'payment',
        newOrder.id
      );
    }

    return newOrder;
  };

  // ADMIN APPROVES MANUAL PAYMENT (TrxID verified)
  const adminApprovePayment = (orderId: string) => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return;

    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'payment_verified',
          paymentDetails: {
            ...o.paymentDetails,
            status: 'approved',
            verifiedAt: new Date().toISOString(),
            adminNotes: 'TrxID verified and approved by Admin Official.'
          },
          updatedAt: new Date().toISOString()
        };
      }
      return o;
    }));

    // Update listing status to pending delivery or sold
    setListings(prev => prev.map(l => l.id === targetOrder.listingId ? { ...l, status: 'pending_approval' } : l));

    addLog('user_admin_1', 'Admin_Official', 'Approved Payment Verification', `Order: ${orderId}, TrxID: ${targetOrder.paymentDetails.trxId}`);

    // Notify Buyer
    addNotification(
      targetOrder.buyerId,
      '✅ Payment Verified by Admin!',
      `Your payment for order ${orderId} was verified. The seller has been requested to deliver account credentials.`,
      'payment',
      orderId
    );

    // Notify Seller
    addNotification(
      targetOrder.sellerId,
      '⚡ Action Required: Deliver Account Credentials',
      `Payment of ${targetOrder.totalPaid} BDT is verified by Admin! Please submit account login details in the Order Vault now.`,
      'delivery',
      orderId
    );
  };

  // ADMIN REJECTS MANUAL PAYMENT
  const adminRejectPayment = (orderId: string, reason?: string) => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return;

    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'cancelled',
          paymentDetails: {
            ...o.paymentDetails,
            status: 'rejected',
            adminNotes: reason || 'Transaction ID not found or invalid amount.'
          },
          updatedAt: new Date().toISOString()
        };
      }
      return o;
    }));

    addLog('user_admin_1', 'Admin_Official', 'Rejected Payment Verification', `Order: ${orderId}, TrxID: ${targetOrder.paymentDetails.trxId}`);

    addNotification(
      targetOrder.buyerId,
      '❌ Payment Verification Rejected',
      `Your payment TrxID "${targetOrder.paymentDetails.trxId}" was rejected. Reason: ${reason || 'Invalid Transaction ID'}. Please contact support or resubmit.`,
      'payment',
      orderId
    );
  };

  // SELLER DELIVERS CREDENTIALS TO ESCROW VAULT
  const sellerDeliverCredentials = (
    orderId: string,
    credentials: { loginType: any; loginEmail: string; loginPassword?: string; backupCodes?: string; additionalInfo?: string }
  ) => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return;

    const deliveredAt = new Date().toISOString();

    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'delivered',
          credentialsDelivered: {
            ...credentials,
            deliveredAt
          },
          updatedAt: deliveredAt
        };
      }
      return o;
    }));

    addLog(targetOrder.sellerId, targetOrder.sellerName, 'Delivered Account Credentials', `Order: ${orderId}, Method: ${credentials.loginType}`);

    addNotification(
      targetOrder.buyerId,
      '🔑 Account Credentials Delivered!',
      `Seller has submitted login credentials for order ${orderId}. Please log in and verify within 24 hours.`,
      'delivery',
      orderId
    );
  };

  // BUYER CONFIRMS ACCOUNT RECEIVED -> RELEASES PAYMENT TO SELLER
  const buyerConfirmReceived = (orderId: string) => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return;

    const completedAt = new Date().toISOString();

    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'completed',
          updatedAt: completedAt
        };
      }
      return o;
    }));

    // Credit money to Seller's wallet!
    const sellerEarnings = targetOrder.totalPaid;
    setUsers(prev => prev.map(u => {
      if (u.id === targetOrder.sellerId) {
        return {
          ...u,
          walletBalance: u.walletBalance + sellerEarnings,
          totalSales: u.totalSales + 1
        };
      }
      return u;
    }));

    // Mark listing as sold
    setListings(prev => prev.map(l => l.id === targetOrder.listingId ? { ...l, status: 'sold' } : l));

    addLog(targetOrder.buyerId, targetOrder.buyerName, 'Confirmed Account Received', `Order: ${orderId}. ${sellerEarnings} BDT released to seller.`);

    // Notify Seller
    addNotification(
      targetOrder.sellerId,
      '💰 Payment Released to Wallet!',
      `Buyer confirmed login! ${sellerEarnings} BDT has been credited to your wallet for order ${orderId}.`,
      'wallet',
      orderId
    );
  };

  // OPEN DISPUTE
  const openDispute = (orderId: string, reason: string) => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return;

    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'disputed',
          dispute: {
            openedBy: currentUser.id,
            reason,
            status: 'open',
            openedAt: new Date().toISOString()
          },
          updatedAt: new Date().toISOString()
        };
      }
      return o;
    }));

    addLog(currentUser.id, currentUser.username, 'Opened Dispute', `Order: ${orderId}, Reason: ${reason}`);

    addNotification(
      targetOrder.sellerId,
      '⚠️ Dispute Opened on Order',
      `Buyer ${currentUser.username} opened a dispute for order ${orderId}. Admin will review chat logs and credentials.`,
      'dispute',
      orderId
    );

    const adminUser = users.find(u => u.role === 'admin');
    if (adminUser) {
      addNotification(
        adminUser.id,
        '🚨 DISPUTE REQUIRING ADMIN RESOLUTION',
        `Dispute opened on order ${orderId} by ${currentUser.username}. Reason: ${reason}`,
        'dispute',
        orderId
      );
    }
  };

  // ADMIN RESOLVE DISPUTE
  const adminResolveDispute = (orderId: string, resolution: 'refund_buyer' | 'release_seller', decisionNotes: string) => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return;

    const resolvedAt = new Date().toISOString();

    if (resolution === 'release_seller') {
      const sellerEarnings = targetOrder.totalPaid;
      setUsers(prev => prev.map(u => {
        if (u.id === targetOrder.sellerId) {
          return {
            ...u,
            walletBalance: u.walletBalance + sellerEarnings,
            totalSales: u.totalSales + 1
          };
        }
        return u;
      }));
    } else if (resolution === 'refund_buyer') {
      // Refund buyer wallet
      setUsers(prev => prev.map(u => {
        if (u.id === targetOrder.buyerId) {
          return {
            ...u,
            walletBalance: u.walletBalance + targetOrder.totalPaid
          };
        }
        return u;
      }));
    }

    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: resolution === 'refund_buyer' ? 'refunded' : 'completed',
          dispute: o.dispute ? {
            ...o.dispute,
            status: resolution === 'refund_buyer' ? 'resolved_refund' : 'resolved_seller',
            adminDecision: decisionNotes,
            resolvedAt
          } : undefined,
          updatedAt: resolvedAt
        };
      }
      return o;
    }));

    addLog('user_admin_1', 'Admin_Official', 'Resolved Dispute', `Order: ${orderId}, Resolution: ${resolution}, Notes: ${decisionNotes}`);

    addNotification(
      targetOrder.buyerId,
      'Dispute Resolved by Admin',
      `Order ${orderId} dispute resolved: ${resolution === 'refund_buyer' ? 'Full refund credited to your wallet.' : 'Payment released to seller as credentials were valid.'}`,
      'dispute',
      orderId
    );

    addNotification(
      targetOrder.sellerId,
      'Dispute Resolved by Admin',
      `Order ${orderId} dispute resolved: ${resolution === 'release_seller' ? 'Payment released to your wallet.' : 'Refunded to buyer due to invalid credentials.'}`,
      'dispute',
      orderId
    );
  };

  // KYC VERIFICATION
  const submitKycVerification = (idDocumentUrl: string, selfieUrl: string, idNumber: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          kycStatus: 'pending',
          kycData: {
            idDocumentUrl,
            selfieUrl,
            idNumber,
            submittedAt: new Date().toISOString()
          }
        };
      }
      return u;
    }));

    setCurrentUser(prev => ({
      ...prev,
      kycStatus: 'pending',
      kycData: {
        idDocumentUrl,
        selfieUrl,
        idNumber,
        submittedAt: new Date().toISOString()
      }
    }));

    addLog(currentUser.id, currentUser.username, 'Submitted Seller KYC', `ID Number: ${idNumber}`);

    addNotification(currentUser.id, 'KYC Submitted', 'Your seller verification request is under review by Admin.', 'system');
  };

  const adminApproveKyc = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          kycStatus: 'approved',
          verifiedSeller: true
        };
      }
      return u;
    }));

    setListings(prev => prev.map(l => l.sellerId === userId ? { ...l, sellerVerified: true } : l));

    if (currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, kycStatus: 'approved', verifiedSeller: true }));
    }

    addNotification(userId, '🎉 Congratulations! You are a Trusted Seller', 'Your KYC has been approved! You now have the Trusted Seller badge on all listings.', 'system');
  };

  const adminRejectKyc = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, kycStatus: 'rejected' } : u));
    addNotification(userId, 'KYC Verification Rejected', 'Your seller verification was rejected. Please re-upload clear NID/Passport and selfie.', 'system');
  };

  // WALLET WITHDRAWAL
  const requestWithdrawal = (amount: number, method: 'bKash' | 'Nagad' | 'Rocket' | 'Bank', accountNumber: string) => {
    if (amount > currentUser.walletBalance) {
      alert("Insufficient wallet balance!");
      return;
    }

    // Deduct balance to pending
    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          walletBalance: u.walletBalance - amount,
          pendingBalance: u.pendingBalance + amount
        };
      }
      return u;
    }));

    setCurrentUser(prev => ({
      ...prev,
      walletBalance: prev.walletBalance - amount,
      pendingBalance: prev.pendingBalance + amount
    }));

    const newReq: WithdrawalRequest = {
      id: `WTH-${Math.floor(100 + Math.random() * 900)}`,
      sellerId: currentUser.id,
      sellerName: currentUser.username,
      amount,
      method,
      accountNumber,
      status: 'pending',
      requestedAt: new Date().toISOString()
    };

    setWithdrawals(prev => [newReq, ...prev]);

    addLog(currentUser.id, currentUser.username, 'Requested Withdrawal', `${amount} BDT via ${method} (${accountNumber})`);
    addNotification(currentUser.id, 'Withdrawal Requested', `Your cashout request of ${amount} BDT to ${method} (${accountNumber}) is pending Admin payout.`, 'wallet');
  };

  const adminApproveWithdrawal = (withdrawalId: string) => {
    const target = withdrawals.find(w => w.id === withdrawalId);
    if (!target) return;

    setWithdrawals(prev => prev.map(w => w.id === withdrawalId ? { ...w, status: 'approved', processedAt: new Date().toISOString() } : w));

    // Clear pending balance
    setUsers(prev => prev.map(u => {
      if (u.id === target.sellerId) {
        return {
          ...u,
          pendingBalance: Math.max(0, u.pendingBalance - target.amount)
        };
      }
      return u;
    }));

    addLog('user_admin_1', 'Admin_Official', 'Approved Withdrawal Cashout', `Seller: ${target.sellerName}, Amount: ${target.amount} BDT via ${target.method}`);
    addNotification(target.sellerId, '✅ Cashout Processed!', `Your withdrawal of ${target.amount} BDT to ${target.method} (${target.accountNumber}) has been sent!`, 'wallet');
  };

  // CHAT
  const sendChatMessage = (orderId: string, receiverId: string, message: string, attachmentUrl?: string) => {
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      orderId,
      senderId: currentUser.id,
      senderName: currentUser.username,
      senderAvatar: currentUser.avatar,
      receiverId,
      message,
      attachmentUrl,
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, newMsg]);
  };

  // ADMIN BAN USER
  const adminBanUser = (userId: string, ban: boolean) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isBanned: ban } : u));
    addLog('user_admin_1', 'Admin_Official', ban ? 'Banned User' : 'Unbanned User', `User ID: ${userId}`);
  };

  // COUPONS
  const createCoupon = (coupon: Omit<Coupon, 'id' | 'timesUsed'>) => {
    const newC: Coupon = {
      ...coupon,
      id: `coup_${Date.now()}`,
      timesUsed: 0
    };
    setCoupons(prev => [newC, ...prev]);
  };

  const deleteCoupon = (couponId: string) => {
    setCoupons(prev => prev.filter(c => c.id !== couponId));
  };

  const markNotificationRead = (notifId: string) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        lang,
        setLang,
        t,
        users,
        listings,
        orders,
        reviews,
        coupons,
        withdrawals,
        notifications,
        chatMessages,
        activityLogs,
        wishlist,
        toggleWishlist,
        createListing,
        updateListingStatus,
        submitPaymentOrder,
        adminApprovePayment,
        adminRejectPayment,
        sellerDeliverCredentials,
        buyerConfirmReceived,
        openDispute,
        adminResolveDispute,
        submitKycVerification,
        adminApproveKyc,
        adminRejectKyc,
        requestWithdrawal,
        adminApproveWithdrawal,
        sendChatMessage,
        adminBanUser,
        createCoupon,
        deleteCoupon,
        markNotificationRead,
        officialPaymentNumber: OFFICIAL_PAYMENT_NUMBER
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
