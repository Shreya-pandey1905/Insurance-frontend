// Quote
export interface Quote {
  quoteId?: number;
  customerId: number;
  productId: number;
  policyTerm: number;
  sumInsured: number;
  premiumFrequencyId: number;
  quoteStatus?: string;
  quoteDate?: string;
}

// Premium
export interface Premium {
  premiumId?: number;
  quoteId?: number;
  basePremium?: number;
  riskLoadingAmount?: number;
  riderPremium?: number;
  discountAmount?: number;
  finalPremium?: number;
  riskLoadingPercentage?: number;
}

// Quote History
export interface QuoteHistory {
  historyId?: number;
  quoteId?: number;
  changedBy?: string;
  changeDescription?: string;
  changedAt?: string;
}
