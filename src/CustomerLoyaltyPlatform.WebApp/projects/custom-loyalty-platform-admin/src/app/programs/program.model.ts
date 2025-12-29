export interface LoyaltyProgram {
  programId: string;
  tenantId: string;
  businessId: string;
  programName: string;
  programType: string;
  pointsName: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}

export interface EarningRule {
  earningRuleId: string;
  programId: string;
  tenantId: string;
  ruleType: string;
  pointsAmount: number;
  spendThreshold: number | null;
  applicableCategories: string | null;
  effectiveFrom: string;
  effectiveTo: string | null;
  isActive: boolean;
  configuredBy: string;
  configuredAt: string;
}

export interface CreateProgramRequest {
  tenantId: string;
  businessId: string;
  programName: string;
  programType: string;
  pointsName: string;
  createdBy: string;
}

export interface ConfigureEarningRuleRequest {
  tenantId: string;
  ruleType: string;
  pointsAmount: number;
  spendThreshold?: number;
  applicableCategories?: string;
  effectiveFrom: string;
  effectiveTo?: string;
  configuredBy: string;
}
