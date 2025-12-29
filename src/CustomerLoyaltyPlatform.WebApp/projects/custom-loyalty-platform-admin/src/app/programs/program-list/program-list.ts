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
import { ProgramService } from '../program.service';
import { LoyaltyProgram } from '../program.model';

interface ProgramListViewModel {
  loading: boolean;
  programs: LoyaltyProgram[];
  error: string | null;
  tenantId: string;
}

@Component({
  selector: 'app-program-list',
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
  templateUrl: './program-list.html',
  styleUrl: './program-list.scss'
})
export class ProgramList {
  private readonly programService = inject(ProgramService);
  private readonly route = inject(ActivatedRoute);

  displayedColumns = ['programName', 'programType', 'pointsName', 'isActive', 'createdAt', 'actions'];

  vm$: Observable<ProgramListViewModel> = this.route.params.pipe(
    switchMap(params => {
      const tenantId = params['tenantId'];
      return this.programService.getAll(tenantId).pipe(
        map((programs) => ({ loading: false, programs, error: null, tenantId })),
        startWith({ loading: true, programs: [], error: null, tenantId }),
        catchError((err) => of({ loading: false, programs: [], error: err.message || 'Failed to load programs', tenantId }))
      );
    })
  );

  getStatusColor(isActive: boolean): string {
    return isActive ? 'primary' : 'warn';
  }
}
