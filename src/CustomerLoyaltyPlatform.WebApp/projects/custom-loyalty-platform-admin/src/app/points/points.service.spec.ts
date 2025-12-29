import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { PointsService } from './points.service';
import { PointsTransaction, PointsBalance, EarnPointsRequest, RedeemPointsRequest } from './points.model';

describe('PointsService', () => {
  let service: PointsService;
  let httpMock: HttpTestingController;

  const tenantId = '123e4567-e89b-12d3-a456-426614174000';
  const memberId = '323e4567-e89b-12d3-a456-426614174002';
  const programId = '423e4567-e89b-12d3-a456-426614174003';

  const mockTransaction: PointsTransaction = {
    transactionId: '823e4567-e89b-12d3-a456-426614174007',
    memberId,
    tenantId,
    programId,
    transactionType: 'Earn',
    pointsAmount: 50,
    runningBalance: 150,
    description: 'Purchase at store',
    notes: null,
    processedBy: '623e4567-e89b-12d3-a456-426614174005',
    processedAt: '2024-01-15T00:00:00Z',
    expiresAt: null
  };

  const mockBalance: PointsBalance = {
    memberId,
    tenantId,
    currentBalance: 150,
    lifetimeEarned: 500,
    lifetimeRedeemed: 350,
    expiringPoints: 50,
    expiringDate: '2024-06-01T00:00:00Z'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PointsService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(PointsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getMemberBalance', () => {
    it('should return member points balance', () => {
      service.getMemberBalance(memberId, tenantId).subscribe(balance => {
        expect(balance).toEqual(mockBalance);
        expect(balance.currentBalance).toBe(150);
      });

      const req = httpMock.expectOne(`http://localhost:5000/api/members/${memberId}/points/balance?tenantId=${tenantId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockBalance);
    });
  });

  describe('getMemberTransactions', () => {
    it('should return member transactions', () => {
      const mockTransactions: PointsTransaction[] = [mockTransaction];

      service.getMemberTransactions(memberId, tenantId).subscribe(transactions => {
        expect(transactions).toEqual(mockTransactions);
        expect(transactions.length).toBe(1);
      });

      const req = httpMock.expectOne(`http://localhost:5000/api/members/${memberId}/transactions?tenantId=${tenantId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockTransactions);
    });
  });

  describe('earnPoints', () => {
    it('should earn points for a member', () => {
      const request: EarnPointsRequest = {
        tenantId,
        memberId,
        programId,
        pointsAmount: 50,
        earningType: 'Purchase',
        description: 'Store purchase',
        processedBy: '623e4567-e89b-12d3-a456-426614174005'
      };

      service.earnPoints(request).subscribe(transaction => {
        expect(transaction.transactionType).toBe('Earn');
        expect(transaction.pointsAmount).toBe(50);
      });

      const req = httpMock.expectOne('http://localhost:5000/api/points/earn');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(request);
      req.flush(mockTransaction);
    });
  });

  describe('redeemPoints', () => {
    it('should redeem points for a member', () => {
      const request: RedeemPointsRequest = {
        tenantId,
        memberId,
        programId,
        pointsAmount: 100,
        description: 'Reward redemption',
        processedBy: '623e4567-e89b-12d3-a456-426614174005'
      };

      const redeemTransaction: PointsTransaction = {
        ...mockTransaction,
        transactionType: 'Redeem',
        pointsAmount: 100,
        runningBalance: 50
      };

      service.redeemPoints(request).subscribe(transaction => {
        expect(transaction.transactionType).toBe('Redeem');
      });

      const req = httpMock.expectOne('http://localhost:5000/api/points/redeem');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(request);
      req.flush(redeemTransaction);
    });
  });
});
