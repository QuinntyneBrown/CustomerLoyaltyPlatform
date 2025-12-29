export interface TenantUser {
  tenantUserId: string;
  tenantId: string;
  userId: string;
  email: string;
  displayName: string;
  role: string;
  joinedAt: string;
  lastLoginAt: string | null;
  isActive: boolean;
}

export interface TenantInvitation {
  invitationId: string;
  tenantId: string;
  email: string;
  role: string;
  token: string;
  invitedBy: string;
  invitedAt: string;
  expiresAt: string;
  acceptedAt: string | null;
}

export interface InviteUserRequest {
  email: string;
  role: string;
  invitedBy: string;
}
