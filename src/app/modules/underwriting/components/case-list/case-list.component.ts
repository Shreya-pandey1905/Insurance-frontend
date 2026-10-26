import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UnderwritingService } from '../../../../core/services/underwriting.service';
import { UnderwritingCase } from '../../../../shared/models/underwriting.model';

@Component({
  selector: 'app-case-list',
  imports: [RouterLink, CommonModule],
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">Underwriting Cases</h1>
        <p class="page-subtitle">Assess risks and make underwriting decisions</p>
      </div>
      <a routerLink="/underwriting/new" class="btn btn-primary">+ Open Case</a>
    </div>

    <div *ngIf="errorMsg" class="alert alert-danger">{{ errorMsg }}</div>

    <div class="card">
      <div *ngIf="loading" class="loading-wrap">
        <div class="spinner"></div>
        <div>Loading underwriting cases...</div>
      </div>

      <div *ngIf="!loading && cases.length === 0" class="empty-state">
        <p>No underwriting cases found.</p>
        <div style="margin-top: 12px;">
          <a routerLink="/underwriting/new" class="btn btn-primary btn-sm">+ Open Case</a>
        </div>
      </div>

      <div *ngIf="!loading && cases.length > 0" class="table-container">
        <table>
          <thead>
            <tr>
              <th>Case ID</th>
              <th>Quote ID</th>
              <th>Customer ID</th>
              <th>Product ID</th>
              <th>Status</th>
              <th>Created Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let c of cases">
              <td>#{{ c.underwritingId }}</td>
              <td>#{{ c.quoteId }}</td>
              <td>{{ c.customerId }}</td>
              <td>#{{ c.productId }}</td>
              <td>
                <span class="badge"
                  [ngClass]="{
                    'badge-warning': c.underwritingStatus === 'Pending' || c.underwritingStatus === 'In Review',
                    'badge-success': c.underwritingStatus === 'Approved',
                    'badge-danger': c.underwritingStatus === 'Rejected'
                  }">
                  {{ c.underwritingStatus || 'Pending' }}
                </span>
              </td>
              <td>{{ c.createdDate | date:'shortDate' }}</td>
              <td>
                <a [routerLink]="['/underwriting', c.underwritingId]" class="btn btn-secondary btn-sm">Process Case</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class CaseListComponent implements OnInit {
  cases: UnderwritingCase[] = [];
  loading = false;
  errorMsg = '';

  constructor(
    private uwService: UnderwritingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadCases();
  }

  loadCases() {
    this.loading = true;
    this.errorMsg = '';
    this.cdr.markForCheck();
    this.uwService.getAllCases().subscribe({
      next: (data) => {
        this.cases = Array.isArray(data) ? data : [];
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMsg = 'Failed to load underwriting cases from server.';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }
}
