import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupService, PopupConfig } from './popup.service';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.css'
})
export class PopupComponent {
  private popupService = inject(PopupService);
  
  popup$ = this.popupService.popup$;

  onConfirm(config: PopupConfig): void {
    if (config.onConfirm) {
      config.onConfirm();
    }
    this.popupService.close();
  }

  onCancel(config: PopupConfig): void {
    if (config.onCancel) {
      config.onCancel();
    }
    this.popupService.close();
  }

  onClose(): void {
    this.popupService.close();
  }

  getIconClass(type: string): string {
    switch (type) {
      case 'success': return 'fas fa-check-circle text-green-400';
      case 'error': return 'fas fa-times-circle text-red-400';
      case 'warning': return 'fas fa-exclamation-triangle text-yellow-400';
      case 'confirm': return 'fas fa-question-circle text-blue-400';
      default: return 'fas fa-info-circle text-gray-400';
    }
  }

  getBorderClass(type: string): string {
    switch (type) {
      case 'success': return 'border-green-500/50';
      case 'error': return 'border-red-500/50';
      case 'warning': return 'border-yellow-500/50';
      case 'confirm': return 'border-blue-500/50';
      default: return 'border-gray-500/50';
    }
  }
}