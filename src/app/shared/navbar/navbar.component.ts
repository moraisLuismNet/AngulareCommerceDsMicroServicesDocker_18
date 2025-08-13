import { Component, inject, afterNextRender, afterRender, ChangeDetectionStrategy, ChangeDetectorRef, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { of } from 'rxjs';
import { filter, tap, switchMap } from 'rxjs/operators';

// Services
import { UserService } from 'src/app/services/user.service';
import { CartService } from 'src/app/ecommerce/services/cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class NavbarComponent {
  emailUser: string | null = null;
  role: string | null = null;
  cartItemsCount: number = 0;
  cartTotal: number = 0;
  currentRoute: string = '';
  cartEnabled: boolean = true;

  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly cartService = inject(CartService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    // Initialize the current route
    this.currentRoute = this.router.url;
    
    // afterNextRender runs once after the component is initially rendered
    afterNextRender(() => {
      // Any DOM-dependent initialization can go here
    });

    // afterRender runs after every change detection cycle
    afterRender(() => {
      // Any DOM-dependent code that needs to run after each change detection
    });

    // Initialize all subscriptions
    this.initializeSubscriptions();
  }

  private initializeSubscriptions(): void {
    // Subscribe to user email changes
    this.userService.email$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(email => {
      this.emailUser = email;
      if (!email) {
        this.role = null;
      }
      this.cdr.markForCheck();
    });
    
    // Subscribe to user role changes
    this.userService.role$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(role => {
      this.role = role;
      this.cdr.markForCheck();
    });

    // Subscribe to cart enabled status
    this.cartService.cartEnabled$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(enabled => {
      this.cartEnabled = enabled;
      this.cdr.markForCheck();
    });

    // Subscribe to route changes to update currentRoute
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(event => {
      this.currentRoute = event.url;
      this.cdr.markForCheck();
    });

    // Subscription to user email for cart updates
    this.userService.emailUser$.pipe(
      takeUntilDestroyed(this.destroyRef),
      tap((email: string | null) => {
        this.emailUser = email;
        if (!email) {
          this.role = null;
          this.cartItemsCount = 0;
          this.cartTotal = 0;
          this.cdr.markForCheck();
        }
      })
    ).subscribe();

    // Subscribe to cart item count changes
    this.cartService.cartItemCount$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(count => {
      this.cartItemsCount = count;
    });

    // Subscribe to cart total changes
    this.cartService.cartTotal$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(total => {
      this.cartTotal = total;
    });

    // Check cart status when user email changes
    this.userService.emailUser$.pipe(
      takeUntilDestroyed(this.destroyRef),
      switchMap((email: string | null) => {
        if (email) {
          return this.cartService.getCartStatus(email).pipe(
            tap((status: { enabled: boolean }) => {
              this.cartEnabled = status.enabled;
              if (status.enabled) {
                this.cartService.syncCartWithBackend(email);
              }
              this.cdr.markForCheck();
            })
          );
        } else {
          this.cartEnabled = true;
          return of(null);
        }
      })
    ).subscribe();

    // Subscription to cart item count and total
    this.cartService.cartItemCount$
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((count) => {
        this.cartItemsCount = count;
        this.cdr.markForCheck();
      });

    // Subscription to cart total
    this.cartService.cartTotal$
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((total) => {
        this.cartTotal = total;
        this.cdr.markForCheck();
      });
    
    // Subscription to router events
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((event: any) => {
        this.currentRoute = event.url;
        this.cdr.markForCheck();
      });
  }

  isAdmin(): boolean {
    return this.role === 'Admin';
  }

  isListGroupsPage(): boolean {
    return this.currentRoute.includes('/listgroups') || this.currentRoute === '/';
  }

  isOrdersPage(): boolean {
    const isOrdersPage = this.currentRoute.includes('/ecommerce/admin-orders') || this.currentRoute.includes('/orders');
    return isOrdersPage;
  }

  isGenresPage(): boolean {
    return this.currentRoute.includes('/ecommerce/genres') || this.currentRoute === '/genres';
  }

  isGroupsPage(): boolean {
    return this.currentRoute.includes('/ecommerce/groups') || this.currentRoute === '/groups';
  }

  isRecordsPage(): boolean {
    return this.currentRoute.includes('/ecommerce/records') || this.currentRoute === '/records';
  }

  isCartsPage(): boolean {
    return this.currentRoute.includes('/ecommerce/carts') || this.currentRoute === '/carts';
  }

  isUsersPage(): boolean {
    return this.currentRoute.includes('/ecommerce/users') || this.currentRoute === '/users';
  }

  logout(): void {
    this.cartService.resetCart();
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('role');
    this.emailUser = null;
    this.role = null;
    this.cdr.markForCheck();
    this.router.navigate(['/login']);
  }



  isLoginPage(): boolean {
    return this.currentRoute.includes('/login');
  }
}
