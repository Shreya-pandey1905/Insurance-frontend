import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UnderwritingService } from '../../../../core/services/underwriting.service';
import { ProductService } from '../../../../core/services/product.service';
import { InsuranceProduct } from '../../../../shared/models/product.model';

@Component({
  selector: 'app-case-form',
  imports: [FormsModule, CommonModule],
  template: `
    <div class="page-header">
      <div class="page-title">Create Underwriting Case</div>
      <div class="page-subtitle">Link an existing quote to start underwriting</div>
    </div>

    <div *ngIf="errorMsg" class="alert alert-danger">❌ {{ errorMsg }}</div>
    <div class="alert alert-warning" style="font-size: 13px;">
      ℹ️ You must have an existing <strong>Quote</strong> to start underwriting.
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">Case Details</div>
      </div>
      <form (ngSubmit)="save()">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Quote ID *</label>
            <input type="number" class="form-control" [(ngModel)]="quoteId" name="quoteId" placeholder="Enter Quote ID" required>
          </div>
          <div class="form-group">
            <label class="form-label">Customer ID * (from Customer Module)</label>
            <input type="number" class="form-control" [(ngModel)]="customerId" name="customerId" placeholder="e.g. 101" required>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Product *</label>
            <select class="form-control" [(ngModel)]="productId" name="productId" required>
              <option value="">Select Product</option>
              <option *ngFor="let p of products" [value]="p.productId">{{ p.productName }}</option>
            </select>
          </div>
          <div></div>
        </div>
        <div class="flex gap-8 mt-16">
          <button type="submit" class="btn btn-primary btn-lg" [disabled]="saving">{{ saving ? 'Creating...' : '🔍 Create Case' }}</button>
          <button type="button" class="btn btn-secondary" (click)="goBack()">Cancel</button>
        </div>
      </form>
    </div>
  `
})
export class CaseFormComponent implements OnInit {
  quoteId = 0;
  customerId = 0;
  productId = 0;
  products: InsuranceProduct[] = [];
  saving = false;
  errorMsg = '';

  constructor(
    private route: ActivatedRoute,
    private uwService: UnderwritingService,
    private productService: ProductService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // If navigated from Quote Detail with quoteId in query params
    const qId = this.route.snapshot.queryParamMap.get('quoteId');
    if (qId) { this.quoteId = Number(qId); }
    this.productService.getAllProducts().subscribe({
      next: (d) => {
        this.products = d || [];
        this.cdr.markForCheck();
      },
      error: () => {}
    });
  }

  save() {
    this.saving = true;
    this.errorMsg = '';
    this.cdr.markForCheck();
    this.uwService.createCase({ quoteId: this.quoteId, customerId: this.customerId, productId: this.productId }).subscribe({
      next: (saved) => this.router.navigate(['/underwriting', saved.underwritingId]),
      error: (err) => {
        this.errorMsg = err.error?.message || 'Failed to create case.';
        this.saving = false;
        this.cdr.markForCheck();
      }
    });
  }

  goBack() { this.router.navigate(['/underwriting']); }
}
