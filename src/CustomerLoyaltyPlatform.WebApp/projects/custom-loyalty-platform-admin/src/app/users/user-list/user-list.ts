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
import { UserService } from '../user.service';
import { TenantUser } from '../user.model';

interface UserListViewModel {
  loading: boolean;
  users: TenantUser[];
  error: string | null;
  tenantId: string;
}

@Component({
  selector: 'app-user-list',
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
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss'
})
export class UserList {
  private readonly userService = inject(UserService);
  private readonly route = inject(ActivatedRoute);

  displayedColumns = ['displayName', 'email', 'role', 'joinedAt', 'lastLoginAt', 'isActive'];

  vm$: Observable<UserListViewModel> = this.route.params.pipe(
    switchMap(params => {
      const tenantId = params['tenantId'];
      return this.userService.getAll(tenantId).pipe(
        map((users) => ({ loading: false, users, error: null, tenantId })),
        startWith({ loading: true, users: [], error: null, tenantId }),
        catchError((err) => of({ loading: false, users: [], error: err.message || 'Failed to load users', tenantId }))
      );
    })
  );

  getRoleColor(role: string): string {
    switch (role) {
      case 'Owner':
        return 'primary';
      case 'Admin':
        return 'accent';
      default:
        return '';
    }
  }

  getStatusColor(isActive: boolean): string {
    return isActive ? 'primary' : 'warn';
  }
}
