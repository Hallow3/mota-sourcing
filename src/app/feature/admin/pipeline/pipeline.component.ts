import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { SourcingRequestService } from '../../../core/service/sourcing-request.service';
import { SourcingRequestFullDTO, RequestStatus } from '../../../core/model/sourcing.model';

@Component({
  selector: 'app-pipeline',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900">
      <!-- Background decoration -->
      <div class="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 relative">
        <!-- Header -->
        <div class="mb-6 sm:mb-8">
          <div class="flex items-center gap-4 mb-4">
            <button (click)="goBack()" class="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700/50 transition">
              <i class="fas fa-arrow-left"></i>
            </button>
            <div>
              <h1 class="text-2xl sm:text-4xl font-bold text-white mb-2">
                Pipeline <span class="text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text">Demandes</span>
              </h1>
              <p class="text-lg sm:text-xl text-gray-300">Gérez les demandes de sourcing en mode kanban</p>
            </div>
          </div>
          
          <!-- Filters -->
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="relative">
              <input [(ngModel)]="searchTerm" (input)="filterRequests()" 
                     placeholder="Rechercher par ID, nom..."
                     class="w-full sm:w-64 px-4 py-2 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <i class="fas fa-search absolute right-3 top-3 text-gray-400"></i>
            </div>
            <select [(ngModel)]="sortBy" (change)="sortRequests()" 
                    class="px-4 py-2 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="date">Trier par date</option>
              <option value="amount">Trier par montant</option>
              <option value="status">Trier par statut</option>
            </select>
          </div>
        </div>
        
@defer (when !isLoading) {
  <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
    <div *ngFor="let column of kanbanColumns" class="p-3 sm:p-4 border shadow-xl backdrop-blur-md bg-gray-800/40 border-gray-600/40 rounded-2xl">
      <div class="flex items-center justify-between mb-3 sm:mb-4">
        <h2 class="text-sm sm:text-base font-semibold text-white">{{ column.title }}</h2>
        <span class="bg-indigo-500/20 text-indigo-300 text-xs font-medium px-2 py-0.5 rounded-full border border-indigo-400/30">
          {{ column.requests.length }}
        </span>
      </div>
      
      <div class="space-y-2 sm:space-y-3">
        @for (request of column.requests; track $index) {
          <div *ngFor="let request of column.requests" 
             class="bg-gray-700/30 border border-gray-600/30 rounded-xl p-2 sm:p-3 cursor-pointer hover:bg-gray-700/40 transition-all duration-300"
             (click)="selectRequest(request)">
          <div class="flex justify-between items-start mb-2">
            <span class="text-xs sm:text-sm font-medium text-white">#{{ request.id }}</span>
            <span class="text-xs text-gray-400 hidden sm:inline">{{ request.createdAt | date:'short' }}</span>
          </div>
          <p class="text-xs sm:text-sm text-gray-300 mb-1 sm:mb-2 truncate">{{ request.user.firstName }} {{ request.user.lastName }}</p>
          <p class="text-xs sm:text-sm font-medium text-indigo-300 mb-2">{{ request.totalAmount | currency:'EUR' }}</p>
          
          <div class="flex flex-wrap gap-1">
            <button *ngFor="let action of getAvailableActions(request.requestStatus)"
                    (click)="updateStatus(request, action.status, $event)"
                    class="text-xs px-2 py-1 rounded-lg text-white font-medium transition-all duration-200 whitespace-nowrap"
                    [ngClass]="action.class">
              {{ action.label }}
            </button>
          </div>
        </div>
        }
        @empty {
  <div class="text-center py-12">
    <div class="text-gray-400 mb-4">
      <i class="fas fa-inbox text-4xl"></i>
    </div>
    <h3 class="text-xl font-semibold text-white mb-2">Aucune demande</h3>
    <p class="text-gray-400">Aucune demande de sourcing trouvée</p>
  </div>
}
      </div>
    </div>
  </div>
} @loading {
  <div class="flex justify-center items-center py-12">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
  </div>
} @error {
  <div class="text-center py-12">
    <div class="text-red-400 mb-4">
      <i class="fas fa-exclamation-triangle text-4xl"></i>
    </div>
    <h3 class="text-xl font-semibold text-white mb-2">Erreur de chargement</h3>
    <p class="text-gray-400 mb-4">Impossible de charger les demandes</p>
    <button (click)="loadRequests()" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition">
      Réessayer
    </button>
  </div>
}
      </div>
    </div>
  `
})
export class PipelineComponent implements OnInit {
  requests: SourcingRequestFullDTO[] = [];
  filteredRequests: SourcingRequestFullDTO[] = [];
  isLoading = false;
  searchTerm = '';
  sortBy = 'date';

  kanbanColumns = [
    { title: 'En attente', status: 'PENDING', requests: [] as SourcingRequestFullDTO[] },
    { title: 'Confirmé', status: 'CONFIRMED', requests: [] as SourcingRequestFullDTO[] },
    { title: 'En cours', status: 'SOURCING', requests: [] as SourcingRequestFullDTO[] },
    { title: 'Terminé/Rejeté', status: 'COMPLETED', requests: [] as SourcingRequestFullDTO[] }
  ];

  constructor(
    private sourcingRequestService: SourcingRequestService,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.isLoading = true;
    this.sourcingRequestService.getAllRequests().subscribe({
      next: requests => {
        this.requests = requests;
        this.filteredRequests = [...requests];
        this.organizeRequestsByStatus();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  organizeRequestsByStatus() {
    this.kanbanColumns.forEach(column => column.requests = []);

    this.filteredRequests.forEach(request => {
      if (request.requestStatus === RequestStatus.PENDING) {
        this.kanbanColumns[0].requests.push(request);
      } else if (request.requestStatus === RequestStatus.CONFIRMED) {
        this.kanbanColumns[1].requests.push(request);
      } else if ([RequestStatus.SOURCING, RequestStatus.QUOTED, RequestStatus.NEGOTIATING, RequestStatus.PRODUCTION, RequestStatus.QUALITY_CHECK, RequestStatus.SHIPPING].includes(request.requestStatus)) {
        this.kanbanColumns[2].requests.push(request);
      } else {
        this.kanbanColumns[3].requests.push(request);
      }
    });
  }

  getAvailableActions(status: RequestStatus) {
    const actions = [];

    switch (status) {
      case RequestStatus.PENDING:
        actions.push(
          { label: 'Confirmer', status: RequestStatus.CONFIRMED, class: 'bg-green-500 hover:bg-green-600' },
          { label: 'Rejeter', status: RequestStatus.CANCELLED, class: 'bg-red-500 hover:bg-red-600' }
        );
        break;
      case RequestStatus.CONFIRMED:
        actions.push(
          { label: 'Sourcing', status: RequestStatus.SOURCING, class: 'bg-blue-500 hover:bg-blue-600' }
        );
        break;
      case RequestStatus.SOURCING:
        actions.push(
          { label: 'Devis', status: RequestStatus.QUOTED, class: 'bg-yellow-500 hover:bg-yellow-600' }
        );
        break;
      case RequestStatus.QUOTED:
        actions.push(
          { label: 'Production', status: RequestStatus.PRODUCTION, class: 'bg-purple-500 hover:bg-purple-600' }
        );
        break;
      case RequestStatus.PRODUCTION:
        actions.push(
          { label: 'Contrôle', status: RequestStatus.QUALITY_CHECK, class: 'bg-indigo-500 hover:bg-indigo-600' }
        );
        break;
      case RequestStatus.QUALITY_CHECK:
        actions.push(
          { label: 'Expédition', status: RequestStatus.SHIPPING, class: 'bg-teal-500 hover:bg-teal-600' }
        );
        break;
      case RequestStatus.SHIPPING:
        actions.push(
          { label: 'Livré', status: RequestStatus.DELIVERED, class: 'bg-green-600 hover:bg-green-700' }
        );
        break;
      case RequestStatus.DELIVERED:
        actions.push(
          { label: 'Terminé', status: RequestStatus.COMPLETED, class: 'bg-gray-600 hover:bg-gray-700' }
        );
        break;
    }

    return actions;
  }

  updateStatus(request: SourcingRequestFullDTO, newStatus: RequestStatus, event: Event) {
    event.stopPropagation();

    this.sourcingRequestService.updateRequestStatus(request.id, newStatus).subscribe(() => {
      request.requestStatus = newStatus;
      this.organizeRequestsByStatus();
    });
  }

  filterRequests() {
    if (!this.searchTerm) {
      this.filteredRequests = [...this.requests];
    } else {
      this.filteredRequests = this.requests.filter(request =>
        request.id.toString().includes(this.searchTerm) ||
        `${request.user.firstName} ${request.user.lastName}`.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.organizeRequestsByStatus();
  }

  sortRequests() {
    this.filteredRequests.sort((a, b) => {
      switch (this.sortBy) {
        case 'amount':
          return b.totalAmount - a.totalAmount;
        case 'status':
          return a.requestStatus.localeCompare(b.requestStatus);
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
    this.organizeRequestsByStatus();
  }

  goBack() {
    this.location.back();
  }

  selectRequest(request: SourcingRequestFullDTO) {
    console.log('Selected request:', request);
  }
}