import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, map, combineLatest, switchMap, tap } from 'rxjs';
import { BusinessService } from '../business.service';
import { Business } from '../business.model';

interface BusinessEditViewModel {
  loading: boolean;
  submitting: boolean;
  error: string | null;
  business: Business | null;
  tenantId: string;
  businessId: string;
}

@Component({
  selector: 'app-business-edit',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './business-edit.html',
  styleUrl: './business-edit.scss'
})
export class BusinessEdit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly businessService = inject(BusinessService);
  private readonly snackBar = inject(MatSnackBar);

  private readonly loading$ = new BehaviorSubject<boolean>(true);
  private readonly submitting$ = new BehaviorSubject<boolean>(false);
  private readonly error$ = new BehaviorSubject<string | null>(null);
  private readonly business$ = new BehaviorSubject<Business | null>(null);
  private readonly tenantId$ = new BehaviorSubject<string>('');
  private readonly businessId$ = new BehaviorSubject<string>('');

  form = this.fb.group({
    businessName: ['', [Validators.required, Validators.maxLength(200)]],
    ownerName: ['', [Validators.required, Validators.maxLength(200)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-()]+$/)]],
    street: ['', [Validators.required]],
    city: ['', [Validators.required]],
    state: ['', [Validators.required]],
    postalCode: ['', [Validators.required]],
    country: ['', [Validators.required]]
  });

  vm$: Observable<BusinessEditViewModel> = combineLatest([
    this.loading$,
    this.submitting$,
    this.error$,
    this.business$,
    this.tenantId$,
    this.businessId$
  ]).pipe(
    map(([loading, submitting, error, business, tenantId, businessId]) => ({
      loading,
      submitting,
      error,
      business,
      tenantId,
      businessId
    }))
  );

  constructor() {
    this.route.params.pipe(
      tap(params => {
        this.tenantId$.next(params['tenantId']);
        this.businessId$.next(params['businessId']);
      }),
      switchMap(params => this.businessService.getById(params['tenantId'], params['businessId']))
    ).subscribe({
      next: (business) => {
        this.business$.next(business);
        this.loading$.next(false);
        this.form.patchValue({
          businessName: business.businessName,
          ownerName: business.ownerName,
          email: business.email,
          phone: business.phone,
          street: business.address.street,
          city: business.address.city,
          state: business.address.state,
          postalCode: business.address.postalCode,
          country: business.address.country
        });
      },
      error: (err) => {
        this.loading$.next(false);
        this.error$.next(err.message || 'Failed to load business');
      }
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
    const businessId = this.businessId$.getValue();

    this.businessService.update(tenantId, businessId, {
      businessName: formValue.businessName!,
      ownerName: formValue.ownerName!,
      email: formValue.email!,
      phone: formValue.phone!,
      address: {
        street: formValue.street!,
        city: formValue.city!,
        state: formValue.state!,
        postalCode: formValue.postalCode!,
        country: formValue.country!
      }
    }).subscribe({
      next: () => {
        this.submitting$.next(false);
        this.snackBar.open('Business updated successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/tenants', tenantId, 'businesses', businessId]);
      },
      error: (err) => {
        this.submitting$.next(false);
        this.error$.next(err.error?.message || err.message || 'Failed to update business');
      }
    });
  }

  goBack(): void {
    const tenantId = this.tenantId$.getValue();
    const businessId = this.businessId$.getValue();
    this.router.navigate(['/tenants', tenantId, 'businesses', businessId]);
  }
}
