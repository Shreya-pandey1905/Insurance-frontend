import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../../core/services/product.service';
import { ProductCategory, InsuranceProduct } from '../../../../shared/models/product.model';

@Component({
  selector: 'app-product-form',
  imports: [FormsModule, CommonModule],
  template: `
    <div class="page-header">
      <div class="page-title">Create New Product</div>
      <div class="page-subtitle">Fill in the details to create a new insurance product</div>
    </div>

    <div *ngIf="errorMsg" class="alert alert-danger">❌ {{ errorMsg }}</div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">Product Details</div>
      </div>

      <form (ngSubmit)="save()">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Product Code *</label>
            <input class="form-control" [(ngModel)]="product.productCode" name="productCode" placeholder="e.g. LIFE-TERM-001" required>
          </div>
          <div class="form-group">
            <label class="form-label">Product Name *</label>
            <input class="form-control" [(ngModel)]="product.productName" name="productName" placeholder="e.g. Pure Term Life Plan" required>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Category *</label>
            <select class="form-control" [(ngModel)]="product.category.categoryId" name="categoryId" required>
              <option value="">Select Category</option>
              <option *ngFor="let c of categories" [value]="c.categoryId">{{ c.categoryName }}</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Product Type *</label>
            <select class="form-control" [(ngModel)]="product.productType" name="productType" required>
              <option value="">Select Type</option>
              <option value="Term">Term</option>
              <option value="Whole Life">Whole Life</option>
              <option value="ULIP">ULIP</option>
              <option value="Health">Health</option>
              <option value="Vehicle">Vehicle</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea class="form-control" [(ngModel)]="product.description" name="description" rows="3" placeholder="Product description..."></textarea>
        </div>

        <div class="form-row-3">
          <div class="form-group">
            <label class="form-label">Product Rate (%) *</label>
            <input type="number" class="form-control" [(ngModel)]="product.productRate" name="productRate" placeholder="e.g. 2.50" step="0.01" required>
          </div>
          <div class="form-group">
            <label class="form-label">Min Age *</label>
            <input type="number" class="form-control" [(ngModel)]="product.minimumAge" name="minimumAge" placeholder="18" required>
          </div>
          <div class="form-group">
            <label class="form-label">Max Age *</label>
            <input type="number" class="form-control" [(ngModel)]="product.maximumAge" name="maximumAge" placeholder="65" required>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Min Sum Insured *</label>
            <input type="number" class="form-control" [(ngModel)]="product.minimumSumInsured" name="minimumSumInsured" placeholder="500000" required>
          </div>
          <div class="form-group">
            <label class="form-label">Max Sum Insured *</label>
            <input type="number" class="form-control" [(ngModel)]="product.maximumSumInsured" name="maximumSumInsured" placeholder="10000000" required>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Status</label>
          <select class="form-control" [(ngModel)]="product.status" name="status">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div class="flex gap-8 mt-16">
          <button type="submit" class="btn btn-primary btn-lg" [disabled]="saving">
            {{ saving ? 'Saving...' : '💾 Save Product' }}
          </button>
          <button type="button" class="btn btn-secondary" (click)="goBack()">Cancel</button>
        </div>
      </form>
    </div>
  `
})
export class ProductFormComponent implements OnInit {
  categories: ProductCategory[] = [];
  saving = false;
  errorMsg = '';

  product: InsuranceProduct = {
    category: { categoryId: 0 },
    productCode: '',
    productName: '',
    productType: '',
    description: '',
    minimumAge: 18,
    maximumAge: 65,
    minimumSumInsured: 500000,
    maximumSumInsured: 10000000,
    productRate: 2.5,
    status: 'Active'
  };

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit() {
    this.productService.getAllCategories().subscribe({
      next: (data) => this.categories = data,
      error: () => this.errorMsg = 'Failed to load categories.'
    });
  }

  save() {
    this.saving = true;
    this.errorMsg = '';
    this.productService.createProduct(this.product).subscribe({
      next: (saved) => this.router.navigate(['/products', saved.productId]),
      error: (err) => { this.errorMsg = err.error?.message || 'Failed to save product.'; this.saving = false; }
    });
  }

  goBack() { this.router.navigate(['/products']); }
}
