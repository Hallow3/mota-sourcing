import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900">
      <!-- Background decoration -->
      <div class="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 relative">
        <!-- Header -->
        <div class="mb-6 sm:mb-8">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="flex items-center gap-4">
              <button (click)="goBack()" class="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700/50 transition">
                <i class="fas fa-arrow-left"></i>
              </button>
              <div>
                <h1 class="text-2xl sm:text-4xl font-bold text-white mb-2">
                  Admin <span class="text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text">Dashboard</span>
                </h1>
                <p class="text-lg sm:text-xl text-gray-300">Gérez les demandes et les utilisateurs</p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <a routerLink="/admin/pipeline" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition">Pipeline</a>
              <a routerLink="/admin/users" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition">Utilisateurs</a>
            </div>
          </div>
        </div>

        <!-- Admin Cards -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div class="p-4 sm:p-6 border shadow-xl backdrop-blur-md bg-gray-800/40 border-gray-600/40 rounded-2xl">
            <div class="flex flex-col sm:flex-row sm:items-center mb-4">
              <div class="p-2 sm:p-3 rounded-full bg-blue-500/20 border border-blue-400/30 mb-3 sm:mb-0">
                <i class="fas fa-tasks text-blue-300 text-lg sm:text-xl"></i>
              </div>
              <div class="sm:ml-4">
                <h3 class="text-base sm:text-lg font-semibold text-white">Pipeline des demandes</h3>
                <p class="text-sm text-gray-400 hidden sm:block">Gérer les demandes de sourcing</p>
              </div>
            </div>
            <a routerLink="/admin/pipeline" class="inline-flex items-center justify-center w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl transition duration-300 shadow-lg shadow-blue-500/25 font-semibold text-sm sm:text-base">
              <i class="fas fa-eye mr-2"></i>
              <span class="hidden sm:inline">Voir le </span>Pipeline
            </a>
          </div>

          <div class="p-4 sm:p-6 border shadow-xl backdrop-blur-md bg-gray-800/40 border-gray-600/40 rounded-2xl">
            <div class="flex flex-col sm:flex-row sm:items-center mb-4">
              <div class="p-2 sm:p-3 rounded-full bg-green-500/20 border border-green-400/30 mb-3 sm:mb-0">
                <i class="fas fa-users text-green-300 text-lg sm:text-xl"></i>
              </div>
              <div class="sm:ml-4">
                <h3 class="text-base sm:text-lg font-semibold text-white">Gestion des utilisateurs</h3>
                <p class="text-sm text-gray-400 hidden sm:block">Activer/désactiver les comptes</p>
              </div>
            </div>
            <a routerLink="/admin/users" class="inline-flex items-center justify-center w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl transition duration-300 shadow-lg shadow-green-500/25 font-semibold text-sm sm:text-base">
              <i class="fas fa-cog mr-2"></i>
              <span class="hidden sm:inline">Gérer les </span>Utilisateurs
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent {
  constructor(private router: Router, private location: Location) {}

  goBack() {
    this.location.back();
  }
}