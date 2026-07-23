import { AccountListing, User, Order, Review, Coupon, PaymentDetails, WithdrawalRequest, NotificationItem } from '../types';

export const OFFICIAL_PAYMENT_NUMBER = '01889828907';

export const initialUsers: User[] = [
  {
    id: 'user_buyer_1',
    username: 'ProGamer_BD',
    email: 'buyer@ffmarket.com',
    phone: '01712345678',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
    role: 'buyer',
    verifiedSeller: false,
    kycStatus: 'none',
    rating: 5.0,
    reviewCount: 3,
    walletBalance: 2500,
    pendingBalance: 0,
    referralCode: 'PRO8892',
    totalSales: 0,
    createdAt: '2026-01-10T10:00:00Z',
    deviceHistory: [
      { device: 'Redmi Note 12 Pro (Android 14)', ip: '103.145.72.12', lastLogin: '2026-07-23 09:30 AM' },
      { device: 'Chrome on Windows 11', ip: '103.145.72.12', lastLogin: '2026-07-22 08:15 PM' }
    ]
  },
  {
    id: 'user_seller_1',
    username: 'BooyahKing_BD',
    email: 'seller@ffmarket.com',
    phone: '01889828907',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    role: 'seller',
    verifiedSeller: true,
    kycStatus: 'approved',
    kycData: {
      idDocumentUrl: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=500&auto=format&fit=crop&q=80',
      selfieUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      submittedAt: '2026-02-01T12:00:00Z',
      idNumber: 'BD-1998721981290'
    },
    rating: 4.9,
    reviewCount: 28,
    walletBalance: 8400,
    pendingBalance: 3200,
    referralCode: 'BOOYAH99',
    totalSales: 34,
    createdAt: '2025-11-15T08:00:00Z',
    deviceHistory: [
      { device: 'Poco X3 Pro', ip: '103.200.12.44', lastLogin: '2026-07-23 10:10 AM' }
    ]
  },
  {
    id: 'user_admin_1',
    username: 'Admin_Official',
    email: 'admin@fftrustedmarket.com',
    phone: '01889828907',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    role: 'admin',
    verifiedSeller: true,
    kycStatus: 'approved',
    rating: 5.0,
    reviewCount: 150,
    walletBalance: 45000,
    pendingBalance: 12500,
    referralCode: 'ADMINVIP',
    totalSales: 210,
    createdAt: '2025-01-01T00:00:00Z'
  }
];

