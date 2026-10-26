// Product Category
export interface ProductCategory {
  categoryId?: number;
  categoryName: string;
  description: string;
  status: string;
}

// Insurance Product
export interface InsuranceProduct {
  productId?: number;
  category: { categoryId: number };
  productCode: string;
  productName: string;
  productType: string;
  description: string;
  minimumAge: number;
  maximumAge: number;
  minimumSumInsured: number;
  maximumSumInsured: number;
  productRate: number;
  status: string;
}

// Coverage
export interface Coverage {
  coverageId?: number;
  coverageName: string;
  minimumCoverage: number;
  maximumCoverage: number;
  waitingPeriodDays: number;
  deductibleAmount: number;
}

// Rider
export interface Rider {
  riderId?: number;
  riderName: string;
  riderDescription: string;
  riderPremium: number;
  status: string;
}

// Benefit
export interface Benefit {
  benefitId?: number;
  benefitName: string;
  benefitDescription: string;
  benefitLimit: number;
}

// Product Commission
export interface ProductCommission {
  commissionId?: number;
  firstYearCommission: number;
  renewalCommission: number;
  branchCommission: number;
}

// Premium Frequency
export interface PremiumFrequency {
  frequencyId?: number;
  frequencyName: string;
  installmentCount: number;
  status: string;
}

// Discount
export interface Discount {
  discountId?: number;
  discountName: string;
  discountPercentage: number;
  validFrom: string;
  validTo: string;
  status: string;
}
