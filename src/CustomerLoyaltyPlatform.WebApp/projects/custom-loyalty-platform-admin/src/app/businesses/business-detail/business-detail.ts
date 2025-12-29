import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { Observable, catchError, of, map, switchMap } from 'rxjs';
import { BusinessService } from '../business.service';
import { Business } from '../business.model';

interface BusinessDetailViewModel {
  loading: boolean;
  business: Business | null;
  error: string | null;
  tenantId: string;
}

@Component({
  selector: 'app-business-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  templateUrl: './business-detail.html',
  styleUrl: './business-detail.scss'
})
export class BusinessDetail {
  private readonly businessService = inject(BusinessService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  vm$: Observable<BusinessDetailViewModel> = this.route.params.pipe(
    switchMap(params => {
      const tenantId = params['tenantId'];
      const businessId = params['businessId'];
      return this.businessService.getById(tenantId, businessId).pipe(
        map((business) => ({ loading: false, business, error: null, tenantId })),
        catchError((err) => of({ loading: false, business: null, error: err.message || 'Failed to load business', tenantId }))
      );
    })
  );

  getStatusColor(status: string): string {
    switch (status) {
      case 'Active':
        return 'primary';
      case 'Registered':
        return 'accent';
      case 'Suspended':
        return 'warn';
      default:
        return '';
    }
  }

  goBack(tenantId: string): void {
    this.router.navigate(['/tenants', tenantId, 'businesses']);
  }
}
