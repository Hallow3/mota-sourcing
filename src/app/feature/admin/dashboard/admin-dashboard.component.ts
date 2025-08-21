import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 p-8">
      <div class="max-w-7xl mx-auto">
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-white mb-2">Dashboard Administrateur</h1>
          <p class="text-gray-400">Gestion et supervision de la plateforme</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="p-6 border shadow-xl backdrop-blur-md bg-gray-800/40 border-gray-600/40 rounded-2xl">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-blue-500/20 border border-blue-400/30">
                <i class="fas fa-users text-blue-300 text-xl"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm text-gray-400">Total Utilisateurs</p>
                <p class="text-2xl font-bold text-white">1,234</p>
              </div>
            </div>
          </div>
          
          <div class="p-6 border shadow-xl backdrop-blur-md bg-gray-800/40 border-gray-600/40 rounded-2xl">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-green-500/20 border border-green-400/30">
                <i class="fas fa-shopping-cart text-green-300 text-xl"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm text-gray-400">Commandes</p>
                <p class="text-2xl font-bold text-white">567</p>
              </div>
            </div>
          </div>
          
          <div class="p-6 border shadow-xl backdrop-blur-md bg-gray-800/40 border-gray-600/40 rounded-2xl">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-yellow-500/20 border border-yellow-400/30">
                <i class="fas fa-clock text-yellow-300 text-xl"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm text-gray-400">En attente</p>
                <p class="text-2xl font-bold text-white">89</p>
              </div>
            </div>
          </div>
          
          <div class="p-6 border shadow-xl backdrop-blur-md bg-gray-800/40 border-gray-600/40 rounded-2xl">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-purple-500/20 border border-purple-400/30">
                <i class="fas fa-chart-line text-purple-300 text-xl"></i>
              </div>
              <div class="ml-4">
                <p class="text-sm text-gray-400">Revenus</p>
                <p class="text-2xl font-bold text-white">€45,678</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="text-center">
          <p class="text-gray-400 mb-4">Interface d'administration en cours de développement</p>
          <a routerLink="/mota/home" class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition duration-300">
            Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent {}