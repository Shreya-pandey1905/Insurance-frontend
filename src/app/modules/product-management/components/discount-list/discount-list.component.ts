import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../../core/services/product.service';
import { Discount } from '../../../../shared/models/product.model';

@Component({
  selector: 'app-discount-list',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">Discount Rules</h1>
        <p class="page-subtitle">Manage promotional, lifestyle, and volume premium discounts</p>
      </div>
      <button class="btn btn-primary" (click)="toggleForm()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        {{ showForm ? 'Cancel' : 'Add Discount' }}
      </button>
    </div>

    <!-- Form -->
    <div *ngIf="showForm" class="card mb-4" style="border-color: var(--primary);">
      <div class="card-header">
        <h3 class="card-title">{{ isEditing ? 'Edit Discount' : 'New Discount Rule' }}</h3>
      </div>
      <form (ngSubmit)="saveDiscount()">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Discount Name *</label>
            <input type="text" class="form-control" [(ngModel)]="currentDisc.discountName" name="discountName" placeholder="e.g. Non-Smoker Discount, Online Discount" required>
          </div>
          <div class="form-group">
            <label class="form-label">Discount Percentage (%) *</label>
            <input type="number" step="0.01" class="form-control" [(ngModel)]="currentDisc.discountPercentage" name="discountPercentage" placeholder="e.g. 10.0" required>
          </div>
          <div class="form-group">
            <label class="form-label">Valid From</label>
            <input type="date" class="form-control" [(ngModel)]="currentDisc.validFrom" name="validFrom">
          </div>
          <div class="form-group">
            <label class="form-label">Valid To</label>
            <input type="date" class="form-control" [(ngModel)]="currentDisc.validTo" name="validTo">
          </div>
          <div class="form-group">
            <label class="form-label">Status</label>
            <select class="form-control" [(ngModel)]="currentDisc.status" name="status">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div class="d-flex justify-content-end gap-2 mt-4">
          <button type="button" class="btn btn-secondary" (click)="toggleForm()">Cancel</button>
          <button type="submit" class="btn btn-primary" [disabled]="saving">
            {{ saving ? 'Saving...' : (isEditing ? 'Update' : 'Create') }}
          </button>
        </div>
      </form>
    </div>

    <div *ngIf="message" class="alert alert-success">{{ message }}</div>
    <div *ngIf="error" class="alert alert-danger">{{ error }}</div>

    <!-- Table -->
    <div class="card">
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Discount Name</th>
              <th>Percentage</th>
              <th>Valid Period</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let d of discounts">
              <td>#{{ d.discountId }}</td>
              <td><strong>{{ d.discountName }}</strong></td>
              <td><span class="badge badge-success">{{ d.discountPercentage }}%</span></td>
              <td>
                <span class="text-xs text-muted" *ngIf="d.validFrom || d.validTo">
                  {{ d.validFrom || 'Open' }} ~ {{ d.validTo || 'Open' }}
                </span>
                <span class="text-xs text-muted" *ngIf="!d.validFrom && !d.validTo">Ongoing</span>
              </td>
              <td>
                <span class="badge" [ngClass]="d.status === 'Active' ? 'badge-success' : 'badge-danger'">
                  {{ d.status }}
                </span>
              </td>
              <td>
                <button class="btn btn-secondary btn-sm" (click)="editDisc(d)">Edit</button>
              </td>
            </tr>
            <tr *ngIf="discounts.length === 0 && !loading">
              <td colspan="6" class="text-center py-4 text-muted">No discounts defined yet.</td>
            </tr>
            <tr *ngIf="loading">
              <td colspan="6" class="text-center py-4 text-muted">Loading discounts...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class DiscountListComponent implements OnInit {
  discounts: Discount[] = [];
  loading = false;
  saving = false;
  showForm = false;
  isEditing = false;
  message = '';
  error = '';

  currentDisc: Discount = {
    discountName: '',
    discountPercentage: 0,
    validFrom: '',
    validTo: '',
    status: 'Active'
  };

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadDiscounts();
  }

  loadDiscounts() {
    this.loading = true;
    this.cdr.markForCheck();
    this.productService.getAllDiscounts().subscribe({
      next: (data) => {
        this.discounts = data || [];
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'Failed to load discounts';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
    this.cdr.markForCheck();
  }

  resetForm() {
    this.isEditing = false;
    this.currentDisc = {
      discountName: '',
      discountPercentage: 0,
      validFrom: '',
      validTo: '',
      status: 'Active'
    };
    this.cdr.markForCheck();
  }

  editDisc(d: Discount) {
    this.currentDisc = { ...d };
    this.isEditing = true;
    this.showForm = true;
    this.cdr.markForCheck();
  }

  saveDiscount() {
    this.saving = true;
    this.message = '';
    this.error = '';
    this.cdr.markForCheck();

    if (this.isEditing && this.currentDisc.discountId) {
      this.productService.updateDiscount(this.currentDisc.discountId, this.currentDisc).subscribe({
        next: () => {
          this.message = 'Discount updated successfully';
          this.saving = false;
          this.toggleForm();
          this.loadDiscounts();
          this.cdr.markForCheck();
        },
        error: () => {
          this.error = 'Failed to update discount';
          this.saving = false;
          this.cdr.markForCheck();
        }
      });
    } else {
      this.productService.createDiscount(this.currentDisc).subscribe({
        next: () => {
          this.message = 'Discount created successfully';
          this.saving = false;
          this.toggleForm();
          this.loadDiscounts();
          this.cdr.markForCheck();
        },
        error: () => {
          this.error = 'Failed to create discount';
          this.saving = false;
          this.cdr.markForCheck();
        }
      });
    }
  }
}
