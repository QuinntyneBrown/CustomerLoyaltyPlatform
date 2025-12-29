import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, map, combineLatest, switchMap } from 'rxjs';
import { PointsService } from '../points.service';
import { MemberService } from '../../members/member.service';
import { ProgramService } from '../../programs/program.service';
import { Member } from '../../members/member.model';
import { LoyaltyProgram } from '../../programs/program.model';

interface PointsEarnViewModel {
  loading: boolean;
  submitting: boolean;
  error: string | null;
  tenantId: string;
  members: Member[];
  programs: LoyaltyProgram[];
  selectedMemberId: string | null;
}

@Component({
  selector: 'app-points-earn',
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
  templateUrl: './points-earn.html',
  styleUrl: './points-earn.scss'
})
export class PointsEarn {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly pointsService = inject(PointsService);
  private readonly memberService = inject(MemberService);
  private readonly programService = inject(ProgramService);
  private readonly snackBar = inject(MatSnackBar);

  private readonly loading$ = new BehaviorSubject<boolean>(true);
  private readonly submitting$ = new BehaviorSubject<boolean>(false);
  private readonly error$ = new BehaviorSubject<string | null>(null);
  private readonly tenantId$ = new BehaviorSubject<string>('');
  private readonly members$ = new BehaviorSubject<Member[]>([]);
  private readonly programs$ = new BehaviorSubject<LoyaltyProgram[]>([]);
  private readonly selectedMemberId$ = new BehaviorSubject<string | null>(null);

  form = this.fb.group({
    memberId: ['', [Validators.required]],
    programId: ['', [Validators.required]],
    pointsAmount: [0, [Validators.required, Validators.min(1)]],
    earningType: ['Purchase', [Validators.required]],
    description: ['', [Validators.required, Validators.maxLength(500)]],
    notes: ['']
  });

  earningTypes = ['Purchase', 'Bonus', 'Promotion', 'Referral', 'Birthday', 'Manual'];

  vm$: Observable<PointsEarnViewModel> = combineLatest([
    this.loading$,
    this.submitting$,
    this.error$,
    this.tenantId$,
    this.members$,
    this.programs$,
    this.selectedMemberId$
  ]).pipe(
    map(([loading, submitting, error, tenantId, members, programs, selectedMemberId]) => ({
      loading,
      submitting,
      error,
      tenantId,
      members,
      programs,
      selectedMemberId
    }))
  );

  constructor() {
    combineLatest([this.route.params, this.route.queryParams]).pipe(
      switchMap(([params, queryParams]) => {
        const tenantId = params['tenantId'];
        this.tenantId$.next(tenantId);

        if (queryParams['memberId']) {
          this.selectedMemberId$.next(queryParams['memberId']);
          this.form.patchValue({ memberId: queryParams['memberId'] });
        }

        return combineLatest([
          this.memberService.getAll(tenantId),
          this.programService.getAll(tenantId)
        ]);
      })
    ).subscribe({
      next: ([members, programs]) => {
        this.members$.next(members);
        this.programs$.next(programs);
        this.loading$.next(false);
      },
      error: (err) => {
        this.loading$.next(false);
        this.error$.next(err.message || 'Failed to load data');
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting$.next(true);
    this.error$.next(null);

    const formValue = this.form.value;
    const tenantId = this.tenantId$.getValue();

    this.pointsService.earnPoints({
      tenantId,
      memberId: formValue.memberId!,
      programId: formValue.programId!,
      pointsAmount: formValue.pointsAmount!,
      earningType: formValue.earningType!,
      description: formValue.description!,
      notes: formValue.notes || undefined,
      processedBy: '00000000-0000-0000-0000-000000000000'
    }).subscribe({
      next: () => {
        this.submitting$.next(false);
        this.snackBar.open('Points earned successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/tenants', tenantId, 'members', formValue.memberId, 'points']);
      },
      error: (err) => {
        this.submitting$.next(false);
        this.error$.next(err.error?.message || err.message || 'Failed to earn points');
      }
    });
  }

  goBack(): void {
    const tenantId = this.tenantId$.getValue();
    const memberId = this.selectedMemberId$.getValue();
    if (memberId) {
      this.router.navigate(['/tenants', tenantId, 'members', memberId, 'points']);
    } else {
      this.router.navigate(['/tenants', tenantId, 'members']);
    }
  }
}
