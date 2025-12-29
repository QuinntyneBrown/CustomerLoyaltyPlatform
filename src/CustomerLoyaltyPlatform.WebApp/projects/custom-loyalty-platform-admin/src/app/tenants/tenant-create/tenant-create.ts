import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
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
import { TenantService } from '../tenant.service';

interface TenantCreateViewModel {
  submitting: boolean;
  error: string | null;
}

@Component({
  selector: 'app-tenant-create',
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
  templateUrl: './tenant-create.html',
  styleUrl: './tenant-create.scss'
})
export class TenantCreate {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly tenantService = inject(TenantService);
  private readonly snackBar = inject(MatSnackBar);

  private readonly submitting$ = new BehaviorSubject<boolean>(false);
  private readonly error$ = new BehaviorSubject<string | null>(null);

  form = this.fb.group({
    tenantName: ['', [Validators.required, Validators.maxLength(200)]],
    tenantSlug: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-z0-9-]+$/)]],
    primaryContactEmail: ['', [Validators.required, Validators.email]],
    primaryContactName: ['', [Validators.required, Validators.maxLength(200)]],
    planType: ['Free'],
    dataRegion: ['US']
  });

  planTypes = ['Free', 'Starter', 'Professional', 'Enterprise'];
  dataRegions = ['US', 'EU', 'APAC'];

  vm$: Observable<TenantCreateViewModel> = combineLatest([this.submitting$, this.error$]).pipe(
    map(([submitting, error]) => ({ submitting, error }))
  );

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting$.next(true);
    this.error$.next(null);

    const formValue = this.form.value;
    this.tenantService.create({
      tenantName: formValue.tenantName!,
      tenantSlug: formValue.tenantSlug!,
      primaryContactEmail: formValue.primaryContactEmail!,
      primaryContactName: formValue.primaryContactName!,
      planType: formValue.planType || undefined,
      dataRegion: formValue.dataRegion || undefined
    }).subscribe({
      next: (tenant) => {
        this.submitting$.next(false);
        this.snackBar.open('Tenant created successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/tenants', tenant.tenantId]);
      },
      error: (err) => {
        this.submitting$.next(false);
        this.error$.next(err.error?.message || err.message || 'Failed to create tenant');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/tenants']);
  }

  generateSlug(): void {
    const name = this.form.get('tenantName')?.value;
    if (name) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      this.form.patchValue({ tenantSlug: slug });
    }
  }
}
