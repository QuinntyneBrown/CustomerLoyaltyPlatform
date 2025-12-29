import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoyaltyProgram, EarningRule, CreateProgramRequest, ConfigureEarningRuleRequest } from './program.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProgramService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getAll(tenantId: string): Observable<LoyaltyProgram[]> {
    return this.http.get<LoyaltyProgram[]>(`${this.baseUrl}/programs`, {
      params: { tenantId }
    });
  }

  getById(programId: string, tenantId: string): Observable<LoyaltyProgram> {
    return this.http.get<LoyaltyProgram>(`${this.baseUrl}/programs/${programId}`, {
      params: { tenantId }
    });
  }

  create(request: CreateProgramRequest): Observable<LoyaltyProgram> {
    return this.http.post<LoyaltyProgram>(`${this.baseUrl}/programs`, request);
  }

  getEarningRules(programId: string, tenantId: string): Observable<EarningRule[]> {
    return this.http.get<EarningRule[]>(`${this.baseUrl}/programs/${programId}/earning-rules`, {
      params: { tenantId }
    });
  }

  configureEarningRule(programId: string, request: ConfigureEarningRuleRequest): Observable<EarningRule> {
    return this.http.post<EarningRule>(`${this.baseUrl}/programs/${programId}/earning-rules`, request);
  }
}
