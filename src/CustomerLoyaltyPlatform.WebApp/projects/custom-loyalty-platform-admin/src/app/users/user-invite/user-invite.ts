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
import { BehaviorSubject, Observable, map, combineLatest } from 'rxjs';
import { UserService } from '../user.service';

interface UserInviteViewModel {
  submitting: boolean;
  error: string | null;
  tenantId: string;
}

@Component({
  selector: 'app-user-invite',
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
  templateUrl: './user-invite.html',
  styleUrl: './user-invite.scss'
})
export class UserInvite {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);
  private readonly snackBar = inject(MatSnackBar);

  private readonly submitting$ = new BehaviorSubject<boolean>(false);
  private readonly error$ = new BehaviorSubject<string | null>(null);
  private readonly tenantId$ = new BehaviorSubject<string>('');

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    role: ['Member', [Validators.required]]
  });

  roles = ['Owner', 'Admin', 'Manager', 'Member'];

  vm$: Observable<UserInviteViewModel> = combineLatest([
    this.submitting$,
    this.error$,
    this.tenantId$
  ]).pipe(
    map(([submitting, error, tenantId]) => ({ submitting, error, tenantId }))
  );

  constructor() {
    this.route.params.subscribe(params => {
      this.tenantId$.next(params['tenantId']);
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

    this.userService.invite(tenantId, {
      email: formValue.email!,
      role: formValue.role!,
      invitedBy: '00000000-0000-0000-0000-000000000000'
    }).subscribe({
      next: () => {
        this.submitting$.next(false);
        this.snackBar.open('Invitation sent successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/tenants', tenantId, 'users']);
      },
      error: (err) => {
        this.submitting$.next(false);
        this.error$.next(err.error?.message || err.message || 'Failed to send invitation');
      }
    });
  }

  goBack(): void {
    const tenantId = this.tenantId$.getValue();
    this.router.navigate(['/tenants', tenantId, 'users']);
  }
}
