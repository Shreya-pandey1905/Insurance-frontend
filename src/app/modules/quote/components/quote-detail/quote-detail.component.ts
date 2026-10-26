import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuoteService } from '../../../../core/services/quote.service';
import { Quote, Premium, QuoteHistory } from '../../../../shared/models/quote.model';

@Component({
  selector: 'app-quote-detail',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-header">
      <div style="display: flex; align-items: center; gap: 12px;">
        <a routerLink="/quotes" class="btn btn-secondary btn-sm">← Back</a>
        <div>
          <div class="page-title">Quote #{{ quoteId }}</div>
          <div class="page-subtitle">Customer ID: {{ quote?.customerId }}</div>
        </div>
      </div>
    </div>

    <div *ngIf="loading" class="loading-wrap"><div class="spinner"></div><div class="loading-text">Loading...</div></div>
    <div *ngIf="successMsg" class="alert alert-success">✅ {{ successMsg }}</div>
    <div *ngIf="errorMsg" class="alert alert-danger">❌ {{ errorMsg }}</div>

    <div *ngIf="!loading && quote">
      <!-- Quote Info -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">Quote Details</div>
          <div style="display: flex; gap: 8px; align-items: center;">
            <span class="badge"
              [class.badge-warning]="quote.quoteStatus === 'Draft'"
              [class.badge-info]="quote.quoteStatus === 'Pending'"
              [class.badge-success]="quote.quoteStatus === 'Approved'"
              [class.badge-danger]="quote.quoteStatus === 'Rejected'"
              [class.badge-primary]="quote.quoteStatus === 'Converted'">
              {{ quote.quoteStatus }}
            </span>
          </div>
        </div>
        <div class="detail-grid">
          <div class="detail-item"><div class="detail-label">Customer ID</div><div class="detail-value">{{ quote.customerId }}</div></div>
          <div class="detail-item"><div class="detail-label">Product ID</div><div class="detail-value">{{ quote.productId }}</div></div>
          <div class="detail-item"><div class="detail-label">Sum Insured</div><div class="detail-value">₹{{ quote.sumInsured | number }}</div></div>
          <div class="detail-item"><div class="detail-label">Policy Term</div><div class="detail-value">{{ quote.policyTerm }} years</div></div>
          <div class="detail-item"><div class="detail-label">Frequency ID</div><div class="detail-value">{{ quote.premiumFrequencyId }}</div></div>
          <div class="detail-item"><div class="detail-label">Quote Date</div><div class="detail-value">{{ quote.quoteDate | date:'dd-MM-yyyy' }}</div></div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-8 mt-16">
          <button class="btn btn-primary" (click)="calculatePremium()" [disabled]="processing">💰 Calculate Premium</button>
          <button class="btn btn-success" *ngIf="quote.quoteStatus === 'Pending' || quote.quoteStatus === 'Draft'" (click)="approve()" [disabled]="processing">✅ Approve</button>
          <button class="btn btn-danger" *ngIf="quote.quoteStatus !== 'Approved' && quote.quoteStatus !== 'Converted' && quote.quoteStatus !== 'Cancelled'" (click)="reject()" [disabled]="processing">❌ Reject</button>
          <button class="btn btn-warning" *ngIf="quote.quoteStatus === 'Approved'" (click)="convert()" [disabled]="processing">🔄 Convert to Policy</button>
          <a [routerLink]="['/underwriting/new']" [queryParams]="{ quoteId: quoteId }" class="btn btn-secondary">🔍 Start Underwriting</a>
        </div>
      </div>

      <!-- Premium -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">Premium Breakdown</div>
          <button class="btn btn-sm btn-primary" (click)="loadPremium()">🔄 Refresh</button>
        </div>
        <div *ngIf="premium">
          <div class="detail-grid">
            <div class="detail-item"><div class="detail-label">Base Premium</div><div class="detail-value">₹{{ premium.basePremium | number:'1.2-2' }}</div></div>
            <div class="detail-item"><div class="detail-label">Risk Loading %</div><div class="detail-value">{{ premium.riskLoadingPercentage }}%</div></div>
            <div class="detail-item"><div class="detail-label">Risk Loading Amount</div><div class="detail-value">₹{{ premium.riskLoadingAmount | number:'1.2-2' }}</div></div>
            <div class="detail-item"><div class="detail-label">Rider Premium</div><div class="detail-value">₹{{ premium.riderPremium | number:'1.2-2' }}</div></div>
            <div class="detail-item"><div class="detail-label">Discount</div><div class="detail-value text-success">- ₹{{ premium.discountAmount | number:'1.2-2' }}</div></div>
            <div class="detail-item">
              <div class="detail-label">Final Premium</div>
              <div class="detail-value" style="font-size: 20px; font-weight: 700; color: var(--primary-light);">₹{{ premium.finalPremium | number:'1.2-2' }}</div>
            </div>
          </div>
        </div>
        <div *ngIf="!premium" class="empty-state" style="padding: 20px;">
          <p>No premium calculated yet. Click "Calculate Premium" above.</p>
        </div>
      </div>

      <!-- History -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">Quote History (Audit Trail)</div>
        </div>
        <div class="table-wrapper" *ngIf="history.length > 0">
          <table>
            <thead><tr><th>Date</th><th>Changed By</th><th>Description</th></tr></thead>
            <tbody>
              <tr *ngFor="let h of history">
                <td>{{ h.changedAt | date:'dd-MM-yyyy HH:mm' }}</td>
                <td>{{ h.changedBy }}</td>
                <td>{{ h.changeDescription }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div *ngIf="history.length === 0" class="empty-state" style="padding: 20px;"><p>No history records yet.</p></div>
      </div>
    </div>
  `
})
export class QuoteDetailComponent implements OnInit {
  quoteId!: number;
  quote: Quote | null = null;
  premium: Premium | null = null;
  history: QuoteHistory[] = [];
  loading = true;
  processing = false;
  successMsg = '';
  errorMsg = '';

  constructor(private route: ActivatedRoute, private quoteService: QuoteService, private router: Router) {}

  ngOnInit() {
    this.quoteId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadAll();
  }

  loadAll() {
    this.loading = true;
    this.quoteService.getQuoteById(this.quoteId).subscribe({
      next: (d) => { this.quote = d; this.loading = false; },
      error: () => { this.errorMsg = 'Quote not found.'; this.loading = false; }
    });
    this.loadPremium();
    this.loadHistory();
  }

  loadPremium() {
    this.quoteService.getPremium(this.quoteId).subscribe({ next: (d) => this.premium = d, error: () => {} });
  }

  loadHistory() {
    this.quoteService.getQuoteHistory(this.quoteId).subscribe({ next: (d) => this.history = d, error: () => {} });
  }

  calculatePremium() {
    this.processing = true;
    this.quoteService.calculatePremium(this.quoteId).subscribe({
      next: (d) => { this.premium = d; this.successMsg = 'Premium calculated!'; this.processing = false; this.loadHistory(); },
      error: () => { this.errorMsg = 'Failed to calculate premium.'; this.processing = false; }
    });
  }

  approve() {
    this.processing = true;
    this.quoteService.approveQuote(this.quoteId).subscribe({
      next: () => { this.successMsg = 'Quote Approved!'; this.processing = false; this.loadAll(); },
      error: () => { this.errorMsg = 'Failed to approve.'; this.processing = false; }
    });
  }

  reject() {
    if (confirm('Are you sure you want to reject this quote?')) {
      this.processing = true;
      this.quoteService.rejectQuote(this.quoteId).subscribe({
        next: () => { this.successMsg = 'Quote Rejected.'; this.processing = false; this.loadAll(); },
        error: () => { this.errorMsg = 'Failed to reject.'; this.processing = false; }
      });
    }
  }

  convert() {
    if (confirm('Convert this quote to a Policy?')) {
      this.processing = true;
      this.quoteService.convertQuote(this.quoteId).subscribe({
        next: () => { this.successMsg = 'Quote converted to Policy!'; this.processing = false; this.loadAll(); },
        error: () => { this.errorMsg = 'Failed to convert.'; this.processing = false; }
      });
    }
  }
}
