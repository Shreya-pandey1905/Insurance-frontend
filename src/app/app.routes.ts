import { Routes } from '@angular/router';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { ProductListComponent } from './modules/product-management/components/product-list/product-list.component';
import { ProductFormComponent } from './modules/product-management/components/product-form/product-form.component';
import { ProductDetailComponent } from './modules/product-management/components/product-detail/product-detail.component';
import { CategoryListComponent } from './modules/product-management/components/category-list/category-list.component';
import { QuoteListComponent } from './modules/quote/components/quote-list/quote-list.component';
import { QuoteFormComponent } from './modules/quote/components/quote-form/quote-form.component';
import { QuoteDetailComponent } from './modules/quote/components/quote-detail/quote-detail.component';
import { CaseListComponent } from './modules/underwriting/components/case-list/case-list.component';
import { CaseFormComponent } from './modules/underwriting/components/case-form/case-form.component';
import { CaseDetailComponent } from './modules/underwriting/components/case-detail/case-detail.component';
import { FrequencyComponent } from './modules/product-management/components/frequency/frequency.component';
import { DiscountListComponent } from './modules/product-management/components/discount-list/discount-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },

  // Product Management
  { path: 'products', component: ProductListComponent },
  { path: 'products/new', component: ProductFormComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'categories', component: CategoryListComponent },
  { path: 'frequencies', component: FrequencyComponent },
  { path: 'discounts', component: DiscountListComponent },

  // Quotes
  { path: 'quotes', component: QuoteListComponent },
  { path: 'quotes/new', component: QuoteFormComponent },
  { path: 'quotes/:id', component: QuoteDetailComponent },

  // Underwriting
  { path: 'underwriting', component: CaseListComponent },
  { path: 'underwriting/new', component: CaseFormComponent },
  { path: 'underwriting/:id', component: CaseDetailComponent },
];
