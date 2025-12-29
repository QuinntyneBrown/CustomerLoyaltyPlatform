import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, catchError, of, startWith, map, switchMap } from 'rxjs';
import { BusinessService } from '../business.service';
import { Business } from '../business.model';

interface BusinessListViewModel {
  loading: boolean;
  businesses: Business[];
  error: string | null;
  tenantId: string;
}

@Component({
  selector: 'app-business-list',
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
  templateUrl: './business-list.html',
  styleUrl: './business-list.scss'
})
export class BusinessList {
  private readonly businessService = inject(BusinessService);
  private readonly route = inject(ActivatedRoute);

  displayedColumns = ['businessName', 'ownerName', 'email', 'businessType', 'status', 'actions'];

  vm$: Observable<BusinessListViewModel> = this.route.params.pipe(
    switchMap(params => {
      const tenantId = params['tenantId'];
      return this.businessService.getAll(tenantId).pipe(
        map((businesses) => ({ loading: false, businesses, error: null, tenantId })),
        startWith({ loading: true, businesses: [], error: null, tenantId }),
        catchError((err) => of({ loading: false, businesses: [], error: err.message || 'Failed to load businesses', tenantId }))
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
}
