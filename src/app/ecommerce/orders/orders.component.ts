import { Component, inject, afterNextRender, afterRender, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../services/order.service';
import { UserService } from 'src/app/services/user.service';
import { Subject, takeUntil } from 'rxjs';
import { IOrder } from '../ecommerce.interface';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    TableModule
  ]
})
export class OrdersComponent {
  orders: IOrder[] = [];
  filteredOrders: IOrder[] = [];
  loading = true;
  searchText: string = '';
  expandedOrderId: number | null = null;

  private searchSubject = new Subject<string>();

  private readonly orderService = inject(OrderService);
  private readonly userService = inject(UserService);
  private readonly cdr = inject(ChangeDetectorRef);

  constructor() {
    // Subscribe to user email changes
    this.userService.emailUser$.pipe(
      takeUntilDestroyed()
    ).subscribe((email) => {
      if (email) {
        this.loadOrders(email);
      }
    });

    // afterNextRender runs once after the component is initially rendered
    afterNextRender(() => {
      // Any DOM-dependent initialization can go here
    });

    // afterRender runs after every change detection cycle
    afterRender(() => {
      // Any DOM-dependent code that needs to run after each change detection
    });
  }

  loadOrders(email: string): void {
    this.loading = true;
    this.cdr.markForCheck();
    this.orderService.getOrdersByUserEmail(email).subscribe({
      next: (orders) => {
        this.orders = orders;
        this.filteredOrders = [...orders];
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.orders = [];
        this.filteredOrders = [];
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }


  toggleOrderDetails(orderId: number): void {
    this.expandedOrderId = this.expandedOrderId === orderId ? null : orderId;
    this.cdr.markForCheck();
  }

  isOrderExpanded(orderId: number): boolean {
    return this.expandedOrderId === orderId;
  }

  filterOrders() {
    this.filteredOrders = this.orders.filter((order) =>
      order.orderDate.toLowerCase().includes(this.searchText.toLowerCase())
    );
    this.cdr.markForCheck();
  }

  onSearchChange() {
    this.filterOrders();
  }
}
