import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../../core/services/product.service';
import { InsuranceProduct } from '../../../../shared/models/product.model';

@Component({
  selector: 'app-product-list',
  imports: [RouterLink, CommonModule],
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">Insurance Products</h1>
        <p class="page-subtitle">View and configure available insurance products</p>
      </div>
      <a routerLink="/products/new" class="btn btn-primary">+ Add Product</a>
    </div>

    <div *ngIf="successMsg" class="alert alert-success">{{ successMsg }}</div>
    <div *ngIf="errorMsg" class="alert alert-danger">{{ errorMsg }}</div>

    <div class="card">
      <div *ngIf="loading" class="loading-wrap">
        <div class="spinner"></div>
        <div>Loading products...</div>
      </div>

      <div *ngIf="!loading && products.length === 0" class="empty-state">
        <p>No products found. Add your first product to get started.</p>
        <div style="margin-top: 12px;">
          <a routerLink="/products/new" class="btn btn-primary btn-sm">+ Add Product</a>
        </div>
      </div>

      <div *ngIf="!loading && products.length > 0" class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Code</th>
              <th>Product Name</th>
              <th>Type</th>
              <th>Rate (%)</th>
              <th>Min Sum</th>
              <th>Max Sum</th>
              <th>Age</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of products">
              <td>#{{ p.productId }}</td>
              <td><strong>{{ p.productCode }}</strong></td>
              <td>{{ p.productName }}</td>
              <td><span class="badge badge-info">{{ p.productType }}</span></td>
              <td>{{ p.productRate }}%</td>
              <td>{{ p.minimumSumInsured | number }}</td>
              <td>{{ p.maximumSumInsured | number }}</td>
              <td>{{ p.minimumAge }} - {{ p.maximumAge }}</td>
              <td>
                <span class="badge" [ngClass]="p.status === 'Active' ? 'badge-success' : 'badge-danger'">
                  {{ p.status }}
                </span>
              </td>
              <td>
                <div style="display: flex; gap: 6px;">
                  <a [routerLink]="['/products', p.productId]" class="btn btn-secondary btn-sm">View</a>
                  <button *ngIf="p.status === 'Active'" (click)="deactivate(p.productId!)" class="btn btn-danger btn-sm">Deactivate</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class ProductListComponent implements OnInit {
  products: InsuranceProduct[] = [];
  loading = false;
  successMsg = '';
  errorMsg = '';

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.errorMsg = '';
    this.cdr.markForCheck();
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = Array.isArray(data) ? data : [];
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMsg = 'Failed to load products from server.';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  deactivate(id: number) {
    if (confirm('Deactivate this product?')) {
      this.productService.deactivateProduct(id).subscribe({
        next: () => {
          this.successMsg = 'Product deactivated successfully.';
          this.cdr.markForCheck();
          this.loadProducts();
        },
        error: () => {
          this.errorMsg = 'Failed to deactivate product.';
          this.cdr.markForCheck();
        }
      });
    }
  }
}
