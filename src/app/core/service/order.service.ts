import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Order, OrderStatus, OrderTracking, OrderSummary, CartItem, ShippingInfo } from '../model/sourcing.model';
import { UserResponse } from '../model/auth.models';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  private readonly STORAGE_KEY = 'motaOrders';

  orders$ = this.ordersSubject.asObservable();

  constructor() {
    this.loadOrdersFromStorage();
    this.initializeMockOrders();
  }

  private loadOrdersFromStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedOrders = localStorage.getItem(this.STORAGE_KEY);
      if (savedOrders) {
        try {
          const orders = JSON.parse(savedOrders).map((order: any) => ({
            ...order,
            createdAt: new Date(order.createdAt),
            updatedAt: new Date(order.updatedAt),
            estimatedDelivery: order.estimatedDelivery ? new Date(order.estimatedDelivery) : undefined,
            tracking: order.tracking?.map((track: any) => ({
              ...track,
              timestamp: new Date(track.timestamp)
            }))
          }));
          this.ordersSubject.next(orders);
        } catch (error) {
          console.error('Error loading orders from storage:', error);
        }
      }
    }
  }

  private saveOrdersToStorage(orders: Order[]): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(orders));
      } catch (error) {
        console.error('Error saving orders to storage:', error);
      }
    }
  }

  private initializeMockOrders(): void {
    const currentOrders = this.ordersSubject.value;
    if (currentOrders.length === 0) {
      const mockOrders = this.generateMockOrders();
      this.ordersSubject.next(mockOrders);
      this.saveOrdersToStorage(mockOrders);
    }
  }

  private generateMockOrders(): Order[] {
    return [
      {
        id: '1',
        orderNumber: 'MS240001',
        cartItems: [],
        user: { id: 1, firstName: 'Jean', lastName: 'Dupont', email: 'jean.dupont@email.com', userType: 'CLIENT', isActive: true, isEmailVerified: true, createdAt: '2024-01-01', updatedAt: '2024-01-01', roles: ['CLIENT'] } as UserResponse,
        shippingInfo: {
          country: 'FR',
          address: '123 Rue de la Paix',
          city: 'Paris',
          zipCode: '75001'
        },
        totalAmount: 150000,
        status: OrderStatus.PRODUCTION,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20'),
        estimatedDelivery: new Date('2024-02-15'),
        tracking: [
          {
            id: '1',
            orderId: '1',
            status: OrderStatus.PENDING,
            message: 'Commande reçue et en cours de traitement',
            timestamp: new Date('2024-01-15T10:00:00'),
            location: 'Bureau MOTA Sourcing'
          },
          {
            id: '2',
            orderId: '1',
            status: OrderStatus.SOURCING,
            message: 'Recherche de fournisseurs en cours',
            timestamp: new Date('2024-01-16T14:30:00'),
            location: 'Guangzhou, Chine'
          },
          {
            id: '3',
            orderId: '1',
            status: OrderStatus.QUOTED,
            message: 'Devis reçus des fournisseurs',
            timestamp: new Date('2024-01-18T09:15:00'),
            location: 'Bureau MOTA Sourcing'
          },
          {
            id: '4',
            orderId: '1',
            status: OrderStatus.PRODUCTION,
            message: 'Production lancée chez le fournisseur sélectionné',
            timestamp: new Date('2024-01-20T11:00:00'),
            location: 'Shenzhen, Chine'
          }
        ],
        notes: 'Commande prioritaire - Client VIP'
      },
      {
        id: '2',
        orderNumber: 'MS240002',
        cartItems: [],
        user: { id: 2, firstName: 'Marie', lastName: 'Martin', email: 'marie.martin@email.com', userType: 'CLIENT', isActive: true, isEmailVerified: true, createdAt: '2024-01-01', updatedAt: '2024-01-01', roles: ['CLIENT'] } as UserResponse,
        shippingInfo: {
          country: 'FR',
          address: '456 Avenue des Champs',
          city: 'Lyon',
          zipCode: '69000'
        },
        totalAmount: 85000,
        status: OrderStatus.SHIPPING,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-25'),
        estimatedDelivery: new Date('2024-02-05'),
        tracking: [
          {
            id: '5',
            orderId: '2',
            status: OrderStatus.PENDING,
            message: 'Commande reçue',
            timestamp: new Date('2024-01-10T15:00:00')
          },
          {
            id: '6',
            orderId: '2',
            status: OrderStatus.PRODUCTION,
            message: 'Production terminée',
            timestamp: new Date('2024-01-22T10:00:00'),
            location: 'Dongguan, Chine'
          },
          {
            id: '7',
            orderId: '2',
            status: OrderStatus.SHIPPING,
            message: 'Expédition vers la France',
            timestamp: new Date('2024-01-25T08:30:00'),
            location: 'Port de Shanghai'
          }
        ]
      },
      {
        id: '3',
        orderNumber: 'MS240003',
        cartItems: [],
        user: { id: 3, firstName: 'Pierre', lastName: 'Bernard', email: 'pierre.bernard@email.com', userType: 'CLIENT', isActive: true, isEmailVerified: true, createdAt: '2024-01-01', updatedAt: '2024-01-01', roles: ['CLIENT'] } as UserResponse,
        shippingInfo: {
          country: 'FR',
          address: '789 Boulevard Saint-Germain',
          city: 'Toulouse',
          zipCode: '31000'
        },
        totalAmount: 220000,
        status: OrderStatus.COMPLETED,
        createdAt: new Date('2023-12-01'),
        updatedAt: new Date('2024-01-05'),
        estimatedDelivery: new Date('2024-01-05'),
        tracking: [
          {
            id: '8',
            orderId: '3',
            status: OrderStatus.COMPLETED,
            message: 'Commande livrée et confirmée',
            timestamp: new Date('2024-01-05T16:00:00'),
            location: 'Toulouse, France'
          }
        ]
      }
    ];
  }

  createOrder(cartItems: CartItem[], shippingInfo: ShippingInfo, user?: UserResponse): Order {
    const currentOrders = this.ordersSubject.value;
    const orderNumber = this.generateOrderNumber();
    const totalAmount = cartItems.reduce((total, item) => total + item.totalPrice, 0);

    const newOrder: Order = {
      id: Date.now().toString(),
      orderNumber,
      cartItems,
      user,
      shippingInfo,
      totalAmount,
      status: OrderStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
      tracking: [
        {
          id: Date.now().toString(),
          orderId: Date.now().toString(),
          status: OrderStatus.PENDING,
          message: 'Commande reçue et en cours de traitement',
          timestamp: new Date(),
          location: 'Bureau MOTA Sourcing'
        }
      ]
    };

    const updatedOrders = [newOrder, ...currentOrders];
    this.ordersSubject.next(updatedOrders);
    this.saveOrdersToStorage(updatedOrders);

    return newOrder;
  }

  private generateOrderNumber(): string {
    const year = new Date().getFullYear().toString().slice(-2);
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `MS${year}${month}${randomNum}`;
  }

  getOrderById(id: string): Observable<Order | undefined> {
    return new Observable(observer => {
      this.orders$.subscribe(orders => {
        const order = orders.find(o => o.id === id);
        observer.next(order);
      });
    });
  }

  getOrderByNumber(orderNumber: string): Observable<Order | undefined> {
    return new Observable(observer => {
      this.orders$.subscribe(orders => {
        const order = orders.find(o => o.orderNumber === orderNumber);
        observer.next(order);
      });
    });
  }

  getOrderSummary(): Observable<OrderSummary> {
    return new Observable(observer => {
      this.orders$.subscribe(orders => {
        const summary: OrderSummary = {
          totalOrders: orders.length,
          pendingOrders: orders.filter(o => 
            o.status === OrderStatus.PENDING || 
            o.status === OrderStatus.SOURCING || 
            o.status === OrderStatus.PRODUCTION
          ).length,
          completedOrders: orders.filter(o => o.status === OrderStatus.COMPLETED).length,
          totalSpent: orders.reduce((total, order) => total + order.totalAmount, 0)
        };
        observer.next(summary);
      });
    });
  }

  updateOrderStatus(orderId: string, newStatus: OrderStatus, message: string, location?: string): void {
    const currentOrders = this.ordersSubject.value;
    const orderIndex = currentOrders.findIndex(o => o.id === orderId);
    
    if (orderIndex > -1) {
      const order = currentOrders[orderIndex];
      order.status = newStatus;
      order.updatedAt = new Date();
      
      const newTracking: OrderTracking = {
        id: Date.now().toString(),
        orderId,
        status: newStatus,
        message,
        timestamp: new Date(),
        location
      };
      
      if (!order.tracking) {
        order.tracking = [];
      }
      order.tracking.push(newTracking);
      
      currentOrders[orderIndex] = order;
      this.ordersSubject.next([...currentOrders]);
      this.saveOrdersToStorage(currentOrders);
    }
  }

  getStatusLabel(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.PENDING: return 'En attente';
      case OrderStatus.CONFIRMED: return 'Confirmé';
      case OrderStatus.SOURCING: return 'Sourcing en cours';
      case OrderStatus.QUOTED: return 'Devis reçu';
      case OrderStatus.NEGOTIATING: return 'Négociation';
      case OrderStatus.PRODUCTION: return 'En production';
      case OrderStatus.QUALITY_CHECK: return 'Contrôle qualité';
      case OrderStatus.SHIPPING: return 'Expédition';
      case OrderStatus.DELIVERED: return 'Livré';
      case OrderStatus.COMPLETED: return 'Terminé';
      case OrderStatus.CANCELLED: return 'Annulé';
      default: return status;
    }
  }

  getStatusColor(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.PENDING: return 'text-yellow-400';
      case OrderStatus.CONFIRMED: return 'text-blue-400';
      case OrderStatus.SOURCING: return 'text-indigo-400';
      case OrderStatus.QUOTED: return 'text-purple-400';
      case OrderStatus.NEGOTIATING: return 'text-orange-400';
      case OrderStatus.PRODUCTION: return 'text-cyan-400';
      case OrderStatus.QUALITY_CHECK: return 'text-teal-400';
      case OrderStatus.SHIPPING: return 'text-blue-300';
      case OrderStatus.DELIVERED: return 'text-green-400';
      case OrderStatus.COMPLETED: return 'text-green-500';
      case OrderStatus.CANCELLED: return 'text-red-400';
      default: return 'text-gray-400';
    }
  }
}