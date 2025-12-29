import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { TenantDetail } from './tenant-detail';
import { Tenant } from '../tenant.model';

describe('TenantDetail', () => {
  let component: TenantDetail;
  let fixture: ComponentFixture<TenantDetail>;
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

  const mockActivatedRoute = {
    paramMap: of(new Map([['id', mockTenant.tenantId]]))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantDetail],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAnimations(),
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(TenantDetail);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    httpMock.expectOne(`http://localhost:5000/api/tenants/${mockTenant.tenantId}`).flush(mockTenant);
  });

  it('should display loading spinner initially', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-spinner')).toBeTruthy();
    httpMock.expectOne(`http://localhost:5000/api/tenants/${mockTenant.tenantId}`).flush(mockTenant);
  });

  it('should display tenant details after loading', async () => {
    fixture.detectChanges();
    const req = httpMock.expectOne(`http://localhost:5000/api/tenants/${mockTenant.tenantId}`);
    req.flush(mockTenant);
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Test Tenant');
    expect(compiled.textContent).toContain('test-tenant');
    expect(compiled.textContent).toContain('test@example.com');
  });

  it('should display error message on API failure', async () => {
    fixture.detectChanges();
    const req = httpMock.expectOne(`http://localhost:5000/api/tenants/${mockTenant.tenantId}`);
    req.flush({ message: 'Not found' }, { status: 404, statusText: 'Not Found' });
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.error-message')).toBeTruthy();
  });

  it('should show activate button for Provisioned tenant', async () => {
    fixture.detectChanges();
    const req = httpMock.expectOne(`http://localhost:5000/api/tenants/${mockTenant.tenantId}`);
    req.flush(mockTenant);
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const activateButton = compiled.querySelector('button[color="primary"]');
    expect(activateButton).toBeTruthy();
    expect(activateButton?.textContent).toContain('Activate Tenant');
  });

  it('should not show activate button for Active tenant', async () => {
    fixture.detectChanges();
    const req = httpMock.expectOne(`http://localhost:5000/api/tenants/${mockTenant.tenantId}`);
    req.flush({ ...mockTenant, status: 'Active' });
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll('mat-card-actions button');
    const activateButton = Array.from(buttons).find(btn => btn.textContent?.includes('Activate'));
    expect(activateButton).toBeFalsy();
  });

  it('should return correct status color for Active', () => {
    fixture.detectChanges();
    expect(component.getStatusColor('Active')).toBe('primary');
    httpMock.expectOne(`http://localhost:5000/api/tenants/${mockTenant.tenantId}`).flush(mockTenant);
  });

  it('should return correct status color for Provisioned', () => {
    fixture.detectChanges();
    expect(component.getStatusColor('Provisioned')).toBe('accent');
    httpMock.expectOne(`http://localhost:5000/api/tenants/${mockTenant.tenantId}`).flush(mockTenant);
  });

  it('should return correct status color for Suspended', () => {
    fixture.detectChanges();
    expect(component.getStatusColor('Suspended')).toBe('warn');
    httpMock.expectOne(`http://localhost:5000/api/tenants/${mockTenant.tenantId}`).flush(mockTenant);
  });

  it('should return empty string for unknown status', () => {
    fixture.detectChanges();
    expect(component.getStatusColor('Unknown')).toBe('');
    httpMock.expectOne(`http://localhost:5000/api/tenants/${mockTenant.tenantId}`).flush(mockTenant);
  });

  it('should display all tenant fields', async () => {
    fixture.detectChanges();
    const req = httpMock.expectOne(`http://localhost:5000/api/tenants/${mockTenant.tenantId}`);
    req.flush(mockTenant);
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Free');
    expect(compiled.textContent).toContain('US');
    expect(compiled.textContent).toContain('Shared');
    expect(compiled.textContent).toContain('Test User');
  });

  it('should have back button', async () => {
    fixture.detectChanges();
    httpMock.expectOne(`http://localhost:5000/api/tenants/${mockTenant.tenantId}`).flush(mockTenant);
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const backButton = compiled.querySelector('button[aria-label="Go back"]');
    expect(backButton).toBeTruthy();
  });

  it('should activate tenant when activate button clicked', async () => {
    fixture.detectChanges();
    const getReq = httpMock.expectOne(`http://localhost:5000/api/tenants/${mockTenant.tenantId}`);
    getReq.flush(mockTenant);
    await fixture.whenStable();
    fixture.detectChanges();

    component.activate(mockTenant.tenantId);

    const activateReq = httpMock.expectOne(`http://localhost:5000/api/tenants/${mockTenant.tenantId}/activate`);
    expect(activateReq.request.method).toBe('POST');
    activateReq.flush({ ...mockTenant, status: 'Active', activatedAt: '2024-01-02T00:00:00Z' });
    await fixture.whenStable();

    const refreshReq = httpMock.expectOne(`http://localhost:5000/api/tenants/${mockTenant.tenantId}`);
    refreshReq.flush({ ...mockTenant, status: 'Active' });
  });
});

describe('TenantDetail without tenant ID', () => {
  let component: TenantDetail;
  let fixture: ComponentFixture<TenantDetail>;
  let httpMock: HttpTestingController;

  const mockActivatedRouteNoId = {
    paramMap: of(new Map<string, string>())
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantDetail],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAnimations(),
        { provide: ActivatedRoute, useValue: mockActivatedRouteNoId }
      ]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(TenantDetail);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should display error when tenant ID not provided', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Tenant ID not provided');
  });
});
