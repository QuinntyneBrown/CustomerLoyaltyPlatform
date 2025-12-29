import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TenantCreate } from './tenant-create';
import { Tenant } from '../tenant.model';

describe('TenantCreate', () => {
  let component: TenantCreate;
  let fixture: ComponentFixture<TenantCreate>;
  let httpMock: HttpTestingController;
  let router: Router;

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantCreate],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAnimations()
      ]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(TenantCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a form with required fields', () => {
    expect(component.form).toBeTruthy();
    expect(component.form.get('tenantName')).toBeTruthy();
    expect(component.form.get('tenantSlug')).toBeTruthy();
    expect(component.form.get('primaryContactEmail')).toBeTruthy();
    expect(component.form.get('primaryContactName')).toBeTruthy();
    expect(component.form.get('planType')).toBeTruthy();
    expect(component.form.get('dataRegion')).toBeTruthy();
  });

  it('should have default values for planType and dataRegion', () => {
    expect(component.form.get('planType')?.value).toBe('Free');
    expect(component.form.get('dataRegion')?.value).toBe('US');
  });

  it('should have plan types options', () => {
    expect(component.planTypes).toEqual(['Free', 'Starter', 'Professional', 'Enterprise']);
  });

  it('should have data regions options', () => {
    expect(component.dataRegions).toEqual(['US', 'EU', 'APAC']);
  });

  it('should mark form as invalid when empty', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it('should mark form as valid with required fields filled', () => {
    component.form.patchValue({
      tenantName: 'Test Tenant',
      tenantSlug: 'test-tenant',
      primaryContactEmail: 'test@example.com',
      primaryContactName: 'Test User'
    });
    expect(component.form.valid).toBeTruthy();
  });

  it('should validate email format', () => {
    component.form.get('primaryContactEmail')?.setValue('invalid-email');
    expect(component.form.get('primaryContactEmail')?.hasError('email')).toBeTruthy();

    component.form.get('primaryContactEmail')?.setValue('valid@email.com');
    expect(component.form.get('primaryContactEmail')?.hasError('email')).toBeFalsy();
  });

  it('should validate tenant slug pattern', () => {
    component.form.get('tenantSlug')?.setValue('Invalid Slug');
    expect(component.form.get('tenantSlug')?.hasError('pattern')).toBeTruthy();

    component.form.get('tenantSlug')?.setValue('valid-slug-123');
    expect(component.form.get('tenantSlug')?.hasError('pattern')).toBeFalsy();
  });

  it('should validate tenant name max length', () => {
    component.form.get('tenantName')?.setValue('a'.repeat(201));
    expect(component.form.get('tenantName')?.hasError('maxlength')).toBeTruthy();

    component.form.get('tenantName')?.setValue('Valid Name');
    expect(component.form.get('tenantName')?.hasError('maxlength')).toBeFalsy();
  });

  it('should validate tenant slug max length', () => {
    component.form.get('tenantSlug')?.setValue('a'.repeat(51));
    expect(component.form.get('tenantSlug')?.hasError('maxlength')).toBeTruthy();

    component.form.get('tenantSlug')?.setValue('valid-slug');
    expect(component.form.get('tenantSlug')?.hasError('maxlength')).toBeFalsy();
  });

  it('should not submit when form is invalid', () => {
    const spy = vi.spyOn(router, 'navigate');
    component.submit();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should submit when form is valid', async () => {
    const spy = vi.spyOn(router, 'navigate');

    component.form.patchValue({
      tenantName: 'Test Tenant',
      tenantSlug: 'test-tenant',
      primaryContactEmail: 'test@example.com',
      primaryContactName: 'Test User'
    });

    component.submit();

    const req = httpMock.expectOne('http://localhost:5000/api/tenants');
    expect(req.request.method).toBe('POST');
    req.flush(mockTenant);
    await fixture.whenStable();

    expect(spy).toHaveBeenCalledWith(['/tenants', mockTenant.tenantId]);
  });

  it('should display error message on API failure', async () => {
    component.form.patchValue({
      tenantName: 'Test Tenant',
      tenantSlug: 'test-tenant',
      primaryContactEmail: 'test@example.com',
      primaryContactName: 'Test User'
    });

    component.submit();

    const req = httpMock.expectOne('http://localhost:5000/api/tenants');
    req.flush({ message: 'Slug already exists' }, { status: 400, statusText: 'Bad Request' });
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.error-banner')).toBeTruthy();
  });

  it('should generate slug from tenant name', () => {
    component.form.get('tenantName')?.setValue('My Test Tenant');
    component.generateSlug();
    expect(component.form.get('tenantSlug')?.value).toBe('my-test-tenant');
  });

  it('should handle special characters when generating slug', () => {
    component.form.get('tenantName')?.setValue('Tenant & Co. (2024)');
    component.generateSlug();
    expect(component.form.get('tenantSlug')?.value).toBe('tenant-co-2024');
  });

  it('should not generate slug when tenant name is empty', () => {
    component.form.get('tenantSlug')?.setValue('existing-slug');
    component.form.get('tenantName')?.setValue('');
    component.generateSlug();
    expect(component.form.get('tenantSlug')?.value).toBe('existing-slug');
  });

  it('should have back button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const backButton = compiled.querySelector('button[aria-label="Go back"]');
    expect(backButton).toBeTruthy();
  });

  it('should have cancel button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const cancelButton = Array.from(compiled.querySelectorAll('button')).find(
      btn => btn.textContent?.includes('Cancel')
    );
    expect(cancelButton).toBeTruthy();
  });

  it('should have submit button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const submitButton = compiled.querySelector('button[type="submit"]');
    expect(submitButton).toBeTruthy();
    expect(submitButton?.textContent).toContain('Create Tenant');
  });

  it('should navigate back when goBack is called', () => {
    const spy = vi.spyOn(router, 'navigate');
    component.goBack();
    expect(spy).toHaveBeenCalledWith(['/tenants']);
  });

  it('should display form fields correctly', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('input[formControlName="tenantName"]')).toBeTruthy();
    expect(compiled.querySelector('input[formControlName="tenantSlug"]')).toBeTruthy();
    expect(compiled.querySelector('input[formControlName="primaryContactEmail"]')).toBeTruthy();
    expect(compiled.querySelector('input[formControlName="primaryContactName"]')).toBeTruthy();
    expect(compiled.querySelector('mat-select[formControlName="planType"]')).toBeTruthy();
    expect(compiled.querySelector('mat-select[formControlName="dataRegion"]')).toBeTruthy();
  });
});
