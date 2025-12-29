import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PointsTransaction, PointsBalance, EarnPointsRequest, RedeemPointsRequest } from './points.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PointsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getMemberBalance(memberId: string, tenantId: string): Observable<PointsBalance> {
    return this.http.get<PointsBalance>(`${this.baseUrl}/members/${memberId}/points/balance`, {
      params: { tenantId }
    });
  }

  getMemberTransactions(memberId: string, tenantId: string): Observable<PointsTransaction[]> {
    return this.http.get<PointsTransaction[]>(`${this.baseUrl}/members/${memberId}/transactions`, {
      params: { tenantId }
    });
  }

  earnPoints(request: EarnPointsRequest): Observable<PointsTransaction> {
    return this.http.post<PointsTransaction>(`${this.baseUrl}/points/earn`, request);
  }

  redeemPoints(request: RedeemPointsRequest): Observable<PointsTransaction> {
    return this.http.post<PointsTransaction>(`${this.baseUrl}/points/redeem`, request);
  }
}