export const initialListings: AccountListing[] = [
  {
    id: 'ff_listing_101',
    sellerId: 'user_seller_1',
    sellerName: 'BooyahKing_BD',
    sellerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    sellerRating: 4.9,
    sellerVerified: true,
    title: '🔥 Max Level 78 | 5 Evo Guns Max | Sakura & Hip Hop Bundle Account',
    uid: '1928472910',
    server: 'BD',
    level: 78,
    rank: 'Grandmaster (Season 34)',
    evoGuns: [
      { name: 'AK-47 Blue Flame Dragon', level: 7, maxLevel: 7 },
      { name: 'M1887 Rapper Underworld', level: 7, maxLevel: 7 },
      { name: 'MP40 Cobra', level: 7, maxLevel: 7 },
      { name: 'Scar Megalodon Alpha', level: 6, maxLevel: 7 },
      { name: 'UMP Booyah Day', level: 7, maxLevel: 7 }
    ],
    elitePasses: 42,
    characters: ['Alok (Max)', 'Chrono', 'K', 'Homer', 'Tatsuya', 'Sonia', 'Skyler'],
    bundles: ['Sakura Season 1', 'Hip Hop Season 2', 'Red Criminal', 'Cobra Male Bundle', 'Arctic Blue'],
    images: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    price: 4500,
    originalPrice: 5200,
    description: '100% Old OG Account. Facebook single binded. No ban record. Full collection with top evo guns maxed out. Instant delivery after escrow payment verification.',
    status: 'active',
    sensitiveCredentials: {
      loginType: 'Facebook',
      loginEmail: 'booyah_og_78@gmail.com',
      loginPassword: 'FF_Secret_Pass_8892#',
      backupCodes: '8910-2391 | 1192-3810 | 2891-9920',
      additionalInfo: 'Facebook login. Code sent to phone 01889828907 if 2FA triggers.'
    },
    createdAt: '2026-07-20T14:30:00Z',
    views: 342,
    wishlistCount: 28,
    badges: ['Top Pick', 'Max Evo Guns', 'OG Pass']
  },
  {
    id: 'ff_listing_102',
    sellerId: 'user_seller_1',
    sellerName: 'BooyahKing_BD',
    sellerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    sellerRating: 4.9,
    sellerVerified: true,
    title: '⚡ Level 71 Heroic Account | MP40 Cobra Max | Green Criminal',
    uid: '8492019283',
    server: 'BD',
    level: 71,
    rank: 'Heroic 4 Star',
    evoGuns: [
      { name: 'MP40 Cobra', level: 7, maxLevel: 7 },
      { name: 'M1014 Green Dragon', level: 5, maxLevel: 7 },
      { name: 'XM8 Destiny Guardian', level: 4, maxLevel: 7 }
    ],
    elitePasses: 28,
    characters: ['Alok', 'Chrono', 'Wukong', 'K'],
    bundles: ['Green Criminal', 'Breakdancer Bundle', 'Street Boy'],
    images: [
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80'
    ],
    price: 2800,
    originalPrice: 3200,
    description: 'Clean Google Login account. Full skin collection with Green Criminal bundle. Perfect for rank push in BD server.',
    status: 'active',
    sensitiveCredentials: {
      loginType: 'Google',
      loginEmail: 'ff_green_criminal@gmail.com',
      loginPassword: 'SecureGooglePass2026!',
      backupCodes: '1234-5678 | 8765-4321',
      additionalInfo: 'Google Account details.'
    },
    createdAt: '2026-07-21T09:15:00Z',
    views: 189,
    wishlistCount: 15
  },
  {
    id: 'ff_listing_103',
    sellerId: 'user_admin_1',
    sellerName: 'Admin_Official',
    sellerAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    sellerRating: 5.0,
    sellerVerified: true,
    title: '💎 India Server Level 74 | Master Rank | M1887 Rapper Max',
    uid: '3819283019',
    server: 'IN',
    level: 74,
    rank: 'Master 12 Star',
    evoGuns: [
      { name: 'M1887 Rapper Underworld', level: 7, maxLevel: 7 },
      { name: 'AK-47 Blue Flame Dragon', level: 5, maxLevel: 7 }
    ],
    elitePasses: 35,
    characters: ['Alok', 'Tatsuya', 'Dimitri', 'Orion'],
    bundles: ['Purple Criminal', 'Angelical Pants', 'Season 8 Pass'],
    images: [
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80'
    ],
    price: 3200,
    description: 'Verified India server account. Includes rare Angelical Pants and maxed M1887 Rapper skin.',
    status: 'active',
    sensitiveCredentials: {
      loginType: 'VK',
      loginEmail: '+919876543210',
      loginPassword: 'VkIndiaPassword99#',
      backupCodes: '9982-1102'
    },
    createdAt: '2026-07-22T11:00:00Z',
    views: 240,
    wishlistCount: 19
  }
];

