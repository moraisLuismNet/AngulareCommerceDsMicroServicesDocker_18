import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// NavbarComponent is now standalone
import { RouterModule } from '@angular/router';
// LoginComponent is now standalone
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
// RegisterComponent is now standalone
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
  declarations: [],
  // NavbarComponent is now standalone
  // LoginComponent is now standalone
  // RegisterComponent is now standalone
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ToastModule,
    TableModule,
    ButtonModule,
    ConfirmDialogModule,
  ],
  exports: [],
  providers: [MessageService],
})
export class SharedModule {}
