import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tenant, CreateTenantRequest } from './tenant.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/tenants`;

  getAll(): Observable<Tenant[]> {
    return this.http.get<Tenant[]>(this.baseUrl);
  }

  getById(tenantId: string): Observable<Tenant> {
    return this.http.get<Tenant>(`${this.baseUrl}/${tenantId}`);
  }

  create(request: CreateTenantRequest): Observable<Tenant> {
    return this.http.post<Tenant>(this.baseUrl, request);
  }

  activate(tenantId: string): Observable<Tenant> {
    return this.http.post<Tenant>(`${this.baseUrl}/${tenantId}/activate`, {});
  }
}
