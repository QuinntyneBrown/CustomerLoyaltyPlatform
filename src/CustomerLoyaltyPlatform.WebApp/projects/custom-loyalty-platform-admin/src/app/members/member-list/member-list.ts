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
import { MemberService } from '../member.service';
import { Member } from '../member.model';

interface MemberListViewModel {
  loading: boolean;
  members: Member[];
  error: string | null;
  tenantId: string;
}

@Component({
  selector: 'app-member-list',
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
  templateUrl: './member-list.html',
  styleUrl: './member-list.scss'
})
export class MemberList {
  private readonly memberService = inject(MemberService);
  private readonly route = inject(ActivatedRoute);

  displayedColumns = ['name', 'email', 'phone', 'pointsBalance', 'status', 'enrolledAt', 'actions'];

  vm$: Observable<MemberListViewModel> = this.route.params.pipe(
    switchMap(params => {
      const tenantId = params['tenantId'];
      return this.memberService.getAll(tenantId).pipe(
        map((members) => ({ loading: false, members, error: null, tenantId })),
        startWith({ loading: true, members: [], error: null, tenantId }),
        catchError((err) => of({ loading: false, members: [], error: err.message || 'Failed to load members', tenantId }))
      );
    })
  );

  getStatusColor(status: string): string {
    switch (status) {
      case 'Active':
        return 'primary';
      case 'Inactive':
        return 'warn';
      default:
        return '';
    }
  }
}
