import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { Observable, catchError, of, map, switchMap, combineLatest, startWith } from 'rxjs';
import { PointsService } from '../points.service';
import { PointsBalance, PointsTransaction } from '../points.model';

interface MemberPointsViewModel {
  loading: boolean;
  balance: PointsBalance | null;
  transactions: PointsTransaction[];
  error: string | null;
  tenantId: string;
  memberId: string;
}

@Component({
  selector: 'app-member-points',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTableModule
  ],
  templateUrl: './member-points.html',
  styleUrl: './member-points.scss'
})
export class MemberPoints {
  private readonly pointsService = inject(PointsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  displayedColumns = ['processedAt', 'transactionType', 'pointsAmount', 'runningBalance', 'description'];

  vm$: Observable<MemberPointsViewModel> = this.route.params.pipe(
    switchMap(params => {
      const tenantId = params['tenantId'];
      const memberId = params['memberId'];
      return combineLatest([
        this.pointsService.getMemberBalance(memberId, tenantId).pipe(catchError(() => of(null))),
        this.pointsService.getMemberTransactions(memberId, tenantId).pipe(catchError(() => of([])))
      ]).pipe(
        map(([balance, transactions]) => ({
          loading: false,
          balance,
          transactions,
          error: null,
          tenantId,
          memberId
        })),
        startWith({
          loading: true,
          balance: null,
          transactions: [],
          error: null,
          tenantId,
          memberId
        }),
        catchError((err) => of({
          loading: false,
          balance: null,
          transactions: [],
          error: err.message || 'Failed to load points data',
          tenantId,
          memberId
        }))
      );
    })
  );

  getTransactionColor(type: string): string {
    return type === 'Earn' ? 'primary' : 'warn';
  }

  goBack(tenantId: string, memberId: string): void {
    this.router.navigate(['/tenants', tenantId, 'members', memberId]);
  }
}
