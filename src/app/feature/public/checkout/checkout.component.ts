import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SourcingService } from '../../../core/service/sourcing.service';
import { CurrencyService } from '../../../core/service/currency.service';
import { OrderService } from '../../../core/service/order.service';
import { AuthService } from '../../../core/service/auth.service';
import { SourcingRequestService } from '../../../core/service/sourcing-request.service';
import { CartItem, ShippingInfo, SourcingRequestPayload } from '../../../core/model/sourcing.model';
import { UserResponse } from '../../../core/model/auth.models';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  public sourcingService = inject(SourcingService);
  private currencyService = inject(CurrencyService);
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private sourcingRequestService = inject(SourcingRequestService);

  checkoutForm: FormGroup;
  cartItems: CartItem[] = [];
  isSubmitting = false;
  isAuthenticated = false;
  currentUser: UserResponse = {} as UserResponse;

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

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
    });
    
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user!;
      if (user) {
        this.prefillUserData(user);
      }
    });
  }

  private prefillUserData(user: UserResponse): void {
    this.checkoutForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || '',
      company: user.company || ''
    });
    
    // Disable user info fields for authenticated users
    if (this.isAuthenticated) {
      this.checkoutForm.get('firstName')?.disable();
      this.checkoutForm.get('lastName')?.disable();
      this.checkoutForm.get('email')?.disable();
      this.checkoutForm.get('phone')?.disable();
      this.checkoutForm.get('company')?.disable();
    }
  }

  public isShippingFormValid(): boolean {
    const shippingFields = ['country', 'address', 'city', 'zipCode', 'acceptTerms'];
    return shippingFields.every(field => {
      const control = this.checkoutForm.get(field);
      return control && control.valid;
    });
  }

  getTotalPrice(): number {
    const total = this.sourcingService.getCartTotal();
    // Premier sourcing gratuit pour les utilisateurs non connectés
    if (!this.isAuthenticated && this.cartItems.length > 0) {
      const firstItemPrice = this.cartItems[0].totalPrice;
      return Math.max(0, total - firstItemPrice);
    }
    return total;
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

  getFirstItemDiscount(): number {
    if (!this.isAuthenticated && this.cartItems.length > 0) {
      return this.cartItems[0].totalPrice;
    }
    return 0;
  }

  hasFirstItemDiscount(): boolean {
    return !this.isAuthenticated && this.cartItems.length > 0;
  }

  onSubmit(): void {
    const isFormValid = this.isAuthenticated ? 
      this.isShippingFormValid() : 
      this.checkoutForm.valid;
      
    if (isFormValid && this.cartItems.length > 0) {
      this.isSubmitting = true;

      const shippingInfo: ShippingInfo = {
        country: this.checkoutForm.value.country,
        address: this.checkoutForm.value.address,
        city: this.checkoutForm.value.city,
        zipCode: this.checkoutForm.value.zipCode,
        logisticsPreferences: this.checkoutForm.value.logisticsPreferences 
      };

      const userResponse: Partial<UserResponse> = {
        firstName: this.checkoutForm.value.firstName,
        lastName: this.checkoutForm.value.lastName,
        email: this.checkoutForm.value.email,
        phone: this.checkoutForm.value.phone,
        company: this.checkoutForm.value.company || '',
        userType: 'CLIENT',
        isActive: true,
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const payload: SourcingRequestPayload = {
        shippingInfo,
        cartItems: this.cartItems,
        totalAmount: this.getTotalPrice(),
        user: this.isAuthenticated ? this.currentUser : userResponse as UserResponse
      };

      this.sourcingRequestService.submitSourcingRequest(payload).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          if (response.success) {
            // Clear cart
            this.sourcingService.clearCart();
            
            // Navigate to dashboard with success message
            this.router.navigate(['/mota/dashboard'], { 
              queryParams: { 
                success: true, 
                order: response.orderNumber 
              } 
            });
          }
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error submitting sourcing request:', error);
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.checkoutForm.controls).forEach(key => {
        this.checkoutForm.get(key)?.markAsTouched();
      });
    }
  }
}