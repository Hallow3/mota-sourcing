import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SourcingService } from '../../../core/service/sourcing.service';
import { CurrencyService } from '../../../core/service/currency.service';
import { OrderService } from '../../../core/service/order.service';
import { CartItem, CustomerInfo, ShippingInfo } from '../../../core/model/sourcing.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private sourcingService = inject(SourcingService);
  private currencyService = inject(CurrencyService);
  private orderService = inject(OrderService);

  checkoutForm: FormGroup;
  cartItems: CartItem[] = [];
  isSubmitting = false;

  constructor() {
    this.checkoutForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      company: [''],
      country: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      zipCode: ['', Validators.required],
      logisticsPreferences: [''],
      acceptTerms: [false, Validators.requiredTrue]
    });

    this.sourcingService.cart$.subscribe(items => {
      this.cartItems = items;
    });
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

  getOptionsText(options: any[]): string {
    return options.map(o => o.name).join(', ');
  }

  trackByItemId(index: number, item: CartItem): string {
    return item.id;
  }

  onSubmit(): void {
    if (this.checkoutForm.valid && this.cartItems.length > 0) {
      this.isSubmitting = true;

      // Create customer and shipping info
      const customerInfo: CustomerInfo = {
        firstName: this.checkoutForm.value.firstName,
        lastName: this.checkoutForm.value.lastName,
        email: this.checkoutForm.value.email,
        phone: this.checkoutForm.value.phone,
        company: this.checkoutForm.value.company || undefined
      };

      const shippingInfo: ShippingInfo = {
        country: this.checkoutForm.value.country,
        address: this.checkoutForm.value.address,
        city: this.checkoutForm.value.city,
        zipCode: this.checkoutForm.value.zipCode,
        logisticsPreferences: this.checkoutForm.value.logisticsPreferences || undefined
      };

      // Simulate API call
      setTimeout(() => {
        // Create order
        const newOrder = this.orderService.createOrder(this.cartItems, customerInfo, shippingInfo);
        
        // Clear cart
        this.sourcingService.clearCart();
        
        // Navigate to dashboard with success message
        this.router.navigate(['/mota/dashboard'], { 
          queryParams: { 
            success: true, 
            order: newOrder.orderNumber 
          } 
        });
      }, 2000);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.checkoutForm.controls).forEach(key => {
        this.checkoutForm.get(key)?.markAsTouched();
      });
    }
  }
}