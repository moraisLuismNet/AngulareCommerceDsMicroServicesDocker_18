import { inject } from '@angular/core';
import { Routes, Router } from '@angular/router';
import { AuthGuard } from './guards/auth-guard.service';
import { ListrecordsComponent } from './ecommerce/listrecords/listrecords.component';

const canActivate = () => {
  const guard = inject(AuthGuard);
  if (!guard.isLoggedIn()) {
    const router = inject(Router);
    router.navigate(['/login']);
    return false;
  }
  return true;
};

const appRoutes: Routes = [
  // Public routes
  { 
    path: 'login',
    loadComponent: () => import('./shared/login/login.component').then(m => m.LoginComponent)
  },
  { 
    path: 'register',
    loadComponent: () => import('./shared/register/register.component').then(m => m.RegisterComponent)
  },
  { 
    path: 'listrecords/:idGroup', 
    component: ListrecordsComponent 
  },
  { 
    path: 'cart-details', 
    loadComponent: () => import('./ecommerce/cart-details/cart-details.component').then(m => m.CartDetailsComponent)
  },
  // All ecommerce routes under the lazy loaded module
  {
    path: '',
    loadChildren: () =>
      import('./ecommerce/ecommerce.module').then((m) => m.EcommerceModule),
  },
  // Protected routes
  {
    path: '',
    canActivate: [canActivate],
    children: [
      { 
        path: 'orders',
        loadComponent: () => import('./ecommerce/orders/orders.component').then(m => m.OrdersComponent)
      },
      { 
        path: 'carts',
        loadComponent: () => import('./ecommerce/carts/carts.component').then(m => m.CartsComponent)
      },
      {
        path: 'ecommerce',
        loadChildren: () =>
          import('./ecommerce/ecommerce.module').then((m) => m.EcommerceModule),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];

// Export the routes for use with provideRouter
export const routes: Routes = appRoutes;

// Keep the NgModule for compatibility with existing code
// This can be removed once all modules are migrated to standalone
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
