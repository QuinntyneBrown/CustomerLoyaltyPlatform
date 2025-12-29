import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TenantService } from './tenant.service';
import { Tenant, CreateTenantRequest } from './tenant.model';

describe('TenantService', () => {
  let service: TenantService;
  let httpMock: HttpTestingController;

  const mockTenant: Tenant = {
    tenantId: '123e4567-e89b-12d3-a456-426614174000',
    tenantName: 'Test Tenant',
    tenantSlug: 'test-tenant',
    primaryContactEmail: 'test@example.com',
    primaryContactName: 'Test User',
    planType: 'Free',
    dataRegion: 'US',
    isolationLevel: 'Shared',
    status: 'Provisioned',
    provisionedAt: '2024-01-01T00:00:00Z',
    activatedAt: null
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TenantService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(TenantService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should return all tenants', () => {
      const mockTenants: Tenant[] = [mockTenant];

      service.getAll().subscribe(tenants => {
        expect(tenants).toEqual(mockTenants);
        expect(tenants.length).toBe(1);
      });

      const req = httpMock.expectOne('http://localhost:5000/api/tenants');
      expect(req.request.method).toBe('GET');
      req.flush(mockTenants);
    });

    it('should return empty array when no tenants exist', () => {
      service.getAll().subscribe(tenants => {
        expect(tenants).toEqual([]);
        expect(tenants.length).toBe(0);
      });

      const req = httpMock.expectOne('http://localhost:5000/api/tenants');
      req.flush([]);
    });
  });

  describe('getById', () => {
    it('should return a single tenant', () => {
      const tenantId = mockTenant.tenantId;

      service.getById(tenantId).subscribe(tenant => {
        expect(tenant).toEqual(mockTenant);
        expect(tenant.tenantId).toBe(tenantId);
      });

      const req = httpMock.expectOne(`http://localhost:5000/api/tenants/${tenantId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockTenant);
    });

    it('should handle 404 error for non-existent tenant', () => {
      const tenantId = 'non-existent-id';

      service.getById(tenantId).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`http://localhost:5000/api/tenants/${tenantId}`);
      req.flush({ message: 'Not found' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('create', () => {
    it('should create a new tenant', () => {
      const request: CreateTenantRequest = {
        tenantName: 'New Tenant',
        tenantSlug: 'new-tenant',
        primaryContactEmail: 'new@example.com',
        primaryContactName: 'New User',
        planType: 'Starter',
        dataRegion: 'EU'
      };

      const createdTenant: Tenant = {
        ...mockTenant,
        tenantName: request.tenantName,
        tenantSlug: request.tenantSlug,
        primaryContactEmail: request.primaryContactEmail,
        primaryContactName: request.primaryContactName,
        planType: request.planType!,
        dataRegion: request.dataRegion!
      };

      service.create(request).subscribe(tenant => {
        expect(tenant.tenantName).toBe(request.tenantName);
        expect(tenant.tenantSlug).toBe(request.tenantSlug);
      });

      const req = httpMock.expectOne('http://localhost:5000/api/tenants');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(request);
      req.flush(createdTenant);
    });

    it('should create tenant with minimal required fields', () => {
      const request: CreateTenantRequest = {
        tenantName: 'Minimal Tenant',
        tenantSlug: 'minimal-tenant',
        primaryContactEmail: 'minimal@example.com',
        primaryContactName: 'Minimal User'
      };

      service.create(request).subscribe(tenant => {
        expect(tenant).toBeTruthy();
      });

      const req = httpMock.expectOne('http://localhost:5000/api/tenants');
      expect(req.request.method).toBe('POST');
      req.flush({ ...mockTenant, ...request });
    });

    it('should handle validation errors', () => {
      const request: CreateTenantRequest = {
        tenantName: '',
        tenantSlug: '',
        primaryContactEmail: 'invalid',
        primaryContactName: ''
      };

      service.create(request).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne('http://localhost:5000/api/tenants');
      req.flush({ message: 'Validation failed' }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('activate', () => {
    it('should activate a tenant', () => {
      const tenantId = mockTenant.tenantId;
      const activatedTenant: Tenant = {
        ...mockTenant,
        status: 'Active',
        activatedAt: '2024-01-02T00:00:00Z'
      };

      service.activate(tenantId).subscribe(tenant => {
        expect(tenant.status).toBe('Active');
        expect(tenant.activatedAt).toBeTruthy();
      });

      const req = httpMock.expectOne(`http://localhost:5000/api/tenants/${tenantId}/activate`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});
      req.flush(activatedTenant);
    });

    it('should handle activation error for already active tenant', () => {
      const tenantId = mockTenant.tenantId;

      service.activate(tenantId).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`http://localhost:5000/api/tenants/${tenantId}/activate`);
      req.flush({ message: 'Tenant already active' }, { status: 400, statusText: 'Bad Request' });
    });
  });
});
