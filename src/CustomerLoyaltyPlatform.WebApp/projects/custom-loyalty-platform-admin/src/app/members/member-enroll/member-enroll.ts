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
import { BehaviorSubject, Observable, map, combineLatest, switchMap, of, catchError, startWith } from 'rxjs';
import { MemberService } from '../member.service';
import { BusinessService } from '../../businesses/business.service';
import { Business } from '../../businesses/business.model';

interface MemberEnrollViewModel {
  loading: boolean;
  submitting: boolean;
  error: string | null;
  tenantId: string;
  businesses: Business[];
}

@Component({
  selector: 'app-member-enroll',
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
  templateUrl: './member-enroll.html',
  styleUrl: './member-enroll.scss'
})
export class MemberEnroll {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly memberService = inject(MemberService);
  private readonly businessService = inject(BusinessService);
  private readonly snackBar = inject(MatSnackBar);

  private readonly loading$ = new BehaviorSubject<boolean>(true);
  private readonly submitting$ = new BehaviorSubject<boolean>(false);
  private readonly error$ = new BehaviorSubject<string | null>(null);
  private readonly tenantId$ = new BehaviorSubject<string>('');
  private readonly businesses$ = new BehaviorSubject<Business[]>([]);

  form = this.fb.group({
    firstName: ['', [Validators.required, Validators.maxLength(100)]],
    lastName: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-()]+$/)]],
    businessId: ['', [Validators.required]],
    enrollmentSource: ['InStore', [Validators.required]]
  });

  enrollmentSources = ['InStore', 'Online', 'Referral', 'Marketing', 'Other'];

  vm$: Observable<MemberEnrollViewModel> = combineLatest([
    this.loading$,
    this.submitting$,
    this.error$,
    this.tenantId$,
    this.businesses$
  ]).pipe(
    map(([loading, submitting, error, tenantId, businesses]) => ({
      loading,
      submitting,
      error,
      tenantId,
      businesses
    }))
  );

  constructor() {
    this.route.params.pipe(
      switchMap(params => {
        const tenantId = params['tenantId'];
        this.tenantId$.next(tenantId);
        return this.businessService.getAll(tenantId);
      })
    ).subscribe({
      next: (businesses) => {
        this.businesses$.next(businesses);
        this.loading$.next(false);
      },
      error: (err) => {
        this.loading$.next(false);
        this.error$.next(err.message || 'Failed to load businesses');
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
    const selectedBusiness = this.businesses$.getValue().find(b => b.businessId === formValue.businessId);

    this.memberService.enroll({
      tenantId,
      programId: selectedBusiness?.businessId || formValue.businessId!,
      businessId: formValue.businessId!,
      firstName: formValue.firstName!,
      lastName: formValue.lastName!,
      email: formValue.email || undefined,
      phone: formValue.phone!,
      enrollmentSource: formValue.enrollmentSource!
    }).subscribe({
      next: (member) => {
        this.submitting$.next(false);
        this.snackBar.open('Member enrolled successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/tenants', tenantId, 'members', member.memberId]);
      },
      error: (err) => {
        this.submitting$.next(false);
        this.error$.next(err.error?.message || err.message || 'Failed to enroll member');
      }
    });
  }

  goBack(): void {
    const tenantId = this.tenantId$.getValue();
    this.router.navigate(['/tenants', tenantId, 'members']);
  }
}
