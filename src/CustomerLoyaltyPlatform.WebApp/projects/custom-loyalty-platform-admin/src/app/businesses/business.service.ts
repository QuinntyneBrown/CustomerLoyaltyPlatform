import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Business, RegisterBusinessRequest, UpdateBusinessRequest } from './business.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getAll(tenantId: string): Observable<Business[]> {
    return this.http.get<Business[]>(`${this.baseUrl}/tenants/${tenantId}/businesses`);
  }

  getById(tenantId: string, businessId: string): Observable<Business> {
    return this.http.get<Business>(`${this.baseUrl}/tenants/${tenantId}/businesses/${businessId}`);
  }

  register(tenantId: string, request: RegisterBusinessRequest): Observable<Business> {
    return this.http.post<Business>(`${this.baseUrl}/tenants/${tenantId}/businesses`, request);
  }

  update(tenantId: string, businessId: string, request: UpdateBusinessRequest): Observable<Business> {
    return this.http.put<Business>(`${this.baseUrl}/tenants/${tenantId}/businesses/${businessId}`, request);
  }
}
