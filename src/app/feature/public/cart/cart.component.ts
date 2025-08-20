import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SourcingService } from '../../../core/service/sourcing.service';
import { CurrencyService } from '../../../core/service/currency.service';
import { CartItem } from '../../../core/model/sourcing.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html'
})
export class CartComponent {
  private router = inject(Router);
  private sourcingService = inject(SourcingService);
  private currencyService = inject(CurrencyService);

  cartItems: CartItem[] = [];

  constructor() {
    this.sourcingService.cart$.subscribe(items => {
      this.cartItems = items;
    });
  }

  removeItem(itemId: string): void {
    this.sourcingService.removeFromCart(itemId);
  }

  getTotalPrice(): number {
    return this.sourcingService.getCartTotal();
  }

  getTotalPriceFormatted(): string {
    return this.currencyService.formatFcfa(this.getTotalPrice());
  }

  formatPrice(price: number): string {
    return this.currencyService.formatFcfa(price);
  }

  trackByItemId(index: number, item: CartItem): string {
    return item.id;
  }

  trackByOptionId(index: number, option: any): number {
    return option.id;
  }

  proceedToCheckout(): void {
    this.router.navigate(['/mota/checkout']);
  }
}