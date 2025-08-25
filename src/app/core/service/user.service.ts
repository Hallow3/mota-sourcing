import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { ApiResponse, ChangePasswordRequest, UpdateProfileRequest, UserResponse } from '../model/auth.models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = '/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getProfile(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.API_URL}/user/profile`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  updateProfile(request: UpdateProfileRequest): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.API_URL}/user/profile`, request, {
      headers: this.getHeaders()
    }).pipe(
      tap(user => {
        // Update user in localStorage
        localStorage.setItem('user', JSON.stringify(user));
      }),
      catchError(this.handleError)
    );
  }

  changePassword(request: ChangePasswordRequest): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.API_URL}/user/change-password`, request, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  getAllUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${this.API_URL}/user/admin/users`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  getUserById(userId: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.API_URL}/user/admin/users/${userId}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  toggleUserStatus(userId: number): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.API_URL}/user/admin/users/${userId}/toggle-status`, {}, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  deactivateAccount(): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.API_URL}/user/deactivate`, {
      headers: this.getHeaders()
    }).pipe(
      tap(() => {
        // Clear session after deactivation
        this.authService.logout();
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('User Service Error:', error);
    return throwError(error);
  }
}