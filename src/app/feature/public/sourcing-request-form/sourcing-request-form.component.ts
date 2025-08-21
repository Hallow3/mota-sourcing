import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { SourcingService } from '../../../core/service/sourcing.service';
import { CurrencyService } from '../../../core/service/currency.service';
import { SourcingCategory, RFQRequest, SourcingOption, CartItem } from '../../../core/model/sourcing.model';

@Component({
  selector: 'app-sourcing-request-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './sourcing-request-form.component.html',
  styleUrl: './sourcing-request-form.component.css'
})
export class SourcingRequestFormComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private sourcingService = inject(SourcingService);
  private currencyService = inject(CurrencyService);

  rfqForm: FormGroup;
  categories: SourcingCategory[] = [];
  selectedCategory: SourcingCategory | null = null;
  selectedFiles: File[] = [];
  availableOptions: SourcingOption[] = [];
  selectedOptions: SourcingOption[] = [];
  isSubmitting = false;
  productImagePreview: string | null = null;

  constructor() {
    this.rfqForm = this.fb.group({
      categoryId: ['', Validators.required],
      productDescription: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      budget: [''],
      productUrls: this.fb.array([])
    });

    this.loadCategories();
    this.loadMockOptions();
    this.handleCategoryPreselection();
  }

  handleCategoryPreselection(): void {
    this.route.queryParams.subscribe(params => {
      if (params['categoryId']) {
        const categoryId = parseInt(params['categoryId']);
        const category = this.categories.find(c => c.id === categoryId);
        if (category) {
          this.selectCategory(category);
        }
      }
    });
  }

  loadCategories(): void {
    // Mock data - replace with service call
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

  loadMockOptions(): void {
    this.availableOptions = [
      {
        id: 1,
        name: 'Audit d\'usine',
        description: 'Inspection complète de l\'usine avec rapport détaillé',
        price: 131000,
        selected: false
      },
      {
        id: 2,
        name: 'Échantillons express',
        description: 'Réception d\'échantillons sous 5 jours',
        price: 33000,
        selected: false
      },
      {
        id: 3,
        name: 'Test de qualité',
        description: 'Tests en laboratoire certifié',
        price: 98000,
        selected: false
      },
      {
        id: 4,
        name: 'Négociation avancée',
        description: 'Négociation poussée pour optimiser les prix',
        price: 66000,
        selected: false
      },
      {
        id: 5,
        name: 'Suivi personnalisé',
        description: 'Accompagnement dédié pendant 3 mois',
        price: 197000,
        selected: false
      }
    ];
  }

  get productUrlsArray() {
    return this.rfqForm.get('productUrls') as FormArray;
  }

  selectCategory(category: SourcingCategory): void {
    this.selectedCategory = category;
    this.rfqForm.patchValue({ categoryId: category.id });
  }

  addUrl(): void {
    this.productUrlsArray.push(this.fb.control(''));
  }

  removeUrl(index: number): void {
    this.productUrlsArray.removeAt(index);
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles.push(...Array.from(input.files));
    }
  }

  onProductImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Vérifier que c'est une image
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.productImagePreview = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeProductImage(): void {
    this.productImagePreview = null;
  }

  formatPrice(price: number): string {
    return this.currencyService.formatFcfa(price);
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  toggleOption(option: SourcingOption, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedOptions.push({ ...option, selected: true });
    } else {
      this.selectedOptions = this.selectedOptions.filter(o => o.id !== option.id);
    }
  }

  getTotalPrice(): number {
    if (!this.selectedCategory) return 0;
    
    const basePrice = this.selectedCategory.basePrice;
    const optionsPrice = this.selectedOptions.reduce((total, option) => total + option.price, 0);
    
    return basePrice + optionsPrice;
  }

  trackByCategory(index: number, item: SourcingCategory): number {
    return item.id;
  }

  trackByOption(index: number, item: SourcingOption): number {
    return item.id;
  }

  onSubmit(): void {
    if (this.rfqForm.valid && this.selectedCategory) {
      this.isSubmitting = true;

      // Create RFQ request
      const rfqRequest: RFQRequest = {
        categoryId: this.rfqForm.value.categoryId,
        productDescription: this.rfqForm.value.productDescription,
        quantity: this.rfqForm.value.quantity,
        budget: this.rfqForm.value.budget || undefined,
        files: this.selectedFiles,
        productUrls: this.productUrlsArray.value.filter((url: string) => url.trim() !== ''),
        productImage: this.productImagePreview || undefined
      };

      // Create cart item
      const cartItem: CartItem = {
        id: Date.now().toString(),
        rfqRequest,
        category: this.selectedCategory,
        options: this.selectedOptions,
        totalPrice: this.getTotalPrice()
      };

      // Add to cart
      setTimeout(() => {
        this.sourcingService.addToCart(cartItem);
        this.isSubmitting = false;
        
        // Navigate to cart
        this.router.navigate(['/mota/cart']);
      }, 1500);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.rfqForm.controls).forEach(key => {
        this.rfqForm.get(key)?.markAsTouched();
      });
    }
  }
}
