import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { SourcingCategory, RFQRequest, CartItem } from '../model/sourcing.model';

@Injectable({
  providedIn: 'root'
})
export class SourcingService {
  private apiUrl = 'http://localhost:8080/api';
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  
  cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCartFromStorage();
  }

  private loadCartFromStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedCart = localStorage.getItem('motaCart');
      if (savedCart) {
        try {
          const cartItems = JSON.parse(savedCart);
          this.cartSubject.next(cartItems);
        } catch (error) {
          console.error('Error loading cart from storage:', error);
        }
      }
    }
  }

  private saveCartToStorage(cartItems: CartItem[]): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem('motaCart', JSON.stringify(cartItems));
      } catch (error) {
        console.error('Error saving cart to storage:', error);
      }
    }
  }

  getCategories(): Observable<SourcingCategory[]> {
    return this.http.get<SourcingCategory[]>(`${this.apiUrl}/categories`);
  }

  submitRFQ(rfq: RFQRequest): Observable<RFQRequest> {
    return this.http.post<RFQRequest>(`${this.apiUrl}/rfq`, rfq);
  }

  addToCart(item: CartItem): void {
    const currentCart = this.cartSubject.value;
    const newCart = [...currentCart, item];
    this.cartSubject.next(newCart);
    this.saveCartToStorage(newCart);
  }

  removeFromCart(itemId: string): void {
    const currentCart = this.cartSubject.value;
    const newCart = currentCart.filter(item => item.id !== itemId);
    this.cartSubject.next(newCart);
    this.saveCartToStorage(newCart);
  }

  updateCartItem(itemId: string, updatedItem: CartItem): void {
    const currentCart = this.cartSubject.value;
    const index = currentCart.findIndex(item => item.id === itemId);
    if (index > -1) {
      currentCart[index] = updatedItem;
      const newCart = [...currentCart];
      this.cartSubject.next(newCart);
      this.saveCartToStorage(newCart);
    }
  }

  clearCart(): void {
    const emptyCart: CartItem[] = [];
    this.cartSubject.next(emptyCart);
    this.saveCartToStorage(emptyCart);
  }

  getCartTotal(): number {
    return this.cartSubject.value.reduce((total, item) => total + item.totalPrice, 0);
  }
}