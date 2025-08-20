import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  // Taux de change EUR vers FCFA (Franc CFA)
  private readonly EUR_TO_FCFA = 655.957;

  convertEurToFcfa(eurAmount: number): number {
    return Math.round(eurAmount * this.EUR_TO_FCFA);
  }

  formatFcfa(fcfaAmount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      maximumFractionDigits: 0
    }).format(fcfaAmount) + ' FCFA';
  }

  formatEurAsFcfa(eurAmount: number): string {
    const fcfaAmount = this.convertEurToFcfa(eurAmount);
    return this.formatFcfa(fcfaAmount);
  }
}