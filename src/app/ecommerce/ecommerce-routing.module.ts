import { Routes, RouterModule } from '@angular/router';
import { EcommerceComponent } from './ecommerce.component';
// GenresComponent is imported directly in the route
import { NgModule } from '@angular/core';
// GroupsComponent is imported directly in the route
// RecordsComponent is imported directly in the route
import { ListrecordsComponent } from './listrecords/listrecords.component';
import { CartDetailsComponent } from './cart-details/cart-details.component';
import { CartsComponent } from './carts/carts.component';
// AdminOrdersComponent is imported directly in the route
import { ListgroupsComponent } from './listgroups/listgroups.component';
// UsersComponent is imported directly in the route

const appRoutes: Routes = [
  {
    path: '',
    component: EcommerceComponent,
    children: [
      // Public routes
      { path: '', component: ListgroupsComponent },
      { path: 'listrecords/:idGroup', component: ListrecordsComponent },

      // Protected routes (would need AuthGuard)
      { path: 'listgroups', component: ListgroupsComponent },
      { 
        path: 'genres', 
        loadComponent: () => import('./genres/genres.component').then(m => m.GenresComponent)
      },
      { 
        path: 'groups',
        loadComponent: () => import('./groups/groups.component').then(m => m.GroupsComponent)
      },
      { 
        path: 'records',
        loadComponent: () => import('./records/records.component').then(m => m.RecordsComponent)
      },
      { path: 'cart-details', component: CartDetailsComponent },
      { path: 'carts', component: CartsComponent },
      { 
        path: 'admin-orders', 
        loadComponent: () => import('./admin-orders/admin-orders.component').then(m => m.AdminOrdersComponent)
      },
      { 
        path: 'users',
        loadComponent: () => import('./users/users.component').then(m => m.UsersComponent)
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class EcommerceRoutingModule {}
