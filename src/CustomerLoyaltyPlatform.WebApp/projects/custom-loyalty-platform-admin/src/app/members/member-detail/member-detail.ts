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
import { MemberService } from '../member.service';
import { Member } from '../member.model';

interface MemberDetailViewModel {
  loading: boolean;
  member: Member | null;
  error: string | null;
  tenantId: string;
}

@Component({
  selector: 'app-member-detail',
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
  templateUrl: './member-detail.html',
  styleUrl: './member-detail.scss'
})
export class MemberDetail {
  private readonly memberService = inject(MemberService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  vm$: Observable<MemberDetailViewModel> = this.route.params.pipe(
    switchMap(params => {
      const tenantId = params['tenantId'];
      const memberId = params['memberId'];
      return this.memberService.getById(memberId, tenantId).pipe(
        map((member) => ({ loading: false, member, error: null, tenantId })),
        catchError((err) => of({ loading: false, member: null, error: err.message || 'Failed to load member', tenantId }))
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

  goBack(tenantId: string): void {
    this.router.navigate(['/tenants', tenantId, 'members']);
  }
}
