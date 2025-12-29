import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ProgramService } from './program.service';
import { LoyaltyProgram, EarningRule, CreateProgramRequest, ConfigureEarningRuleRequest } from './program.model';

describe('ProgramService', () => {
  let service: ProgramService;
  let httpMock: HttpTestingController;

  const tenantId = '123e4567-e89b-12d3-a456-426614174000';
  const programId = '423e4567-e89b-12d3-a456-426614174003';
  const businessId = '523e4567-e89b-12d3-a456-426614174004';

  const mockProgram: LoyaltyProgram = {
    programId,
    tenantId,
    businessId,
    programName: 'Rewards Program',
    programType: 'Points',
    pointsName: 'Stars',
    isActive: true,
    createdBy: '623e4567-e89b-12d3-a456-426614174005',
    createdAt: '2024-01-01T00:00:00Z'
  };

  const mockEarningRule: EarningRule = {
    earningRuleId: '723e4567-e89b-12d3-a456-426614174006',
    programId,
    tenantId,
    ruleType: 'PerDollar',
    pointsAmount: 1,
    spendThreshold: null,
    applicableCategories: null,
    effectiveFrom: '2024-01-01T00:00:00Z',
    effectiveTo: null,
    isActive: true,
    configuredBy: '623e4567-e89b-12d3-a456-426614174005',
    configuredAt: '2024-01-01T00:00:00Z'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProgramService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(ProgramService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should return all programs for a tenant', () => {
      const mockPrograms: LoyaltyProgram[] = [mockProgram];

      service.getAll(tenantId).subscribe(programs => {
        expect(programs).toEqual(mockPrograms);
        expect(programs.length).toBe(1);
      });

      const req = httpMock.expectOne(`http://localhost:5000/api/programs?tenantId=${tenantId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPrograms);
    });
  });

  describe('getById', () => {
    it('should return a single program', () => {
      service.getById(programId, tenantId).subscribe(program => {
        expect(program).toEqual(mockProgram);
        expect(program.programId).toBe(programId);
      });

      const req = httpMock.expectOne(`http://localhost:5000/api/programs/${programId}?tenantId=${tenantId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProgram);
    });
  });

  describe('create', () => {
    it('should create a new program', () => {
      const request: CreateProgramRequest = {
        tenantId,
        businessId,
        programName: 'New Program',
        programType: 'Stamps',
        pointsName: 'Stamps',
        createdBy: '623e4567-e89b-12d3-a456-426614174005'
      };

      service.create(request).subscribe(program => {
        expect(program.programName).toBe(request.programName);
      });

      const req = httpMock.expectOne('http://localhost:5000/api/programs');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(request);
      req.flush({ ...mockProgram, ...request });
    });
  });

  describe('getEarningRules', () => {
    it('should return earning rules for a program', () => {
      const mockRules: EarningRule[] = [mockEarningRule];

      service.getEarningRules(programId, tenantId).subscribe(rules => {
        expect(rules).toEqual(mockRules);
        expect(rules.length).toBe(1);
      });

      const req = httpMock.expectOne(`http://localhost:5000/api/programs/${programId}/earning-rules?tenantId=${tenantId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockRules);
    });
  });

  describe('configureEarningRule', () => {
    it('should configure a new earning rule', () => {
      const request: ConfigureEarningRuleRequest = {
        tenantId,
        ruleType: 'PerVisit',
        pointsAmount: 10,
        effectiveFrom: '2024-01-01T00:00:00Z',
        configuredBy: '623e4567-e89b-12d3-a456-426614174005'
      };

      service.configureEarningRule(programId, request).subscribe(rule => {
        expect(rule.ruleType).toBe(request.ruleType);
      });

      const req = httpMock.expectOne(`http://localhost:5000/api/programs/${programId}/earning-rules`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(request);
      req.flush({ ...mockEarningRule, ...request });
    });
  });
});
