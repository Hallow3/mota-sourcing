import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { UserResponse, RegisterRequest, ApiResponse, LoginRequest, AuthResponse, RefreshTokenRequest, ForgotPasswordRequest, ResetPasswordRequest } from '../model/auth.models';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = '/api';
  private currentUserSubject = new BehaviorSubject<UserResponse | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      try {
        const userData = JSON.parse(user);
        this.currentUserSubject.next(userData);
        this.isAuthenticatedSubject.next(true);
      } catch (error) {
        this.logout();
      }
    }
  }

  register(request: RegisterRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.API_URL}/auth/register`, request)
      .pipe(
        catchError(this.handleError)
      );
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, request)
      .pipe(
        tap(response => this.setSession(response)),
        catchError(this.handleError)
      );
  }

  logout(): void {
    this.clearSession();
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return throwError('No refresh token available');
    }

    const request: RefreshTokenRequest = { refreshToken };
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/refresh-token`, request)
      .pipe(
        tap(response => this.setSession(response)),
        catchError(error => {
          this.clearSession();
          return throwError(error);
        })
      );
  }

  forgotPassword(request: ForgotPasswordRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.API_URL}/auth/forgot-password`, request)
      .pipe(catchError(this.handleError));
  }

  resetPassword(request: ResetPasswordRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.API_URL}/auth/reset-password`, request)
      .pipe(catchError(this.handleError));
  }

  activateAccount(token: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.API_URL}/auth/activate?token=${token}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  resendActivationEmail(email: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.API_URL}/auth/resend-activation?email=${email}`, {})
      .pipe(catchError(this.handleError));
  }

  private setSession(authResponse: AuthResponse): void {
    localStorage.setItem('accessToken', authResponse.accessToken);
    localStorage.setItem('refreshToken', authResponse.refreshToken);
    localStorage.setItem('user', JSON.stringify(authResponse.user));
    
    this.currentUserSubject.next(authResponse.user);
    this.isAuthenticatedSubject.next(true);
  }

  private clearSession(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  private handleError(error: any): Observable<never> {
    console.error('Auth Service Error:', error);
    return throwError(error);
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getCurrentUser(): UserResponse | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getRedirectUrl(): string {
    const user = this.getCurrentUser();
    if (user) {
      return user.userType === 'ADMIN' ? '/admin/dashboard' : '/mota/dashboard';
    }
    return '/mota/home';
  }
}