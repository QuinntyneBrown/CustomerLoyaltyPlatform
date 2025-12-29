import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, map, combineLatest } from 'rxjs';
import { BusinessService } from '../business.service';

interface BusinessRegisterViewModel {
  submitting: boolean;
  error: string | null;
  tenantId: string;
}

@Component({
  selector: 'app-business-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './business-register.html',
  styleUrl: './business-register.scss'
})
export class BusinessRegister {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly businessService = inject(BusinessService);
  private readonly snackBar = inject(MatSnackBar);

  private readonly submitting$ = new BehaviorSubject<boolean>(false);
  private readonly error$ = new BehaviorSubject<string | null>(null);
  private readonly tenantId$ = new BehaviorSubject<string>('');

  form = this.fb.group({
    businessName: ['', [Validators.required, Validators.maxLength(200)]],
    ownerName: ['', [Validators.required, Validators.maxLength(200)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-()]+$/)]],
    businessType: ['Retail', [Validators.required]],
    street: ['', [Validators.required]],
    city: ['', [Validators.required]],
    state: ['', [Validators.required]],
    postalCode: ['', [Validators.required]],
    country: ['', [Validators.required]]
  });

  businessTypes = ['Retail', 'Restaurant', 'Service', 'Healthcare', 'Entertainment', 'Other'];

  vm$: Observable<BusinessRegisterViewModel> = combineLatest([
    this.submitting$,
    this.error$,
    this.tenantId$
  ]).pipe(
    map(([submitting, error, tenantId]) => ({ submitting, error, tenantId }))
  );

  constructor() {
    this.route.params.subscribe(params => {
      this.tenantId$.next(params['tenantId']);
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting$.next(true);
    this.error$.next(null);

    const formValue = this.form.value;
    const tenantId = this.tenantId$.getValue();

    this.businessService.register(tenantId, {
      businessName: formValue.businessName!,
      ownerName: formValue.ownerName!,
      email: formValue.email!,
      phone: formValue.phone!,
      businessType: formValue.businessType!,
      address: {
        street: formValue.street!,
        city: formValue.city!,
        state: formValue.state!,
        postalCode: formValue.postalCode!,
        country: formValue.country!
      }
    }).subscribe({
      next: (business) => {
        this.submitting$.next(false);
        this.snackBar.open('Business registered successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/tenants', tenantId, 'businesses', business.businessId]);
      },
      error: (err) => {
        this.submitting$.next(false);
        this.error$.next(err.error?.message || err.message || 'Failed to register business');
      }
    });
  }

  goBack(): void {
    const tenantId = this.tenantId$.getValue();
    this.router.navigate(['/tenants', tenantId, 'businesses']);
  }
}
