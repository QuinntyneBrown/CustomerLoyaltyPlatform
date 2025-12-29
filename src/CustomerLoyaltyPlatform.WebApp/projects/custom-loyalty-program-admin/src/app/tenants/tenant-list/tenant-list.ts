import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, catchError, of, startWith, map } from 'rxjs';
import { TenantService } from '../tenant.service';
import { Tenant } from '../tenant.model';

interface TenantListViewModel {
  loading: boolean;
  tenants: Tenant[];
  error: string | null;
}

@Component({
  selector: 'app-tenant-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './tenant-list.html',
  styleUrl: './tenant-list.scss'
})
export class TenantList {
  private readonly tenantService = inject(TenantService);

  displayedColumns = ['tenantName', 'tenantSlug', 'status', 'planType', 'actions'];

  vm$: Observable<TenantListViewModel> = this.tenantService.getAll().pipe(
    map((tenants) => ({ loading: false, tenants, error: null })),
    startWith({ loading: true, tenants: [], error: null }),
    catchError((err) => of({ loading: false, tenants: [], error: err.message || 'Failed to load tenants' }))
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
}
