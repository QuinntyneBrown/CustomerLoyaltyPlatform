export interface Tenant {
  tenantId: string;
  tenantName: string;
  tenantSlug: string;
  primaryContactEmail: string;
  primaryContactName: string;
  planType: string;
  dataRegion: string;
  isolationLevel: string;
  status: string;
  provisionedAt: string;
  activatedAt: string | null;
}

export interface CreateTenantRequest {
  tenantName: string;
  tenantSlug: string;
  primaryContactEmail: string;
  primaryContactName: string;
  planType?: string;
  dataRegion?: string;
}
