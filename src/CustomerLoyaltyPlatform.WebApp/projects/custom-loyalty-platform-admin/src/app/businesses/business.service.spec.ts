import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { BusinessService } from './business.service';
import { Business, RegisterBusinessRequest, UpdateBusinessRequest } from './business.model';

describe('BusinessService', () => {
  let service: BusinessService;
  let httpMock: HttpTestingController;

  const tenantId = '123e4567-e89b-12d3-a456-426614174000';
  const businessId = '223e4567-e89b-12d3-a456-426614174001';

  const mockBusiness: Business = {
    businessId,
    tenantId,
    businessName: 'Test Business',
    ownerName: 'John Doe',
    email: 'business@example.com',
    phone: '+1234567890',
    businessType: 'Retail',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'USA'
    },
    status: 'Active',
    isEmailVerified: true,
    isPhoneVerified: false,
    isIdentityVerified: false,
    registeredAt: '2024-01-01T00:00:00Z'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BusinessService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(BusinessService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should return all businesses for a tenant', () => {
      const mockBusinesses: Business[] = [mockBusiness];

      service.getAll(tenantId).subscribe(businesses => {
        expect(businesses).toEqual(mockBusinesses);
        expect(businesses.length).toBe(1);
      });

      const req = httpMock.expectOne(`http://localhost:5000/api/tenants/${tenantId}/businesses`);
      expect(req.request.method).toBe('GET');
      req.flush(mockBusinesses);
    });

    it('should return empty array when no businesses exist', () => {
      service.getAll(tenantId).subscribe(businesses => {
        expect(businesses).toEqual([]);
        expect(businesses.length).toBe(0);
      });

      const req = httpMock.expectOne(`http://localhost:5000/api/tenants/${tenantId}/businesses`);
      req.flush([]);
    });
  });

  describe('getById', () => {
    it('should return a single business', () => {
      service.getById(tenantId, businessId).subscribe(business => {
        expect(business).toEqual(mockBusiness);
        expect(business.businessId).toBe(businessId);
      });

      const req = httpMock.expectOne(`http://localhost:5000/api/tenants/${tenantId}/businesses/${businessId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockBusiness);
    });

    it('should handle 404 error for non-existent business', () => {
      service.getById(tenantId, 'non-existent-id').subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`http://localhost:5000/api/tenants/${tenantId}/businesses/non-existent-id`);
      req.flush({ message: 'Not found' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('register', () => {
    it('should register a new business', () => {
      const request: RegisterBusinessRequest = {
        businessName: 'New Business',
        ownerName: 'Jane Doe',
        email: 'new@example.com',
        phone: '+0987654321',
        businessType: 'Restaurant',
        address: {
          street: '456 Oak Ave',
          city: 'Los Angeles',
          state: 'CA',
          postalCode: '90001',
          country: 'USA'
        }
      };

      service.register(tenantId, request).subscribe(business => {
        expect(business.businessName).toBe(request.businessName);
      });

      const req = httpMock.expectOne(`http://localhost:5000/api/tenants/${tenantId}/businesses`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(request);
      req.flush({ ...mockBusiness, ...request });
    });
  });

  describe('update', () => {
    it('should update an existing business', () => {
      const request: UpdateBusinessRequest = {
        businessName: 'Updated Business',
        ownerName: 'John Smith',
        email: 'updated@example.com',
        phone: '+1111111111',
        address: {
          street: '789 Pine St',
          city: 'Chicago',
          state: 'IL',
          postalCode: '60601',
          country: 'USA'
        }
      };

      service.update(tenantId, businessId, request).subscribe(business => {
        expect(business.businessName).toBe(request.businessName);
      });

      const req = httpMock.expectOne(`http://localhost:5000/api/tenants/${tenantId}/businesses/${businessId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(request);
      req.flush({ ...mockBusiness, ...request });
    });
  });
});
