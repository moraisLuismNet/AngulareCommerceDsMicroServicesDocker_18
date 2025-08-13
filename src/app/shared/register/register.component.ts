import { Component, inject, afterNextRender, afterRender, ChangeDetectionStrategy, ChangeDetectorRef, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { IRegister } from 'src/app/interfaces/register.interface';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ToastModule
  ],
  providers: [MessageService],
})
export class RegisterComponent {
  usuario: IRegister = { email: '', password: '' };
  registrationError: string | null = null;

  private readonly appService = inject(AppService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    // afterNextRender runs once after the component is initially rendered
    afterNextRender(() => {
      // Any DOM-dependent initialization can go here
    });

    // afterRender runs after every change detection cycle
    afterRender(() => {
      // Any DOM-dependent code that needs to run after each change detection
    });
  }

  onSubmit(form: any) {
    if (form.valid) {
      this.appService.register(this.usuario).pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Registration successful',
            detail: 'User successfully registered',
          });
          this.cdr.markForCheck();

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500); // Wait 1.5 seconds before redirecting
        },
        error: (err) => {
          console.error('Error registering user:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Registration error',
            detail: 'The user could not be registered. Please try again.',
          });
          this.cdr.markForCheck();
        },
      });
    }
  }


}
