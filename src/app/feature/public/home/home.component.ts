import { Component, inject, OnInit } from '@angular/core';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/nav-bar/nav-bar.component';
import { RouterModule } from '@angular/router';
import { SourcingService } from '../../../core/service/sourcing.service';
import { CurrencyService } from '../../../core/service/currency.service';
import { CartItem } from '../../../core/model/sourcing.model';

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
  
  cartItems: CartItem[] = [];
  cartItemCount = 0;

  ngOnInit(): void {
    this.sourcingService.cart$.subscribe(items => {
      this.cartItems = items;
      this.cartItemCount = items.length;
    });
  }

  getTotalPrice(): number {
    return this.sourcingService.getCartTotal();
  }

  getTotalPriceFormatted(): string {
    return this.currencyService.formatFcfa(this.getTotalPrice());
  }
}