export const initialOrders: Order[] = [
  {
    id: 'ORD-9828-01',
    listingId: 'ff_listing_101',
    listingTitle: '🔥 Max Level 78 | 5 Evo Guns Max | Sakura & Hip Hop Bundle Account',
    listingImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    price: 4500,
    discountAmount: 200,
    couponCode: 'FFTRUST10',
    totalPaid: 4300,
    buyerId: 'user_buyer_1',
    buyerName: 'ProGamer_BD',
    buyerAvatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
    sellerId: 'user_seller_1',
    sellerName: 'BooyahKing_BD',
    status: 'pending_payment',
    paymentDetails: {
      method: 'bKash',
      senderNumber: '01889828907',
      trxId: '8N7A2X9P1L',
      amount: 4300,
      screenshotUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
      submittedAt: '2026-07-23T08:30:00Z',
      status: 'pending',
      adminNotes: 'User submitted bKash payment via 01889828907 with TrxID 8N7A2X9P1L. Pending admin verification.'
    },
    createdAt: '2026-07-23T08:30:00Z',
    updatedAt: '2026-07-23T08:30:00Z'
  },
  {
    id: 'ORD-9828-02',
    listingId: 'ff_listing_102',
    listingTitle: '⚡ Level 71 Heroic Account | MP40 Cobra Max | Green Criminal',
    listingImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
    price: 2800,
    discountAmount: 0,
    totalPaid: 2800,
    buyerId: 'user_buyer_1',
    buyerName: 'ProGamer_BD',
    buyerAvatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
    sellerId: 'user_seller_1',
    sellerName: 'BooyahKing_BD',
    status: 'payment_verified',
    paymentDetails: {
      method: 'Nagad',
      senderNumber: '01889828907',
      trxId: '9M3B7Y1K0Q',
      amount: 2800,
      submittedAt: '2026-07-22T14:00:00Z',
      verifiedAt: '2026-07-22T14:15:00Z',
      status: 'approved',
      adminNotes: 'Nagad TrxID 9M3B7Y1K0Q verified by Admin.'
    },
    createdAt: '2026-07-22T14:00:00Z',
    updatedAt: '2026-07-22T14:15:00Z'
  }
];

export const initialReviews: Review[] = [
  {
    id: 'rev_1',
    sellerId: 'user_seller_1',
    buyerId: 'user_buyer_1',
    buyerName: 'ProGamer_BD',
    buyerAvatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Super fast delivery! The account has all promised evo guns maxed out. Admin verified payment within 5 mins. Highly recommended trusted seller!',
    orderId: 'ORD-9001-OLD',
    createdAt: '2026-07-15T10:00:00Z'
  },
  {
    id: 'rev_2',
    sellerId: 'user_seller_1',
    buyerId: 'user_buyer_2',
    buyerName: 'FreeFireRider',
    buyerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    comment: '100% genuine seller. Escrow system worked perfectly and safe!',
    orderId: 'ORD-9002-OLD',
    createdAt: '2026-07-18T16:20:00Z'
  }
];

export const initialCoupons: Coupon[] = [
  {
    id: 'coup_1',
    code: 'FFTRUST10',
    discountPercent: 10,
    minSpend: 1000,
    expiryDate: '2026-12-31',
    usageLimit: 100,
    timesUsed: 14,
    isActive: true
  },
  {
    id: 'coup_2',
    code: 'BOOYAH100',
    fixedDiscount: 100,
    minSpend: 500,
    expiryDate: '2026-12-31',
    usageLimit: 500,
    timesUsed: 89,
    isActive: true
  },
  {
    id: 'coup_3',
    code: 'ESPORTS500',
    fixedDiscount: 500,
    minSpend: 3000,
    expiryDate: '2026-10-31',
    usageLimit: 50,
    timesUsed: 8,
    isActive: true
  }
];

export const initialWithdrawals: WithdrawalRequest[] = [
  {
    id: 'WTH-101',
    sellerId: 'user_seller_1',
    sellerName: 'BooyahKing_BD',
    amount: 3000,
    method: 'bKash',
    accountNumber: '01889828907',
    status: 'pending',
    requestedAt: '2026-07-22T18:00:00Z'
  }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif_1',
    userId: 'user_buyer_1',
    title: 'Payment Submitted',
    message: 'Your payment of 4300 BDT with TrxID 8N7A2X9P1L is waiting for Admin Approval.',
    type: 'payment',
    read: false,
    timestamp: '2026-07-23T08:30:00Z'
  },
  {
    id: 'notif_2',
    userId: 'user_seller_1',
    title: 'New Order Received',
    message: 'Buyer ProGamer_BD initiated order ORD-9828-01 for listing 🔥 Max Level 78.',
    type: 'order',
    read: false,
    timestamp: '2026-07-23T08:30:00Z'
  }
];
