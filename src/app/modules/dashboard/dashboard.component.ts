import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { QuoteService } from '../../core/services/quote.service';
import { UnderwritingService } from '../../core/services/underwriting.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, CommonModule],
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">Insurance Management Dashboard</h1>
        <p class="page-subtitle">Overview of Products, Quotes, and Underwriting</p>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">??</div>
        <div>
          <div class="stat-value">{{ productCount }}</div>
          <div class="stat-label">Total Products</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">??</div>
        <div>
          <div class="stat-value">{{ quoteCount }}</div>
          <div class="stat-label">Total Quotes</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">??</div>
        <div>
          <div class="stat-value">{{ uwCount }}</div>
          <div class="stat-label">Underwriting Cases</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">??</div>
        <div>
          <div class="stat-value">{{ categoryCount }}</div>
          <div class="stat-label">Product Categories</div>
        </div>
      </div>
    </div>

    <!-- Quick Navigation -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Quick Actions</h3>
      </div>
      <div style="display: flex; gap: 12px; flex-wrap: wrap;">
        <a routerLink="/products/new" class="btn btn-primary">+ Add New Product</a>
        <a routerLink="/quotes/new" class="btn btn-primary">+ Create Quote</a>
        <a routerLink="/underwriting/new" class="btn btn-secondary">+ Open Underwriting Case</a>
        <a routerLink="/categories" class="btn btn-secondary">Manage Categories</a>
        <a routerLink="/frequencies" class="btn btn-secondary">Manage Frequencies</a>
        <a routerLink="/discounts" class="btn btn-secondary">Manage Discounts</a>
      </div>
    </div>

    <!-- Simple Application Workflow Explanation -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">System Workflow Guide</h3>
      </div>
      <ol style="padding-left: 20px; line-height: 1.8; color: #475569;">
        <li><strong>Product Management:</strong> Create insurance products with categories, coverages, riders, and benefit rules.</li>
        <li><strong>Quote Generation:</strong> Enter customer details and product selection to generate a quote and calculate the premium.</li>
        <li><strong>Underwriting Module:</strong> Review the quote, input medical/financial details, and calculate risk score (Low, Medium, High).</li>
        <li><strong>Decision & Conversion:</strong> Underwriter approves the quote or applies a risk loading, then converts it to an active policy.</li>
      </ol>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  productCount = 0;
  quoteCount = 0;
  uwCount = 0;
  categoryCount = 0;

  constructor(
    private productService: ProductService,
    private quoteService: QuoteService,
    private uwService: UnderwritingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.productCount = Array.isArray(data) ? data.length : 0;
        this.cdr.markForCheck();
      },
      error: () => {
        this.productCount = 0;
        this.cdr.markForCheck();
      }
    });
    this.quoteService.getAllQuotes().subscribe({
      next: (data) => {
        this.quoteCount = Array.isArray(data) ? data.length : 0;
        this.cdr.markForCheck();
      },
      error: () => {
        this.quoteCount = 0;
        this.cdr.markForCheck();
      }
    });
    this.uwService.getAllCases().subscribe({
      next: (data) => {
        this.uwCount = Array.isArray(data) ? data.length : 0;
        this.cdr.markForCheck();
      },
      error: () => {
        this.uwCount = 0;
        this.cdr.markForCheck();
      }
    });
    this.productService.getAllCategories().subscribe({
      next: (data) => {
        this.categoryCount = Array.isArray(data) ? data.length : 0;
        this.cdr.markForCheck();
      },
      error: () => {
        this.categoryCount = 0;
        this.cdr.markForCheck();
      }
    });
  }
}
