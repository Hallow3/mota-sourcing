export interface SourcingCategory {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  features: string[];
}

export interface RFQRequest {
  id?: number;
  categoryId: number;
  productDescription: string;
  quantity: number;
  budget?: number;
  files: File[];
  productUrls: string[];
  productImage?: string;
  createdAt?: Date;
  status?: RFQStatus;
}

export interface CartItem {
  id: string;
  rfqRequest: RFQRequest;
  category: SourcingCategory;
  options: SourcingOption[];
  totalPrice: number;
}

export interface SourcingOption {
  id: number;
  name: string;
  description: string;
  price: number;
  selected: boolean;
}

export interface CheckoutData {
  customerInfo: CustomerInfo;
  shippingInfo: ShippingInfo;
  cartItems: CartItem[];
  totalAmount: number;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
}

export interface ShippingInfo {
  country: string;
  address: string;
  city: string;
  zipCode: string;
  logisticsPreferences?: string;
}

export enum RFQStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  IN_REVIEW = 'IN_REVIEW',
  QUOTED = 'QUOTED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SOURCING = 'SOURCING',
  QUOTED = 'QUOTED',
  NEGOTIATING = 'NEGOTIATING',
  PRODUCTION = 'PRODUCTION',
  QUALITY_CHECK = 'QUALITY_CHECK',
  SHIPPING = 'SHIPPING',
  DELIVERED = 'DELIVERED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface Order {
  id: string;
  orderNumber: string;
  cartItems: CartItem[];
  customerInfo: CustomerInfo;
  shippingInfo: ShippingInfo;
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  estimatedDelivery?: Date;
  tracking?: OrderTracking[];
  notes?: string;
}

export interface OrderTracking {
  id: string;
  orderId: string;
  status: OrderStatus;
  message: string;
  timestamp: Date;
  location?: string;
  documents?: string[];
}

export interface OrderSummary {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalSpent: number;
}