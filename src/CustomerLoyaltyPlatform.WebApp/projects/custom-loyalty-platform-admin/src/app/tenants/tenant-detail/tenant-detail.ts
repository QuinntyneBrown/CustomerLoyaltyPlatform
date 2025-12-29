import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Observable, switchMap, catchError, of, map, startWith, BehaviorSubject, combineLatest } from 'rxjs';
import { TenantService } from '../tenant.service';
import { Tenant } from '../tenant.model';

interface TenantDetailViewModel {
  loading: boolean;
  tenant: Tenant | null;
  error: string | null;
  activating: boolean;
}

@Component({
  selector: 'app-tenant-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './tenant-detail.html',
  styleUrl: './tenant-detail.scss'
})
export class TenantDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly tenantService = inject(TenantService);
  private readonly snackBar = inject(MatSnackBar);

  private readonly refreshTrigger$ = new BehaviorSubject<void>(undefined);
  private readonly activating$ = new BehaviorSubject<boolean>(false);

  private readonly tenant$: Observable<{ loading: boolean; tenant: Tenant | null; error: string | null }> =
    combineLatest([this.route.paramMap, this.refreshTrigger$]).pipe(
      switchMap(([params]) => {
        const tenantId = params.get('id');
        if (!tenantId) {
          return of({ loading: false, tenant: null, error: 'Tenant ID not provided' });
        }
        return this.tenantService.getById(tenantId).pipe(
          map((tenant) => ({ loading: false, tenant, error: null })),
          startWith({ loading: true, tenant: null, error: null }),
          catchError((err) => of({ loading: false, tenant: null, error: err.message || 'Failed to load tenant' }))
        );
      })
    );

  vm$: Observable<TenantDetailViewModel> = combineLatest([this.tenant$, this.activating$]).pipe(
    map(([tenantData, activating]) => ({
      ...tenantData,
      activating
    }))
  );

  getStatusColor(status: string): string {
    switch (status) {
      case 'Active':
        return 'primary';
      case 'Provisioned':
        return 'accent';
      case 'Suspended':
        return 'warn';
      default:
        return '';
    }
  }

  activate(tenantId: string): void {
    this.activating$.next(true);
    this.tenantService.activate(tenantId).subscribe({
      next: () => {
        this.activating$.next(false);
        this.snackBar.open('Tenant activated successfully', 'Close', { duration: 3000 });
        this.refreshTrigger$.next();
      },
      error: (err) => {
        this.activating$.next(false);
        this.snackBar.open(err.message || 'Failed to activate tenant', 'Close', { duration: 3000 });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/tenants']);
  }
}
