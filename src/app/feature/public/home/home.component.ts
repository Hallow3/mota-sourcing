import { Component, inject, OnInit } from '@angular/core';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/nav-bar/nav-bar.component';
import { RouterModule, Router } from '@angular/router';
import { SourcingService } from '../../../core/service/sourcing.service';
import { CurrencyService } from '../../../core/service/currency.service';
import { AuthService } from '../../../core/service/auth.service';
import { CartItem, SourcingCategory } from '../../../core/model/sourcing.model';

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
  private router = inject(Router);
  
  cartItems: CartItem[] = [];
  cartItemCount = 0;
  categories: SourcingCategory[] = [];
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
    this.categories = [
      {
        id: 1,
        name: 'Électronique',
        description: 'Composants, gadgets, appareils électroniques',
        basePrice: 33000,
        features: ['Sourcing', 'Test qualité']
      },
      {
        id: 2,
        name: 'Textile & Mode',
        description: 'Vêtements, accessoires, chaussures',
        basePrice: 20000,
        features: ['Sourcing', 'Échantillons']
      },
      {
        id: 3,
        name: 'Maison & Décoration',
        description: 'Mobilier, décoration, électroménager',
        basePrice: 26000,
        features: ['Sourcing', 'Photos HD']
      },
      {
        id: 4,
        name: 'Jouets & Enfants',
        description: 'Jouets, puériculture, articles enfants',
        basePrice: 23000,
        features: ['Sourcing', 'Test sécurité']
      },
      {
        id: 5,
        name: 'Sport & Loisirs',
        description: 'Équipements sportifs, loisirs créatifs',
        basePrice: 30000,
        features: ['Sourcing', 'Test résistance']
      },
      {
        id: 6,
        name: 'Automobile',
        description: 'Pièces auto, accessoires, outils',
        basePrice: 39000,
        features: ['Sourcing', 'Certification']
      }
    ];
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
