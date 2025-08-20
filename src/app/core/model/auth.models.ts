export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  userType: 'ADMIN' | 'CLIENT' | 'OTHER';
  
  // Admin fields
  department?: string;
  adminLevel?: 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR';
  
  // Client fields
  company?: string;
  industry?: string;
  
  // Other fields
  category?: string;
  description?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: UserResponse;
}

export interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  userType: 'ADMIN' | 'CLIENT' | 'OTHER';
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Admin fields
  department?: string;
  adminLevel?: 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR';
  
  // Client fields
  company?: string;
  industry?: string;
  
  // Other fields
  category?: string;
  description?: string;
  
  roles: string[];
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  department?: string;
  company?: string;
  industry?: string;
  category?: string;
  description?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  timestamp: string;
}

export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  details?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}