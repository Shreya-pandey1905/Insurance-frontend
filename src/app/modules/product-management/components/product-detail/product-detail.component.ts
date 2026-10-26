import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../../core/services/product.service';
import { InsuranceProduct, Coverage, Rider, Benefit, ProductCommission } from '../../../../shared/models/product.model';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-header">
      <div style="display: flex; align-items: center; gap: 12px;">
        <a routerLink="/products" class="btn btn-secondary btn-sm">← Back</a>
        <div>
          <div class="page-title">{{ product?.productName || 'Product Detail' }}</div>
          <div class="page-subtitle">Code: {{ product?.productCode }}</div>
        </div>
      </div>
    </div>

    <div *ngIf="loading" class="loading-wrap">
      <div class="spinner"></div>
      <div class="loading-text">Loading...</div>
    </div>

    <div *ngIf="successMsg" class="alert alert-success">✅ {{ successMsg }}</div>
    <div *ngIf="errorMsg" class="alert alert-danger">❌ {{ errorMsg }}</div>

    <div *ngIf="!loading && product">
      <!-- Product Info -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">Product Information</div>
          <span class="badge" [class.badge-success]="product.status === 'Active'" [class.badge-danger]="product.status !== 'Active'">{{ product.status }}</span>
        </div>
        <div class="detail-grid">
          <div class="detail-item"><div class="detail-label">Product Code</div><div class="detail-value">{{ product.productCode }}</div></div>
          <div class="detail-item"><div class="detail-label">Product Type</div><div class="detail-value">{{ product.productType }}</div></div>
          <div class="detail-item"><div class="detail-label">Rate (%)</div><div class="detail-value">{{ product.productRate }}%</div></div>
          <div class="detail-item"><div class="detail-label">Age Range</div><div class="detail-value">{{ product.minimumAge }} - {{ product.maximumAge }} years</div></div>
          <div class="detail-item"><div class="detail-label">Min Sum Insured</div><div class="detail-value">₹{{ product.minimumSumInsured | number }}</div></div>
          <div class="detail-item"><div class="detail-label">Max Sum Insured</div><div class="detail-value">₹{{ product.maximumSumInsured | number }}</div></div>
          <div class="detail-item" style="grid-column: span 2;"><div class="detail-label">Description</div><div class="detail-value">{{ product.description }}</div></div>
        </div>
      </div>

      <!-- Coverages -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">Coverages</div>
          <button class="btn btn-sm btn-primary" (click)="showCoverageForm = !showCoverageForm">➕ Add Coverage</button>
        </div>
        <div *ngIf="showCoverageForm" style="border: 1px solid var(--border); border-radius: 8px; padding: 16px; margin-bottom: 16px; background: var(--bg-dark);">
          <div class="form-row">
            <div class="form-group mb-0">
              <label class="form-label">Coverage Name</label>
              <input class="form-control" [(ngModel)]="newCoverage.coverageName" placeholder="e.g. Death Benefit">
            </div>
            <div class="form-group mb-0">
              <label class="form-label">Waiting Period (days)</label>
              <input type="number" class="form-control" [(ngModel)]="newCoverage.waitingPeriodDays" placeholder="0">
            </div>
          </div>
          <div class="form-row mt-12">
            <div class="form-group mb-0">
              <label class="form-label">Min Coverage</label>
              <input type="number" class="form-control" [(ngModel)]="newCoverage.minimumCoverage" placeholder="500000">
            </div>
            <div class="form-group mb-0">
              <label class="form-label">Max Coverage</label>
              <input type="number" class="form-control" [(ngModel)]="newCoverage.maximumCoverage" placeholder="10000000">
            </div>
          </div>
          <div class="flex gap-8 mt-12">
            <button class="btn btn-primary btn-sm" (click)="addCoverage()">Save</button>
            <button class="btn btn-secondary btn-sm" (click)="showCoverageForm = false">Cancel</button>
          </div>
        </div>
        <div class="table-wrapper" *ngIf="coverages.length > 0">
          <table>
            <thead><tr><th>Name</th><th>Min Coverage</th><th>Max Coverage</th><th>Waiting Period</th><th>Deductible</th></tr></thead>
            <tbody>
              <tr *ngFor="let c of coverages">
                <td>{{ c.coverageName }}</td>
                <td>₹{{ c.minimumCoverage | number }}</td>
                <td>₹{{ c.maximumCoverage | number }}</td>
                <td>{{ c.waitingPeriodDays }} days</td>
                <td>₹{{ c.deductibleAmount | number }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div *ngIf="coverages.length === 0" class="empty-state" style="padding: 20px;">
          <p>No coverages added yet.</p>
        </div>
      </div>

      <!-- Riders -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">Riders</div>
          <button class="btn btn-sm btn-primary" (click)="showRiderForm = !showRiderForm">➕ Add Rider</button>
        </div>
        <div *ngIf="showRiderForm" style="border: 1px solid var(--border); border-radius: 8px; padding: 16px; margin-bottom: 16px; background: var(--bg-dark);">
          <div class="form-row">
            <div class="form-group mb-0">
              <label class="form-label">Rider Name</label>
              <input class="form-control" [(ngModel)]="newRider.riderName" placeholder="e.g. Accidental Death Rider">
            </div>
            <div class="form-group mb-0">
              <label class="form-label">Rider Premium (₹)</label>
              <input type="number" class="form-control" [(ngModel)]="newRider.riderPremium" placeholder="1500">
            </div>
          </div>
          <div class="form-group mt-12">
            <label class="form-label">Description</label>
            <input class="form-control" [(ngModel)]="newRider.riderDescription" placeholder="Rider description">
          </div>
          <div class="flex gap-8 mt-12">
            <button class="btn btn-primary btn-sm" (click)="addRider()">Save</button>
            <button class="btn btn-secondary btn-sm" (click)="showRiderForm = false">Cancel</button>
          </div>
        </div>
        <div class="table-wrapper" *ngIf="riders.length > 0">
          <table>
            <thead><tr><th>Name</th><th>Description</th><th>Premium</th><th>Status</th></tr></thead>
            <tbody>
              <tr *ngFor="let r of riders">
                <td>{{ r.riderName }}</td>
                <td>{{ r.riderDescription }}</td>
                <td>₹{{ r.riderPremium | number }}</td>
                <td><span class="badge" [class.badge-success]="r.status === 'Active'" [class.badge-danger]="r.status !== 'Active'">{{ r.status }}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div *ngIf="riders.length === 0" class="empty-state" style="padding: 20px;"><p>No riders added yet.</p></div>
      </div>

      <!-- Commission -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">Commission Configuration</div>
        </div>
        <div *ngIf="commission">
          <div class="detail-grid">
            <div class="detail-item"><div class="detail-label">First Year Commission</div><div class="detail-value">{{ commission.firstYearCommission }}%</div></div>
            <div class="detail-item"><div class="detail-label">Renewal Commission</div><div class="detail-value">{{ commission.renewalCommission }}%</div></div>
            <div class="detail-item"><div class="detail-label">Branch Commission</div><div class="detail-value">{{ commission.branchCommission }}%</div></div>
          </div>
        </div>
        <div *ngIf="!commission" style="margin-bottom: 16px;">
          <div class="alert alert-warning" style="margin-bottom: 12px;">⚠️ No commission configured yet</div>
          <div class="form-row">
            <div class="form-group mb-0"><label class="form-label">First Year Commission (%)</label><input type="number" class="form-control" [(ngModel)]="newCommission.firstYearCommission" placeholder="25"></div>
            <div class="form-group mb-0"><label class="form-label">Renewal Commission (%)</label><input type="number" class="form-control" [(ngModel)]="newCommission.renewalCommission" placeholder="5"></div>
          </div>
          <div class="form-row mt-12">
            <div class="form-group mb-0"><label class="form-label">Branch Commission (%)</label><input type="number" class="form-control" [(ngModel)]="newCommission.branchCommission" placeholder="2"></div>
            <div></div>
          </div>
          <button class="btn btn-primary btn-sm mt-12" (click)="saveCommission()">Save Commission</button>
        </div>
      </div>
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  productId!: number;
  product: InsuranceProduct | null = null;
  coverages: Coverage[] = [];
  riders: Rider[] = [];
  benefits: Benefit[] = [];
  commission: ProductCommission | null = null;
  loading = true;
  successMsg = '';
  errorMsg = '';
  showCoverageForm = false;
  showRiderForm = false;

  newCoverage: Coverage = { coverageName: '', minimumCoverage: 0, maximumCoverage: 0, waitingPeriodDays: 0, deductibleAmount: 0 };
  newRider: Rider = { riderName: '', riderDescription: '', riderPremium: 0, status: 'Active' };
  newCommission: ProductCommission = { firstYearCommission: 0, renewalCommission: 0, branchCommission: 0 };

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadAll();
  }

  loadAll() {
    this.loading = true;
    this.cdr.markForCheck();
    this.productService.getProductById(this.productId).subscribe({
      next: (data) => {
        this.product = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMsg = 'Product not found.';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
    this.productService.getCoverages(this.productId).subscribe({
      next: (d) => { this.coverages = d; this.cdr.markForCheck(); },
      error: () => {}
    });
    this.productService.getProductRiders(this.productId).subscribe({
      next: (d) => { this.riders = d; this.cdr.markForCheck(); },
      error: () => {}
    });
    this.productService.getCommission(this.productId).subscribe({
      next: (d) => { this.commission = d; this.cdr.markForCheck(); },
      error: () => {}
    });
  }

  addCoverage() {
    this.productService.addCoverage(this.productId, this.newCoverage).subscribe({
      next: () => {
        this.successMsg = 'Coverage added.';
        this.showCoverageForm = false;
        this.newCoverage = { coverageName: '', minimumCoverage: 0, maximumCoverage: 0, waitingPeriodDays: 0, deductibleAmount: 0 };
        this.cdr.markForCheck();
        this.loadAll();
      },
      error: () => {
        this.errorMsg = 'Failed to add coverage.';
        this.cdr.markForCheck();
      }
    });
  }

  addRider() {
    this.productService.addRider(this.productId, this.newRider).subscribe({
      next: () => {
        this.successMsg = 'Rider added.';
        this.showRiderForm = false;
        this.newRider = { riderName: '', riderDescription: '', riderPremium: 0, status: 'Active' };
        this.cdr.markForCheck();
        this.loadAll();
      },
      error: () => {
        this.errorMsg = 'Failed to add rider.';
        this.cdr.markForCheck();
      }
    });
  }

  saveCommission() {
    this.productService.saveCommission(this.productId, this.newCommission).subscribe({
      next: (d) => {
        this.commission = d;
        this.successMsg = 'Commission saved.';
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMsg = 'Failed to save commission.';
        this.cdr.markForCheck();
      }
    });
  }
}
