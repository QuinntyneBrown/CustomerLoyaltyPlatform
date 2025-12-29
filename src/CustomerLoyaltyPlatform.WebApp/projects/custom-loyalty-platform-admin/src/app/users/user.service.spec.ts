import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { TenantUser, TenantInvitation, InviteUserRequest } from './user.model';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const tenantId = '123e4567-e89b-12d3-a456-426614174000';

  const mockUser: TenantUser = {
    tenantUserId: '923e4567-e89b-12d3-a456-426614174008',
    tenantId,
    userId: 'a23e4567-e89b-12d3-a456-426614174009',
    email: 'user@example.com',
    displayName: 'Test User',
    role: 'Admin',
    joinedAt: '2024-01-01T00:00:00Z',
    lastLoginAt: '2024-01-15T00:00:00Z',
    isActive: true
  };

  const mockInvitation: TenantInvitation = {
    invitationId: 'b23e4567-e89b-12d3-a456-426614174010',
    tenantId,
    email: 'invited@example.com',
    role: 'Member',
    token: 'abc123token',
    invitedBy: '623e4567-e89b-12d3-a456-426614174005',
    invitedAt: '2024-01-15T00:00:00Z',
    expiresAt: '2024-01-22T00:00:00Z',
    acceptedAt: null
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should return all users for a tenant', () => {
      const mockUsers: TenantUser[] = [mockUser];

      service.getAll(tenantId).subscribe(users => {
        expect(users).toEqual(mockUsers);
        expect(users.length).toBe(1);
      });

      const req = httpMock.expectOne(`http://localhost:5000/api/tenants/${tenantId}/users`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUsers);
    });

    it('should return empty array when no users exist', () => {
      service.getAll(tenantId).subscribe(users => {
        expect(users).toEqual([]);
      });

      const req = httpMock.expectOne(`http://localhost:5000/api/tenants/${tenantId}/users`);
      req.flush([]);
    });
  });

  describe('invite', () => {
    it('should send an invitation', () => {
      const request: InviteUserRequest = {
        email: 'newinvite@example.com',
        role: 'Manager',
        invitedBy: '623e4567-e89b-12d3-a456-426614174005'
      };

      service.invite(tenantId, request).subscribe(invitation => {
        expect(invitation.email).toBe(request.email);
        expect(invitation.role).toBe(request.role);
      });

      const req = httpMock.expectOne(`http://localhost:5000/api/tenants/${tenantId}/users/invite`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(request);
      req.flush({ ...mockInvitation, email: request.email, role: request.role });
    });

    it('should handle error for duplicate invitation', () => {
      const request: InviteUserRequest = {
        email: 'existing@example.com',
        role: 'Member',
        invitedBy: '623e4567-e89b-12d3-a456-426614174005'
      };

      service.invite(tenantId, request).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`http://localhost:5000/api/tenants/${tenantId}/users/invite`);
      req.flush({ message: 'User already invited' }, { status: 400, statusText: 'Bad Request' });
    });
  });
});
