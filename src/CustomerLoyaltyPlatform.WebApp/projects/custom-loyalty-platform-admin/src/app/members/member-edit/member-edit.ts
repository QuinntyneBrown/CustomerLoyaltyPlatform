import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, map, combineLatest, switchMap, tap } from 'rxjs';
import { MemberService } from '../member.service';
import { Member } from '../member.model';

interface MemberEditViewModel {
  loading: boolean;
  submitting: boolean;
  error: string | null;
  member: Member | null;
  tenantId: string;
  memberId: string;
}

@Component({
  selector: 'app-member-edit',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './member-edit.html',
  styleUrl: './member-edit.scss'
})
export class MemberEdit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly memberService = inject(MemberService);
  private readonly snackBar = inject(MatSnackBar);

  private readonly loading$ = new BehaviorSubject<boolean>(true);
  private readonly submitting$ = new BehaviorSubject<boolean>(false);
  private readonly error$ = new BehaviorSubject<string | null>(null);
  private readonly member$ = new BehaviorSubject<Member | null>(null);
  private readonly tenantId$ = new BehaviorSubject<string>('');
  private readonly memberId$ = new BehaviorSubject<string>('');

  form = this.fb.group({
    firstName: ['', [Validators.required, Validators.maxLength(100)]],
    lastName: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-()]+$/)]]
  });

  vm$: Observable<MemberEditViewModel> = combineLatest([
    this.loading$,
    this.submitting$,
    this.error$,
    this.member$,
    this.tenantId$,
    this.memberId$
  ]).pipe(
    map(([loading, submitting, error, member, tenantId, memberId]) => ({
      loading,
      submitting,
      error,
      member,
      tenantId,
      memberId
    }))
  );

  constructor() {
    this.route.params.pipe(
      tap(params => {
        this.tenantId$.next(params['tenantId']);
        this.memberId$.next(params['memberId']);
      }),
      switchMap(params => this.memberService.getById(params['memberId'], params['tenantId']))
    ).subscribe({
      next: (member) => {
        this.member$.next(member);
        this.loading$.next(false);
        this.form.patchValue({
          firstName: member.firstName,
          lastName: member.lastName,
          email: member.email || '',
          phone: member.phone
        });
      },
      error: (err) => {
        this.loading$.next(false);
        this.error$.next(err.message || 'Failed to load member');
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
    const memberId = this.memberId$.getValue();

    this.memberService.update(memberId, {
      tenantId,
      firstName: formValue.firstName!,
      lastName: formValue.lastName!,
      email: formValue.email || undefined,
      phone: formValue.phone!
    }).subscribe({
      next: () => {
        this.submitting$.next(false);
        this.snackBar.open('Member updated successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/tenants', tenantId, 'members', memberId]);
      },
      error: (err) => {
        this.submitting$.next(false);
        this.error$.next(err.error?.message || err.message || 'Failed to update member');
      }
    });
  }

  goBack(): void {
    const tenantId = this.tenantId$.getValue();
    const memberId = this.memberId$.getValue();
    this.router.navigate(['/tenants', tenantId, 'members', memberId]);
  }
}
