import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';

// Components
import { EcommerceComponent } from './ecommerce.component';
// RecordsComponent is now standalone
// GenresComponent is now standalone
// GroupsComponent is now standalone
// ListgroupsComponent is now standalone
import { ListrecordsComponent } from './listrecords/listrecords.component';
// CartDetailsComponent is now standalone
// OrdersComponent is now standalone
// CartsComponent is now standalone
// AdminOrdersComponent is now standalone

// Modules
import { EcommerceRoutingModule } from './ecommerce-routing.module';
import { SharedModule } from '../shared/shared.module';

// Services
import { GenresService } from './services/genres.service';
import { GroupsService } from './services/groups.service';
import { RecordsService } from './services/records.service';
import { CartDetailService } from './services/cart-detail.service';
import { CartService } from './services/cart.service';
import { OrderService } from './services/order.service';
import { StockService } from './services/stock.service';
// UsersComponent is now standalone

const PRIME_NG_MODULES = [
  TableModule,
  ButtonModule,
  ConfirmDialogModule,
  DialogModule,
];

const COMPONENTS = [
  EcommerceComponent,
  // RecordsComponent is now standalone
  // GenresComponent is now standalone
  // GroupsComponent is now standalone
  // ListgroupsComponent is now standalone
  // ListrecordsComponent is now standalone
  // OrdersComponent is now standalone
  // CartDetailsComponent is now standalone
  // CartsComponent is now standalone
  // AdminOrdersComponent is now standalone
  // UsersComponent is now standalone
];

@NgModule({ declarations: [...COMPONENTS],
    exports: [...COMPONENTS], imports: [CommonModule,
        FormsModule,
        EcommerceRoutingModule,
        SharedModule,
        ...PRIME_NG_MODULES], providers: [
        GenresService,
        GroupsService,
        RecordsService,
        CartDetailService,
        CartService,
        OrderService,
        StockService,
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class EcommerceModule {}
