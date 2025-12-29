export interface PointsTransaction {
  transactionId: string;
  memberId: string;
  tenantId: string;
  programId: string;
  transactionType: string;
  pointsAmount: number;
  runningBalance: number;
  description: string;
  notes: string | null;
  processedBy: string;
  processedAt: string;
  expiresAt: string | null;
}

export interface PointsBalance {
  memberId: string;
  tenantId: string;
  currentBalance: number;
  lifetimeEarned: number;
  lifetimeRedeemed: number;
  expiringPoints: number;
  expiringDate: string | null;
}

export interface EarnPointsRequest {
  tenantId: string;
  memberId: string;
  programId: string;
  pointsAmount: number;
  earningType: string;
  description: string;
  notes?: string;
  processedBy: string;
  expiresAt?: string;
}

export interface RedeemPointsRequest {
  tenantId: string;
  memberId: string;
  programId: string;
  pointsAmount: number;
  rewardId?: string;
  description: string;
  notes?: string;
  processedBy: string;
}
