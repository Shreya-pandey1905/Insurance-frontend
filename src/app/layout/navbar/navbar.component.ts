import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <a class="navbar-brand" routerLink="/dashboard">
        🛡️ Insurance Management
      </a>
      <div class="nav-links">
        <a class="nav-link" routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
        <a class="nav-link" routerLink="/products" routerLinkActive="active">Products</a>
        <a class="nav-link" routerLink="/categories" routerLinkActive="active">Categories</a>
        <a class="nav-link" routerLink="/frequencies" routerLinkActive="active">Frequencies</a>
        <a class="nav-link" routerLink="/discounts" routerLinkActive="active">Discounts</a>
        <a class="nav-link" routerLink="/quotes" routerLinkActive="active">Quotes</a>
        <a class="nav-link" routerLink="/underwriting" routerLinkActive="active">Underwriting</a>
      </div>
      <div>
        <a routerLink="/quotes/new" class="btn btn-primary btn-sm">+ New Quote</a>
      </div>
    </nav>
  `
})
export class NavbarComponent {}
