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
import { ProgramService } from '../program.service';
import { BusinessService } from '../../businesses/business.service';
import { Business } from '../../businesses/business.model';

interface ProgramCreateViewModel {
  loading: boolean;
  submitting: boolean;
  error: string | null;
  tenantId: string;
  businesses: Business[];
}

@Component({
  selector: 'app-program-create',
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
  templateUrl: './program-create.html',
  styleUrl: './program-create.scss'
})
export class ProgramCreate {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly programService = inject(ProgramService);
  private readonly businessService = inject(BusinessService);
  private readonly snackBar = inject(MatSnackBar);

  private readonly loading$ = new BehaviorSubject<boolean>(true);
  private readonly submitting$ = new BehaviorSubject<boolean>(false);
  private readonly error$ = new BehaviorSubject<string | null>(null);
  private readonly tenantId$ = new BehaviorSubject<string>('');
  private readonly businesses$ = new BehaviorSubject<Business[]>([]);

  form = this.fb.group({
    programName: ['', [Validators.required, Validators.maxLength(200)]],
    businessId: ['', [Validators.required]],
    programType: ['Points', [Validators.required]],
    pointsName: ['Points', [Validators.required, Validators.maxLength(50)]]
  });

  programTypes = ['Points', 'Stamps', 'Tier', 'Hybrid'];

  vm$: Observable<ProgramCreateViewModel> = combineLatest([
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

    this.programService.create({
      tenantId,
      businessId: formValue.businessId!,
      programName: formValue.programName!,
      programType: formValue.programType!,
      pointsName: formValue.pointsName!,
      createdBy: '00000000-0000-0000-0000-000000000000'
    }).subscribe({
      next: (program) => {
        this.submitting$.next(false);
        this.snackBar.open('Program created successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/tenants', tenantId, 'programs', program.programId]);
      },
      error: (err) => {
        this.submitting$.next(false);
        this.error$.next(err.error?.message || err.message || 'Failed to create program');
      }
    });
  }

  goBack(): void {
    const tenantId = this.tenantId$.getValue();
    this.router.navigate(['/tenants', tenantId, 'programs']);
  }
}
