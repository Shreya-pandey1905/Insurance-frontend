import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuoteService } from '../../../../core/services/quote.service';
import { Quote } from '../../../../shared/models/quote.model';

@Component({
  selector: 'app-quote-list',
  imports: [RouterLink, CommonModule],
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">Insurance Quotes</h1>
        <p class="page-subtitle">Track and manage insurance quotation records</p>
      </div>
      <a routerLink="/quotes/new" class="btn btn-primary">+ Generate Quote</a>
    </div>

    <div *ngIf="successMsg" class="alert alert-success">{{ successMsg }}</div>
    <div *ngIf="errorMsg" class="alert alert-danger">{{ errorMsg }}</div>

    <div class="card">
      <div *ngIf="loading" class="loading-wrap">
        <div class="spinner"></div>
        <div>Loading quotes...</div>
      </div>

      <div *ngIf="!loading && quotes.length === 0" class="empty-state">
        <p>No quotes found. Generate a quote to see it here.</p>
        <div style="margin-top: 12px;">
          <a routerLink="/quotes/new" class="btn btn-primary btn-sm">+ Generate Quote</a>
        </div>
      </div>

      <div *ngIf="!loading && quotes.length > 0" class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer ID</th>
              <th>Product ID</th>
              <th>Sum Insured</th>
              <th>Policy Term</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let q of quotes">
              <td>#{{ q.quoteId }}</td>
              <td>{{ q.customerId }}</td>
              <td>#{{ q.productId }}</td>
              <td>{{ q.sumInsured | number }}</td>
              <td>{{ q.policyTerm }} yrs</td>
              <td>
                <span class="badge"
                  [ngClass]="{
                    'badge-warning': q.quoteStatus === 'Draft',
                    'badge-info': q.quoteStatus === 'Pending' || q.quoteStatus === 'Underwriting',
                    'badge-success': q.quoteStatus === 'Approved',
                    'badge-danger': q.quoteStatus === 'Rejected'
                  }">
                  {{ q.quoteStatus }}
                </span>
              </td>
              <td>{{ q.quoteDate | date:'shortDate' }}</td>
              <td>
                <div style="display: flex; gap: 6px;">
                  <a [routerLink]="['/quotes', q.quoteId]" class="btn btn-secondary btn-sm">Details</a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class QuoteListComponent implements OnInit {
  quotes: Quote[] = [];
  loading = false;
  successMsg = '';
  errorMsg = '';

  constructor(
    private quoteService: QuoteService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadQuotes();
  }

  loadQuotes() {
    this.loading = true;
    this.errorMsg = '';
    this.cdr.markForCheck();
    this.quoteService.getAllQuotes().subscribe({
      next: (data) => {
        this.quotes = Array.isArray(data) ? data : [];
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMsg = 'Failed to load quotes from server.';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }
}
