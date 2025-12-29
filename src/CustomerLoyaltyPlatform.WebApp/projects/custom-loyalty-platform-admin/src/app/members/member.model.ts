export interface Member {
  memberId: string;
  tenantId: string;
  programId: string;
  businessId: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string;
  enrollmentSource: string;
  referredByMemberId: string | null;
  status: string;
  pointsBalance: number;
  lifetimePoints: number;
  enrolledAt: string;
  lastActivityAt: string | null;
}

export interface EnrollMemberRequest {
  tenantId: string;
  programId: string;
  businessId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  enrollmentSource: string;
  referredByMemberId?: string;
  enrolledBy?: string;
}

export interface UpdateMemberRequest {
  tenantId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
}
