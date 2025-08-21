import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SourcingRequestPayload, SourcingRequestResponse } from '../model/sourcing.model';

@Injectable({
  providedIn: 'root'
})
export class SourcingRequestService {
  private readonly API_URL = '/api';

  constructor(private http: HttpClient) {}

  submitSourcingRequest(payload: SourcingRequestPayload): Observable<SourcingRequestResponse> {
    return this.http.post<SourcingRequestResponse>(`${this.API_URL}/sourcing/submit`, payload)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    console.error('Sourcing Request Service Error:', error);
    throw error;
  }
}