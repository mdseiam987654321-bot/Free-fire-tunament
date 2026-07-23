export type UserRole = 'buyer' | 'seller' | 'admin';

export type KYCStatus = 'none' | 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  avatar: string;
  role: UserRole;
  verifiedSeller: boolean;
  kycStatus: KYCStatus;
  kycData?: {
    idDocumentUrl?: string;
    selfieUrl?: string;
    submittedAt?: string;
    idNumber?: string;
  };
  rating: number;
  reviewCount: number;
  walletBalance: number;
  pendingBalance: number;
  referralCode: string;
  referredBy?: string;
  totalSales: number;
  createdAt: string;
  isBanned?: boolean;
  deviceHistory?: {
    device: string;
    ip: string;
    lastLogin: string;
  }[];
}

export type ServerRegion = 'BD' | 'IN' | 'SG' | 'NA' | 'EU' | 'BR' | 'ME';

export type ListingStatus = 'active' | 'pending_approval' | 'sold' | 'suspended';

export interface SensitiveCredentials {
  loginType: 'Facebook' | 'Google' | 'VK' | 'Twitter';
  loginEmail: string;
  loginPassword?: string;
  backupCodes?: string;
  additionalInfo?: string;
}

export interface AccountListing {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  sellerRating: number;
  sellerVerified: boolean;
  title: string;
  uid: string;
  server: ServerRegion;
  level: number;
  rank: string;
  evoGuns: { name: string; level: number; maxLevel: number }[];
  elitePasses: number;
  characters: string[];
  bundles: string[];
  images: string[];
  videoUrl?: string;
  price: number;
  originalPrice?: number;
  description: string;
  status: ListingStatus;
  sensitiveCredentials: SensitiveCredentials;
  createdAt: string;
  views: number;
  wishlistCount: number;
  badges?: string[];
}

export type OrderStatus =
  | 'pending_payment'
  | 'payment_verified'
  | 'delivered'
  | 'completed'
  | 'disputed'
  | 'refunded'
  | 'cancelled';

export interface PaymentDetails {
  method: 'bKash' | 'Nagad' | 'Rocket' | 'Bank';
  senderNumber: string;
  trxId: string;
  amount: number;
  screenshotUrl?: string;
  submittedAt: string;
  verifiedAt?: string;
  adminNotes?: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Order {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  price: number;
  discountAmount: number;
  couponCode?: string;
  totalPaid: number;
  buyerId: string;
  buyerName: string;
  buyerAvatar: string;
  sellerId: string;
  sellerName: string;
  status: OrderStatus;
  paymentDetails: PaymentDetails;
  credentialsDelivered?: SensitiveCredentials & { deliveredAt: string };
  dispute?: {
    openedBy: string;
    reason: string;
    status: 'open' | 'resolved_refund' | 'resolved_seller';
    adminDecision?: string;
    openedAt: string;
    resolvedAt?: string;
  };
  createdAt: string;
  updatedAt: string;
  deliveryTimeLimitMs?: number; // 24h verification timer
}

export interface ChatMessage {
  id: string;
  orderId?: string;
  listingId?: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  receiverId: string;
  message: string;
  attachmentUrl?: string;
  timestamp: string;
  isSystem?: boolean;
}

export interface Review {
  id: string;
  sellerId: string;
  buyerId: string;
  buyerName: string;
  buyerAvatar: string;
  rating: number;
  comment: string;
  orderId: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent?: number;
  fixedDiscount?: number;
  minSpend?: number;
  expiryDate: string;
  usageLimit: number;
  timesUsed: number;
  isActive: boolean;
}

export interface WithdrawalRequest {
  id: string;
  sellerId: string;
  sellerName: string;
  amount: number;
  method: 'bKash' | 'Nagad' | 'Rocket' | 'Bank';
  accountNumber: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  processedAt?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'payment' | 'delivery' | 'dispute' | 'system' | 'wallet';
  read: boolean;
  timestamp: string;
  linkId?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}
