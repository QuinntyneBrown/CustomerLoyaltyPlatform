import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Member, EnrollMemberRequest, UpdateMemberRequest } from './member.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getAll(tenantId: string): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.baseUrl}/members`, {
      params: { tenantId }
    });
  }

  getById(memberId: string, tenantId: string): Observable<Member> {
    return this.http.get<Member>(`${this.baseUrl}/members/${memberId}`, {
      params: { tenantId }
    });
  }

  enroll(request: EnrollMemberRequest): Observable<Member> {
    return this.http.post<Member>(`${this.baseUrl}/members`, request);
  }

  update(memberId: string, request: UpdateMemberRequest): Observable<Member> {
    return this.http.put<Member>(`${this.baseUrl}/members/${memberId}`, request);
  }
}
