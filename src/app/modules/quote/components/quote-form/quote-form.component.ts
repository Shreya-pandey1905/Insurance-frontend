import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuoteService } from '../../../../core/services/quote.service';
import { ProductService } from '../../../../core/services/product.service';
import { Quote } from '../../../../shared/models/quote.model';
import { InsuranceProduct, PremiumFrequency } from '../../../../shared/models/product.model';

@Component({
  selector: 'app-quote-form',
  imports: [FormsModule, CommonModule],
  template: `
    <div class="page-header">
      <div class="page-title">Generate New Quote</div>
      <div class="page-subtitle">Fill in customer and product details to generate a quote</div>
    </div>

    <div *ngIf="errorMsg" class="alert alert-danger">❌ {{ errorMsg }}</div>
    <div class="alert alert-warning" style="font-size: 13px;">
      ℹ️ <strong>Customer ID</strong> is provided by the Customer module (other team). Enter the customer ID directly.
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">Quote Details</div>
      </div>
      <form (ngSubmit)="save()">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Customer ID * (from Customer Module)</label>
            <input type="number" class="form-control" [(ngModel)]="quote.customerId" name="customerId" placeholder="e.g. 101" required>
          </div>
          <div class="form-group">
            <label class="form-label">Product *</label>
            <select class="form-control" [(ngModel)]="quote.productId" name="productId" required>
              <option value="">Select Product</option>
              <option *ngFor="let p of products" [value]="p.productId">{{ p.productName }} ({{ p.productCode }})</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Sum Insured (₹) *</label>
            <input type="number" class="form-control" [(ngModel)]="quote.sumInsured" name="sumInsured" placeholder="e.g. 1000000" required>
          </div>
          <div class="form-group">
            <label class="form-label">Policy Term (years) *</label>
            <input type="number" class="form-control" [(ngModel)]="quote.policyTerm" name="policyTerm" placeholder="e.g. 20" required>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Premium Frequency *</label>
            <select class="form-control" [(ngModel)]="quote.premiumFrequencyId" name="premiumFrequencyId" required>
              <option value="">Select Frequency</option>
              <option *ngFor="let f of frequencies" [value]="f.frequencyId">{{ f.frequencyName }} ({{ f.installmentCount }}x/year)</option>
            </select>
          </div>
          <div></div>
        </div>
        <div class="flex gap-8 mt-16">
          <button type="submit" class="btn btn-primary btn-lg" [disabled]="saving">{{ saving ? 'Creating...' : '📋 Generate Quote' }}</button>
          <button type="button" class="btn btn-secondary" (click)="goBack()">Cancel</button>
        </div>
      </form>
    </div>
  `
})
export class QuoteFormComponent implements OnInit {
  products: InsuranceProduct[] = [];
  frequencies: PremiumFrequency[] = [];
  saving = false;
  errorMsg = '';

  quote: Quote = {
    customerId: 0,
    productId: 0,
    policyTerm: 20,
    sumInsured: 1000000,
    premiumFrequencyId: 0
  };

  constructor(
    private quoteService: QuoteService,
    private productService: ProductService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.productService.getAllProducts().subscribe({
      next: (d) => {
        this.products = (d || []).filter(p => p.status === 'Active');
        this.cdr.markForCheck();
      },
      error: () => {}
    });
    this.productService.getAllFrequencies().subscribe({
      next: (d) => {
        this.frequencies = (d || []).filter(f => f.status === 'Active');
        this.cdr.markForCheck();
      },
      error: () => {}
    });
  }

  save() {
    this.saving = true;
    this.errorMsg = '';
    this.cdr.markForCheck();
    this.quoteService.createQuote(this.quote).subscribe({
      next: (saved) => this.router.navigate(['/quotes', saved.quoteId]),
      error: (err) => {
        this.errorMsg = err.error?.message || 'Failed to generate quote.';
        this.saving = false;
        this.cdr.markForCheck();
      }
    });
  }

  goBack() { this.router.navigate(['/quotes']); }
}
