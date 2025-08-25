import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SourcingRequestService } from '../../../core/service/sourcing-request.service';
import { CurrencyService } from '../../../core/service/currency.service';
import { SourcingRequestFullDTO, SourcingRequestSummaryDTO, RequestStatus } from '../../../core/model/sourcing.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private sourcingRequestService = inject(SourcingRequestService);
  private currencyService = inject(CurrencyService);

  requests: SourcingRequestFullDTO[] = [];
  requestSummary: SourcingRequestSummaryDTO | null = null;
  selectedRequest: SourcingRequestFullDTO | null = null;
  showRequestDetails = false;

  ngOnInit(): void {
    this.sourcingRequestService.getMyRequests().subscribe(requests => {
      this.requests = requests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    });

    this.sourcingRequestService.getRequestsSummary().subscribe(summary => {
      this.requestSummary = summary;
    });
  }

  formatPrice(price: number): string {
    return this.currencyService.formatFcfa(price);
  }

  getStatusLabel(status: RequestStatus): string {
    return this.sourcingRequestService.getStatusLabel(status);
  }

  getStatusColor(status: RequestStatus): string {
    return this.sourcingRequestService.getStatusColor(status);
  }

  getStatusProgress(status: RequestStatus): number {
    switch (status) {
      case RequestStatus.PENDING: return 10;
      case RequestStatus.CONFIRMED: return 20;
      case RequestStatus.SOURCING: return 30;
      case RequestStatus.QUOTED: return 40;
      case RequestStatus.NEGOTIATING: return 50;
      case RequestStatus.PRODUCTION: return 70;
      case RequestStatus.QUALITY_CHECK: return 80;
      case RequestStatus.SHIPPING: return 90;
      case RequestStatus.DELIVERED: return 95;
      case RequestStatus.COMPLETED: return 100;
      case RequestStatus.CANCELLED: return 0;
      default: return 0;
    }
  }

  showDetails(request: SourcingRequestFullDTO): void {
    this.sourcingRequestService.getMyRequestById(request.id).subscribe(fullRequest => {

      console.log("-------",fullRequest);

      if (fullRequest) {
        this.selectedRequest = fullRequest;
        this.showRequestDetails = true;
      }
    });
  }

  closeDetails(): void {
    this.showRequestDetails = false;
    this.selectedRequest = null;
  }

  getEstimatedDeliveryText(request: SourcingRequestFullDTO): string {
    let estimatedDays = 0;
    
    switch (request.requestStatus) {
      case RequestStatus.PENDING:
      case RequestStatus.SOURCING:
        estimatedDays = 30;
        break;
      case RequestStatus.QUOTED:
      case RequestStatus.NEGOTIATING:
        estimatedDays = 25;
        break;
      case RequestStatus.PRODUCTION:
        estimatedDays = 15;
        break;
      case RequestStatus.QUALITY_CHECK:
        estimatedDays = 10;
        break;
      case RequestStatus.SHIPPING:
        estimatedDays = 5;
        break;
      case RequestStatus.DELIVERED:
      case RequestStatus.COMPLETED:
        return 'Livré';
      default:
        return 'Non estimé';
    }
    
    if (estimatedDays === 0) return 'Aujourd\'hui';
    if (estimatedDays === 1) return 'Demain';
    return `Dans ${estimatedDays} jours`;
  }

  trackByRequestId(index: number, request: SourcingRequestFullDTO): number {
    return request.id;
  }


}