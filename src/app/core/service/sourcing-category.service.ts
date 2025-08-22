import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { SourcingCategory } from '../model/sourcing.model';

@Injectable({
  providedIn: 'root'
})
export class SourcingCategoryService {
  private readonly API_URL = '/api';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<SourcingCategory[]> {
    return this.http.get<SourcingCategory[]>(`${this.API_URL}/sourcing-categories`)
      .pipe(
        catchError(() => this.getMockCategories())
      );
  }

  getCategoryById(id: number): Observable<SourcingCategory | undefined> {
    return this.http.get<SourcingCategory>(`${this.API_URL}/sourcing-categories/${id}`)
      .pipe(
        catchError(() => {
          const categories = this.getMockCategoriesSync();
          return of(categories.find(c => c.id === id));
        })
      );
  }

  private getMockCategories(): Observable<SourcingCategory[]> {
    return of(this.getMockCategoriesSync()).pipe(delay(500));
  }

  private getMockCategoriesSync(): SourcingCategory[] {
    return [
      {
        id: 1,
        name: 'Électronique',
        description: 'Composants, gadgets, appareils électroniques',
        basePrice: 33000,
        features: ['Sourcing', 'Test qualité'],
        image: '/assets/categories/electronics.jpg'
      },
      {
        id: 2,
        name: 'Textile & Mode',
        description: 'Vêtements, accessoires, chaussures',
        basePrice: 20000,
        features: ['Sourcing', 'Échantillons'],
        image: '/assets/categories/textile.jpg'
      },
      {
        id: 3,
        name: 'Maison & Décoration',
        description: 'Mobilier, décoration, électroménager',
        basePrice: 26000,
        features: ['Sourcing', 'Photos HD'],
        image: '/assets/categories/home.jpg'
      },
      {
        id: 4,
        name: 'Jouets & Enfants',
        description: 'Jouets, puériculture, articles enfants',
        basePrice: 23000,
        features: ['Sourcing', 'Test sécurité'],
        image: '/assets/categories/toys.jpg'
      },
      {
        id: 5,
        name: 'Sport & Loisirs',
        description: 'Équipements sportifs, loisirs créatifs',
        basePrice: 30000,
        features: ['Sourcing', 'Test résistance'],
        image: '/assets/categories/sports.jpg'
      },
      {
        id: 6,
        name: 'Automobile',
        description: 'Pièces auto, accessoires, outils',
        basePrice: 39000,
        features: ['Sourcing', 'Certification'],
        image: '/assets/categories/auto.jpg'
      }
    ];
  }

  private handleError(error: any): Observable<never> {
    console.error('Sourcing Category Service Error:', error);
    throw error;
  }
}