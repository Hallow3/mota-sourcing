import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SourcingService } from '../../../core/service/sourcing.service';
import { CurrencyService } from '../../../core/service/currency.service';
import { AuthService } from '../../../core/service/auth.service';
import { SourcingRequestService } from '../../../core/service/sourcing-request.service';
import { PopupService } from '../../../shared/popup/popup.service';
import { PopupComponent } from '../../../shared/popup/popup.component';
import { CartItem, ShippingInfo, SourcingRequestPayload } from '../../../core/model/sourcing.model';
import { UserResponse } from '../../../core/model/auth.models';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, PopupComponent],
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  public sourcingService = inject(SourcingService);
  private currencyService = inject(CurrencyService);
  private authService = inject(AuthService);
  private sourcingRequestService = inject(SourcingRequestService);
  private popupService = inject(PopupService);

  checkoutForm: FormGroup;
  cartItems: CartItem[] = [];
  isSubmitting = false;
  isAuthenticated = false;
  currentUser: UserResponse | null = null;

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
      this.currentUser = user;
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
    console.log('onSubmit called, isAuthenticated:', this.isAuthenticated);
    
    const isFormValid = this.isAuthenticated ? 
      this.isShippingFormValid() : 
      this.checkoutForm.valid;
      
    if (isFormValid && this.cartItems.length > 0) {
      if (!this.isAuthenticated) {
        console.log('Showing guest confirmation');
        this.showGuestConfirmation();
      } else {
        this.submitRequest();
      }
    } else {
      Object.keys(this.checkoutForm.controls).forEach(key => {
        this.checkoutForm.get(key)?.markAsTouched();
      });
    }
  }

  private showGuestConfirmation(): void {
    console.log('showGuestConfirmation called');
    this.popupService.confirm(
      'Création de compte',
      'Votre compte sera créé automatiquement après soumission. Votre premier sourcing est gratuit !',
      () => {
        console.log('Confirmation accepted');
        this.submitRequest();
      }
    );
  }

  private submitRequest(): void {
    this.isSubmitting = true;

    const shippingInfo: ShippingInfo = {
      country: this.checkoutForm.value.country,
      address: this.checkoutForm.value.address,
      city: this.checkoutForm.value.city,
      zipCode: this.checkoutForm.value.zipCode,
      logisticsPreferences: this.checkoutForm.value.logisticsPreferences
    };

    const user: UserResponse = this.isAuthenticated && this.currentUser ? 
      this.currentUser : 
      {
        id: 0,
        firstName: this.checkoutForm.value.firstName,
        lastName: this.checkoutForm.value.lastName,
        email: this.checkoutForm.value.email,
        phone: this.checkoutForm.value.phone,
        company: this.checkoutForm.value.company,
        userType: 'CLIENT',
        isActive: true,
        isEmailVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        roles: ['CLIENT']
      };

    const payload: SourcingRequestPayload = {
      shippingInfo,
      cartItems: this.cartItems,
      totalAmount: this.getTotalPrice(),
      user
    };

    this.sourcingRequestService.submitSourcingRequest(payload).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        if (response.success) {
          this.sourcingService.clearCart();
          this.showSuccessPopup(response.orderNumber);
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        this.popupService.error('Erreur', 'Une erreur est survenue lors de la soumission');
      }
    });
  }

  private showSuccessPopup(orderNumber?: string): void {
    this.popupService.confirm(
      'Demande envoyée !',
      `Votre demande de sourcing a été prise en compte${orderNumber ? ` (${orderNumber})` : ''}. Un email de confirmation vous a été envoyé.`,
      () => this.router.navigate(['/mota/dashboard']),
      () => this.router.navigate(['/mota/sourcing-request'])
    );
  }
}