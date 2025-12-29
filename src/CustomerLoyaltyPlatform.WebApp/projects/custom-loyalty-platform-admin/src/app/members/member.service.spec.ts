import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { MemberService } from './member.service';
import { Member, EnrollMemberRequest, UpdateMemberRequest } from './member.model';

describe('MemberService', () => {
  let service: MemberService;
  let httpMock: HttpTestingController;

  const tenantId = '123e4567-e89b-12d3-a456-426614174000';
  const memberId = '323e4567-e89b-12d3-a456-426614174002';
  const programId = '423e4567-e89b-12d3-a456-426614174003';
  const businessId = '523e4567-e89b-12d3-a456-426614174004';

  const mockMember: Member = {
    memberId,
    tenantId,
    programId,
    businessId,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    enrollmentSource: 'InStore',
    referredByMemberId: null,
    status: 'Active',
    pointsBalance: 100,
    lifetimePoints: 500,
    enrolledAt: '2024-01-01T00:00:00Z',
    lastActivityAt: '2024-01-15T00:00:00Z'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MemberService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(MemberService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should return all members for a tenant', () => {
      const mockMembers: Member[] = [mockMember];

      service.getAll(tenantId).subscribe(members => {
        expect(members).toEqual(mockMembers);
        expect(members.length).toBe(1);
      });

      const req = httpMock.expectOne(`http://localhost:5000/api/members?tenantId=${tenantId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockMembers);
    });

    it('should return empty array when no members exist', () => {
      service.getAll(tenantId).subscribe(members => {
        expect(members).toEqual([]);
      });

      const req = httpMock.expectOne(`http://localhost:5000/api/members?tenantId=${tenantId}`);
      req.flush([]);
    });
  });

  describe('getById', () => {
    it('should return a single member', () => {
      service.getById(memberId, tenantId).subscribe(member => {
        expect(member).toEqual(mockMember);
        expect(member.memberId).toBe(memberId);
      });

      const req = httpMock.expectOne(`http://localhost:5000/api/members/${memberId}?tenantId=${tenantId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockMember);
    });

    it('should handle 404 error for non-existent member', () => {
      service.getById('non-existent-id', tenantId).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`http://localhost:5000/api/members/non-existent-id?tenantId=${tenantId}`);
      req.flush({ message: 'Not found' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('enroll', () => {
    it('should enroll a new member', () => {
      const request: EnrollMemberRequest = {
        tenantId,
        programId,
        businessId,
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phone: '+0987654321',
        enrollmentSource: 'Online'
      };

      service.enroll(request).subscribe(member => {
        expect(member.firstName).toBe(request.firstName);
        expect(member.lastName).toBe(request.lastName);
      });

      const req = httpMock.expectOne('http://localhost:5000/api/members');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(request);
      req.flush({ ...mockMember, ...request });
    });
  });

  describe('update', () => {
    it('should update an existing member', () => {
      const request: UpdateMemberRequest = {
        tenantId,
        firstName: 'John',
        lastName: 'Updated',
        email: 'updated@example.com',
        phone: '+1111111111'
      };

      service.update(memberId, request).subscribe(member => {
        expect(member.lastName).toBe(request.lastName);
      });

      const req = httpMock.expectOne(`http://localhost:5000/api/members/${memberId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(request);
      req.flush({ ...mockMember, ...request });
    });
  });
});
