import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TenantList } from './tenant-list';
import { Tenant } from '../tenant.model';

describe('TenantList', () => {
  let component: TenantList;
  let fixture: ComponentFixture<TenantList>;
  let httpMock: HttpTestingController;

  const mockTenants: Tenant[] = [
    {
      tenantId: '123e4567-e89b-12d3-a456-426614174000',
      tenantName: 'Test Tenant 1',
      tenantSlug: 'test-tenant-1',
      primaryContactEmail: 'test1@example.com',
      primaryContactName: 'Test User 1',
      planType: 'Free',
      dataRegion: 'US',
      isolationLevel: 'Shared',
      status: 'Active',
      provisionedAt: '2024-01-01T00:00:00Z',
      activatedAt: '2024-01-02T00:00:00Z'
    },
    {
      tenantId: '223e4567-e89b-12d3-a456-426614174001',
      tenantName: 'Test Tenant 2',
      tenantSlug: 'test-tenant-2',
      primaryContactEmail: 'test2@example.com',
      primaryContactName: 'Test User 2',
      planType: 'Starter',
      dataRegion: 'EU',
      isolationLevel: 'Shared',
      status: 'Provisioned',
      provisionedAt: '2024-01-03T00:00:00Z',
      activatedAt: null
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantList],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAnimations()
      ]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(TenantList);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    httpMock.expectOne('http://localhost:5000/api/tenants').flush([]);
  });

  it('should display loading spinner initially', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-spinner')).toBeTruthy();
    httpMock.expectOne('http://localhost:5000/api/tenants').flush([]);
  });

  it('should display tenants in table after loading', async () => {
    fixture.detectChanges();
    const req = httpMock.expectOne('http://localhost:5000/api/tenants');
    req.flush(mockTenants);
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-spinner')).toBeFalsy();
    expect(compiled.querySelectorAll('tr.mat-mdc-row').length).toBe(2);
  });

  it('should display empty state when no tenants', async () => {
    fixture.detectChanges();
    const req = httpMock.expectOne('http://localhost:5000/api/tenants');
    req.flush([]);
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('No tenants found');
  });

  it('should display error message on API failure', async () => {
    fixture.detectChanges();
    const req = httpMock.expectOne('http://localhost:5000/api/tenants');
    req.flush({ message: 'Server error' }, { status: 500, statusText: 'Internal Server Error' });
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.error-message')).toBeTruthy();
  });

  it('should have correct displayed columns', () => {
    fixture.detectChanges();
    expect(component.displayedColumns).toEqual(['tenantName', 'tenantSlug', 'status', 'planType', 'actions']);
    httpMock.expectOne('http://localhost:5000/api/tenants').flush([]);
  });

  it('should return correct status color for Active', () => {
    fixture.detectChanges();
    expect(component.getStatusColor('Active')).toBe('primary');
    httpMock.expectOne('http://localhost:5000/api/tenants').flush([]);
  });

  it('should return correct status color for Provisioned', () => {
    fixture.detectChanges();
    expect(component.getStatusColor('Provisioned')).toBe('accent');
    httpMock.expectOne('http://localhost:5000/api/tenants').flush([]);
  });

  it('should return correct status color for Suspended', () => {
    fixture.detectChanges();
    expect(component.getStatusColor('Suspended')).toBe('warn');
    httpMock.expectOne('http://localhost:5000/api/tenants').flush([]);
  });

  it('should return empty string for unknown status', () => {
    fixture.detectChanges();
    expect(component.getStatusColor('Unknown')).toBe('');
    httpMock.expectOne('http://localhost:5000/api/tenants').flush([]);
  });

  it('should have create tenant button', async () => {
    fixture.detectChanges();
    httpMock.expectOne('http://localhost:5000/api/tenants').flush(mockTenants);
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const createButton = compiled.querySelector('a[routerLink="/tenants/create"]');
    expect(createButton).toBeTruthy();
    expect(createButton?.textContent).toContain('Create Tenant');
  });

  it('should have view action buttons for each tenant', async () => {
    fixture.detectChanges();
    httpMock.expectOne('http://localhost:5000/api/tenants').flush(mockTenants);
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const viewButtons = compiled.querySelectorAll('a[mat-icon-button]');
    expect(viewButtons.length).toBe(2);
  });
});
