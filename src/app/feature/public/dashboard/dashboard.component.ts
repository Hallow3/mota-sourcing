import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../../core/service/order.service';
import { CurrencyService } from '../../../core/service/currency.service';
import { Order, OrderStatus, OrderSummary } from '../../../core/model/sourcing.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private orderService = inject(OrderService);
  private currencyService = inject(CurrencyService);

  orders: Order[] = [];
  orderSummary: OrderSummary | null = null;
  selectedOrder: Order | null = null;
  showOrderDetails = false;

  ngOnInit(): void {
    this.orderService.orders$.subscribe(orders => {
      this.orders = orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    });

    this.orderService.getOrderSummary().subscribe(summary => {
      this.orderSummary = summary;
    });
  }

  formatPrice(price: number): string {
    return this.currencyService.formatFcfa(price);
  }

  getStatusLabel(status: OrderStatus): string {
    return this.orderService.getStatusLabel(status);
  }

  getStatusColor(status: OrderStatus): string {
    return this.orderService.getStatusColor(status);
  }

  getStatusProgress(status: OrderStatus): number {
    switch (status) {
      case OrderStatus.PENDING: return 10;
      case OrderStatus.CONFIRMED: return 20;
      case OrderStatus.SOURCING: return 30;
      case OrderStatus.QUOTED: return 40;
      case OrderStatus.NEGOTIATING: return 50;
      case OrderStatus.PRODUCTION: return 70;
      case OrderStatus.QUALITY_CHECK: return 80;
      case OrderStatus.SHIPPING: return 90;
      case OrderStatus.DELIVERED: return 95;
      case OrderStatus.COMPLETED: return 100;
      case OrderStatus.CANCELLED: return 0;
      default: return 0;
    }
  }

  showDetails(order: Order): void {
    this.selectedOrder = order;
    this.showOrderDetails = true;
  }

  closeDetails(): void {
    this.showOrderDetails = false;
    this.selectedOrder = null;
  }

  getEstimatedDeliveryText(order: Order): string {
    if (!order.estimatedDelivery) return 'Non estimé';
    
    const now = new Date();
    const delivery = new Date(order.estimatedDelivery);
    const diffDays = Math.ceil((delivery.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Dépassé';
    if (diffDays === 0) return 'Aujourd\'hui';
    if (diffDays === 1) return 'Demain';
    return `Dans ${diffDays} jours`;
  }

  trackByOrderId(index: number, order: Order): string {
    return order.id;
  }

  trackByTrackingId(index: number, tracking: any): string {
    return tracking.id;
  }
}