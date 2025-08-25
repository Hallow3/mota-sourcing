import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface PopupConfig {
  type: 'confirm' | 'success' | 'error' | 'warning';
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  private popupSubject = new BehaviorSubject<PopupConfig | null>(null);
  public popup$ = this.popupSubject.asObservable();

  confirm(title: string, message: string, onConfirm: () => void, onCancel?: () => void): void {
    this.popupSubject.next({
      type: 'confirm',
      title,
      message,
      confirmText: 'Confirmer',
      cancelText: 'Annuler',
      onConfirm,
      onCancel
    });
  }

  success(title: string, message: string): void {
    this.popupSubject.next({
      type: 'success',
      title,
      message,
      confirmText: 'OK'
    });
  }

  error(title: string, message: string): void {
    this.popupSubject.next({
      type: 'error',
      title,
      message,
      confirmText: 'OK'
    });
  }

  warning(title: string, message: string): void {
    this.popupSubject.next({
      type: 'warning',
      title,
      message,
      confirmText: 'OK'
    });
  }

  close(): void {
    this.popupSubject.next(null);
  }
}