import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { Observable, catchError, of, map, switchMap, combineLatest } from 'rxjs';
import { ProgramService } from '../program.service';
import { LoyaltyProgram, EarningRule } from '../program.model';

interface ProgramDetailViewModel {
  loading: boolean;
  program: LoyaltyProgram | null;
  earningRules: EarningRule[];
  error: string | null;
  tenantId: string;
}

@Component({
  selector: 'app-program-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatTableModule
  ],
  templateUrl: './program-detail.html',
  styleUrl: './program-detail.scss'
})
export class ProgramDetail {
  private readonly programService = inject(ProgramService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  displayedColumns = ['ruleType', 'pointsAmount', 'spendThreshold', 'effectiveFrom', 'effectiveTo', 'isActive'];

  vm$: Observable<ProgramDetailViewModel> = this.route.params.pipe(
    switchMap(params => {
      const tenantId = params['tenantId'];
      const programId = params['programId'];
      return combineLatest([
        this.programService.getById(programId, tenantId),
        this.programService.getEarningRules(programId, tenantId).pipe(catchError(() => of([])))
      ]).pipe(
        map(([program, earningRules]) => ({
          loading: false,
          program,
          earningRules,
          error: null,
          tenantId
        })),
        catchError((err) => of({
          loading: false,
          program: null,
          earningRules: [],
          error: err.message || 'Failed to load program',
          tenantId
        }))
      );
    })
  );

  getStatusColor(isActive: boolean): string {
    return isActive ? 'primary' : 'warn';
  }

  goBack(tenantId: string): void {
    this.router.navigate(['/tenants', tenantId, 'programs']);
  }
}
