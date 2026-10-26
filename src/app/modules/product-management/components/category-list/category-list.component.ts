import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../../core/services/product.service';
import { ProductCategory } from '../../../../shared/models/product.model';

@Component({
  selector: 'app-category-list',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <div class="page-title">Product Categories</div>
      <div class="page-subtitle">Manage insurance product categories</div>
    </div>

    <div *ngIf="successMsg" class="alert alert-success">✅ {{ successMsg }}</div>
    <div *ngIf="errorMsg" class="alert alert-danger">❌ {{ errorMsg }}</div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">{{ editMode ? 'Edit Category' : 'Add New Category' }}</div>
      </div>
      <form (ngSubmit)="save()">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Category Name *</label>
            <input class="form-control" [(ngModel)]="form.categoryName" name="categoryName" placeholder="e.g. Life Insurance" required>
          </div>
          <div class="form-group">
            <label class="form-label">Status</label>
            <select class="form-control" [(ngModel)]="form.status" name="status">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea class="form-control" [(ngModel)]="form.description" name="description" rows="2" placeholder="Category description"></textarea>
        </div>
        <div class="flex gap-8">
          <button type="submit" class="btn btn-primary" [disabled]="saving">{{ saving ? 'Saving...' : (editMode ? '💾 Update' : '➕ Add') }}</button>
          <button type="button" class="btn btn-secondary" *ngIf="editMode" (click)="cancelEdit()">Cancel</button>
        </div>
      </form>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">All Categories</div>
      </div>
      <div *ngIf="loading" class="loading-wrap"><div class="spinner"></div></div>
      <div class="table-wrapper" *ngIf="!loading && categories.length > 0">
        <table>
          <thead><tr><th>ID</th><th>Name</th><th>Description</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            <tr *ngFor="let c of categories">
              <td>{{ c.categoryId }}</td>
              <td><strong>{{ c.categoryName }}</strong></td>
              <td>{{ c.description }}</td>
              <td><span class="badge" [class.badge-success]="c.status === 'Active'" [class.badge-danger]="c.status !== 'Active'">{{ c.status }}</span></td>
              <td><button class="btn btn-sm btn-secondary" (click)="startEdit(c)">Edit</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div *ngIf="!loading && categories.length === 0" class="empty-state"><p>No categories found.</p></div>
    </div>
  `
})
export class CategoryListComponent implements OnInit {
  categories: ProductCategory[] = [];
  form: ProductCategory = { categoryName: '', description: '', status: 'Active' };
  editMode = false;
  editId: number | undefined;
  loading = true;
  saving = false;
  successMsg = '';
  errorMsg = '';

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.cdr.markForCheck();
    this.productService.getAllCategories().subscribe({
      next: (d) => {
        this.categories = d || [];
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  save() {
    this.saving = true;
    this.cdr.markForCheck();
    const obs = this.editMode
      ? this.productService.updateCategory(this.editId!, this.form)
      : this.productService.createCategory(this.form);
    obs.subscribe({
      next: () => {
        this.successMsg = 'Category saved.';
        this.saving = false;
        this.cancelEdit();
        this.load();
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMsg = 'Failed to save.';
        this.saving = false;
        this.cdr.markForCheck();
      }
    });
  }

  startEdit(c: ProductCategory) { this.editMode = true; this.editId = c.categoryId; this.form = { ...c }; this.cdr.markForCheck(); }
  cancelEdit() { this.editMode = false; this.editId = undefined; this.form = { categoryName: '', description: '', status: 'Active' }; this.cdr.markForCheck(); }
}
