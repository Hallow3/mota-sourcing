import { Component, inject, OnInit } from '@angular/core';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/nav-bar/nav-bar.component';
import { RouterModule, Router } from '@angular/router';
import { SourcingService } from '../../../core/service/sourcing.service';
import { CurrencyService } from '../../../core/service/currency.service';
import { AuthService } from '../../../core/service/auth.service';
import { SourcingCategoryService } from '../../../core/service/sourcing-category.service';
import { CartItem, SourcingCategory } from '../../../core/model/sourcing.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [FooterComponent, NavbarComponent, CommonModule, RouterModule],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private sourcingService = inject(SourcingService);
  private currencyService = inject(CurrencyService);
  private authService = inject(AuthService);
  private categoryService = inject(SourcingCategoryService);
  private router = inject(Router);
  
  cartItems: CartItem[] = [];
  cartItemCount = 0;
  categories$!: Observable<SourcingCategory[]>;
  isAuthenticated = false;

  ngOnInit(): void {
    this.sourcingService.cart$.subscribe(items => {
      this.cartItems = items;
      this.cartItemCount = items.length;
    });
    this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
    });
    this.loadCategories();
  }

  loadCategories(): void {
    this.categories$ = this.categoryService.getCategories();
  }

  selectCategory(category: SourcingCategory): void {
    this.router.navigate(['/mota/sourcing-request'], {
      queryParams: { categoryId: category.id }
    });
  }

  formatPrice(price: number): string {
    return this.currencyService.formatFcfa(price);
  }

  getTotalPrice(): number {
    return this.sourcingService.getCartTotal();
  }

  getTotalPriceFormatted(): string {
    return this.currencyService.formatFcfa(this.getTotalPrice());
  }
}