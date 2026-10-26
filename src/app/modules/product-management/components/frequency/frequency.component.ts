import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../../core/services/product.service';
import { PremiumFrequency } from '../../../../shared/models/product.model';

@Component({
  selector: 'app-frequency',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">Premium Frequencies</h1>
        <p class="page-subtitle">Configure payment frequency schedules and installment counts</p>
      </div>
      <button class="btn btn-primary" (click)="toggleForm()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        {{ showForm ? 'Cancel' : 'Add Frequency' }}
      </button>
    </div>

    <!-- Add/Edit Form -->
    <div *ngIf="showForm" class="card mb-4" style="border-color: var(--primary);">
      <div class="card-header">
        <h3 class="card-title">{{ isEditing ? 'Edit Frequency' : 'New Premium Frequency' }}</h3>
      </div>
      <form (ngSubmit)="saveFrequency()">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Frequency Name *</label>
            <input type="text" class="form-control" [(ngModel)]="currentFreq.frequencyName" name="frequencyName" placeholder="e.g. Annual, Semi-Annual, Quarterly, Monthly" required>
          </div>
          <div class="form-group">
            <label class="form-label">Installment Count (Payments per Year) *</label>
            <input type="number" class="form-control" [(ngModel)]="currentFreq.installmentCount" name="installmentCount" placeholder="e.g. 1, 2, 4, 12" required>
          </div>
          <div class="form-group">
            <label class="form-label">Status</label>
            <select class="form-control" [(ngModel)]="currentFreq.status" name="status">
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
              <th>Frequency Name</th>
              <th>Installments / Year</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let f of frequencies">
              <td>#{{ f.frequencyId }}</td>
              <td><strong>{{ f.frequencyName }}</strong></td>
              <td><span class="badge badge-info">{{ f.installmentCount }}x per year</span></td>
              <td>
                <span class="badge" [ngClass]="f.status === 'Active' ? 'badge-success' : 'badge-danger'">
                  {{ f.status }}
                </span>
              </td>
              <td>
                <button class="btn btn-secondary btn-sm" (click)="editFreq(f)">Edit</button>
              </td>
            </tr>
            <tr *ngIf="frequencies.length === 0 && !loading">
              <td colspan="5" class="text-center py-4 text-muted">No premium frequencies defined yet.</td>
            </tr>
            <tr *ngIf="loading">
              <td colspan="5" class="text-center py-4 text-muted">Loading frequencies...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class FrequencyComponent implements OnInit {
  frequencies: PremiumFrequency[] = [];
  loading = false;
  saving = false;
  showForm = false;
  isEditing = false;
  message = '';
  error = '';

  currentFreq: PremiumFrequency = {
    frequencyName: '',
    installmentCount: 1,
    status: 'Active'
  };

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadFrequencies();
  }

  loadFrequencies() {
    this.loading = true;
    this.cdr.markForCheck();
    this.productService.getAllFrequencies().subscribe({
      next: (data) => {
        this.frequencies = data || [];
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'Failed to load frequencies';
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
    this.currentFreq = {
      frequencyName: '',
      installmentCount: 1,
      status: 'Active'
    };
    this.cdr.markForCheck();
  }

  editFreq(f: PremiumFrequency) {
    this.currentFreq = { ...f };
    this.isEditing = true;
    this.showForm = true;
    this.cdr.markForCheck();
  }

  saveFrequency() {
    this.saving = true;
    this.message = '';
    this.error = '';
    this.cdr.markForCheck();

    if (this.isEditing && this.currentFreq.frequencyId) {
      this.productService.updateFrequency(this.currentFreq.frequencyId, this.currentFreq).subscribe({
        next: () => {
          this.message = 'Frequency updated successfully';
          this.saving = false;
          this.toggleForm();
          this.loadFrequencies();
          this.cdr.markForCheck();
        },
        error: () => {
          this.error = 'Failed to update frequency';
          this.saving = false;
          this.cdr.markForCheck();
        }
      });
    } else {
      this.productService.createFrequency(this.currentFreq).subscribe({
        next: () => {
          this.message = 'Frequency created successfully';
          this.saving = false;
          this.toggleForm();
          this.loadFrequencies();
          this.cdr.markForCheck();
        },
        error: () => {
          this.error = 'Failed to create frequency';
          this.saving = false;
          this.cdr.markForCheck();
        }
      });
    }
  }
}
