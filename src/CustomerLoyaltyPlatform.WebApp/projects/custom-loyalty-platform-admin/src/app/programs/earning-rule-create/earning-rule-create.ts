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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { BehaviorSubject, Observable, map, combineLatest } from 'rxjs';
import { ProgramService } from '../program.service';

interface EarningRuleCreateViewModel {
  submitting: boolean;
  error: string | null;
  tenantId: string;
  programId: string;
}

@Component({
  selector: 'app-earning-rule-create',
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
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './earning-rule-create.html',
  styleUrl: './earning-rule-create.scss'
})
export class EarningRuleCreate {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly programService = inject(ProgramService);
  private readonly snackBar = inject(MatSnackBar);

  private readonly submitting$ = new BehaviorSubject<boolean>(false);
  private readonly error$ = new BehaviorSubject<string | null>(null);
  private readonly tenantId$ = new BehaviorSubject<string>('');
  private readonly programId$ = new BehaviorSubject<string>('');

  form = this.fb.group({
    ruleType: ['PerDollar', [Validators.required]],
    pointsAmount: [1, [Validators.required, Validators.min(1)]],
    spendThreshold: [null as number | null],
    applicableCategories: [''],
    effectiveFrom: [new Date(), [Validators.required]],
    effectiveTo: [null as Date | null]
  });

  ruleTypes = ['PerDollar', 'PerVisit', 'PerItem', 'Bonus', 'Birthday', 'Signup'];

  vm$: Observable<EarningRuleCreateViewModel> = combineLatest([
    this.submitting$,
    this.error$,
    this.tenantId$,
    this.programId$
  ]).pipe(
    map(([submitting, error, tenantId, programId]) => ({ submitting, error, tenantId, programId }))
  );

  constructor() {
    this.route.params.subscribe(params => {
      this.tenantId$.next(params['tenantId']);
      this.programId$.next(params['programId']);
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
    const programId = this.programId$.getValue();

    this.programService.configureEarningRule(programId, {
      tenantId,
      ruleType: formValue.ruleType!,
      pointsAmount: formValue.pointsAmount!,
      spendThreshold: formValue.spendThreshold || undefined,
      applicableCategories: formValue.applicableCategories || undefined,
      effectiveFrom: formValue.effectiveFrom!.toISOString(),
      effectiveTo: formValue.effectiveTo?.toISOString(),
      configuredBy: '00000000-0000-0000-0000-000000000000'
    }).subscribe({
      next: () => {
        this.submitting$.next(false);
        this.snackBar.open('Earning rule configured successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/tenants', tenantId, 'programs', programId]);
      },
      error: (err) => {
        this.submitting$.next(false);
        this.error$.next(err.error?.message || err.message || 'Failed to configure earning rule');
      }
    });
  }

  goBack(): void {
    const tenantId = this.tenantId$.getValue();
    const programId = this.programId$.getValue();
    this.router.navigate(['/tenants', tenantId, 'programs', programId]);
  }
}
