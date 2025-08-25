import { UserResponse } from './auth.models';

export interface SourcingCategory {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  features: string[];
  image: string;
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

export enum RequestStatus {
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

export interface SourcingRequestBasicDTO {
  id: number;
  totalAmount: number;
  requestStatus: RequestStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface SourcingRequestFullDTO extends SourcingRequestBasicDTO {
  shippingInfo: ShippingInfo;
  user: UserResponse;
  cartItems: CartItem[];
}

export interface SourcingRequestPayload {
  shippingInfo: ShippingInfo;
  cartItems: CartItem[];
  totalAmount: number;
  user: UserResponse;
}

export interface SourcingRequestResponse {
  success: boolean;
  message: string;
  orderId?: string;
  orderNumber?: string;
}
export enum SourcingRequestStatus {
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

export interface SourcingRequestSummaryDTO {
  totalRequests: number;
  pendingRequests: number;
  completedRequests: number;
  totalSpent: number;
}