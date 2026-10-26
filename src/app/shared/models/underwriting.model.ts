// Underwriting Case
export interface UnderwritingCase {
  underwritingId?: number;
  quoteId: number;
  customerId: number;
  productId: number;
  underwritingStatus?: string;
  createdDate?: string;
}

// Medical Details
export interface MedicalDetails {
  medicalId?: number;
  height: number;
  weight: number;
  bmi?: number;
  bloodPressure: string;
  diabetes: boolean;
  heartDisease: boolean;
  cancerHistory: boolean;
  smoking: boolean;
  alcohol: boolean;
  medicalHistory: string;
  medicalReportPath?: string;
}

// Financial Details
export interface FinancialDetails {
  financialId?: number;
  annualIncome: number;
  employerName: string;
  occupation: string;
  existingInsurance: number;
  loanLiability: number;
}

// Risk Score
export interface RiskScore {
  riskScoreId?: number;
  ageScore?: number;
  medicalScore?: number;
  occupationScore?: number;
  lifestyleScore?: number;
  financialScore?: number;
  totalScore?: number;
  riskCategory?: string;
  loadingPercentage?: number;
}

// Underwriting Decision
export interface UnderwritingDecision {
  decisionId?: number;
  underwritingId?: number;
  decision?: string;
  approvedBy?: number;
  remarks?: string;
  rejectionReason?: string;
  decisionDate?: string;
}

// Underwriting Audit Log
export interface UnderwritingAuditLog {
  logId?: number;
  action?: string;
  performedBy?: number;
  remarks?: string;
  performedAt?: string;
}
