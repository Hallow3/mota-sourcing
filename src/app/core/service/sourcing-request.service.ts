import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';
import { SourcingRequestFullDTO, SourcingRequestPayload, SourcingRequestResponse, RequestStatus, SourcingRequestSummaryDTO } from '../model/sourcing.model';

@Injectable({
  providedIn: 'root'
})
export class SourcingRequestService {
  private readonly API_URL = '/api';

  constructor(private http: HttpClient) { }

  submitSourcingRequest(payload: SourcingRequestPayload): Observable<SourcingRequestResponse> {
    return this.http.post<SourcingRequestResponse>(`${this.API_URL}/sourcing/submit`, payload)
      .pipe(
        catchError(this.handleError)
      );
  }

  getMyRequests(): Observable<SourcingRequestFullDTO[]> {
    return this.http.get<SourcingRequestFullDTO[]>(`${this.API_URL}/sourcing/my-requests`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getMyRequestById(id: number): Observable<SourcingRequestFullDTO | null> {
    return this.http.get<SourcingRequestFullDTO>(`${this.API_URL}/sourcing/my-requests/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getRequestsSummary(): Observable<SourcingRequestSummaryDTO> {
    return this.getMyRequests().pipe(
      map(requests => ({
        totalRequests: requests.length,
        pendingRequests: requests.filter(r =>
          r.requestStatus === RequestStatus.PENDING ||
          r.requestStatus === RequestStatus.SOURCING ||
          r.requestStatus === RequestStatus.PRODUCTION
        ).length,
        completedRequests: requests.filter(r => r.requestStatus === RequestStatus.COMPLETED).length,
        totalSpent: requests.reduce((total, request) => total + request.totalAmount, 0)
      }))
    );
  }

  getStatusLabel(status: RequestStatus): string {
    switch (status) {
      case RequestStatus.PENDING: return 'En attente';
      case RequestStatus.CONFIRMED: return 'Confirmé';
      case RequestStatus.SOURCING: return 'Sourcing en cours';
      case RequestStatus.QUOTED: return 'Devis reçu';
      case RequestStatus.NEGOTIATING: return 'Négociation';
      case RequestStatus.PRODUCTION: return 'En production';
      case RequestStatus.QUALITY_CHECK: return 'Contrôle qualité';
      case RequestStatus.SHIPPING: return 'Expédition';
      case RequestStatus.DELIVERED: return 'Livré';
      case RequestStatus.COMPLETED: return 'Terminé';
      case RequestStatus.CANCELLED: return 'Annulé';
      default: return status;
    }
  }

  getStatusColor(status: RequestStatus): string {
    switch (status) {
      case RequestStatus.PENDING: return 'text-yellow-400';
      case RequestStatus.CONFIRMED: return 'text-blue-400';
      case RequestStatus.SOURCING: return 'text-indigo-400';
      case RequestStatus.QUOTED: return 'text-purple-400';
      case RequestStatus.NEGOTIATING: return 'text-orange-400';
      case RequestStatus.PRODUCTION: return 'text-cyan-400';
      case RequestStatus.QUALITY_CHECK: return 'text-teal-400';
      case RequestStatus.SHIPPING: return 'text-blue-300';
      case RequestStatus.DELIVERED: return 'text-green-400';
      case RequestStatus.COMPLETED: return 'text-green-500';
      case RequestStatus.CANCELLED: return 'text-red-400';
      default: return 'text-gray-400';
    }
  }

  private handleError(error: any): Observable<never> {
    console.error('Sourcing Request Service Error:', error);
    throw error;
  }
}