import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TenantUser, TenantInvitation, InviteUserRequest } from './user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getAll(tenantId: string): Observable<TenantUser[]> {
    return this.http.get<TenantUser[]>(`${this.baseUrl}/tenants/${tenantId}/users`);
  }

  invite(tenantId: string, request: InviteUserRequest): Observable<TenantInvitation> {
    return this.http.post<TenantInvitation>(`${this.baseUrl}/tenants/${tenantId}/users/invite`, request);
  }
}
