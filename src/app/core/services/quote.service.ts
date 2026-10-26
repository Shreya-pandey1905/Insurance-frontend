import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Quote, Premium, QuoteHistory } from '../../shared/models/quote.model';
import { Rider } from '../../shared/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  private base = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  private unwrap<T>() {
    return map((res: any) => (res && res.data !== undefined ? res.data : res) as T);
  }

  // ---- Quotes ----
  getAllQuotes(): Observable<Quote[]> {
    return this.http.get<any>(`${this.base}/quotes`).pipe(this.unwrap<Quote[]>());
  }

  getQuoteById(id: number): Observable<Quote> {
    return this.http.get<any>(`${this.base}/quotes/${id}`).pipe(this.unwrap<Quote>());
  }

  createQuote(data: Quote): Observable<Quote> {
    return this.http.post<any>(`${this.base}/quotes`, data).pipe(this.unwrap<Quote>());
  }

  updateQuote(id: number, data: any): Observable<Quote> {
    return this.http.put<any>(`${this.base}/quotes/${id}`, data).pipe(this.unwrap<Quote>());
  }

  cancelQuote(id: number): Observable<any> {
    return this.http.delete<any>(`${this.base}/quotes/${id}`).pipe(this.unwrap<any>());
  }

  approveQuote(id: number): Observable<any> {
    return this.http.put<any>(`${this.base}/quotes/${id}/approve`, {}).pipe(this.unwrap<any>());
  }

  rejectQuote(id: number): Observable<any> {
    return this.http.put<any>(`${this.base}/quotes/${id}/reject`, {}).pipe(this.unwrap<any>());
  }

  convertQuote(id: number): Observable<any> {
    return this.http.put<any>(`${this.base}/quotes/${id}/convert`, {}).pipe(this.unwrap<any>());
  }

  // ---- Premium ----
  calculatePremium(request: any): Observable<Premium> {
    return this.http.post<any>(`${this.base}/quotes/calculate-premium`, request).pipe(this.unwrap<Premium>());
  }

  getPremium(quoteId: number): Observable<Premium> {
    return this.http.get<any>(`${this.base}/quotes/${quoteId}/premium`).pipe(this.unwrap<Premium>());
  }

  // ---- Quote Riders ----
  getQuoteRiders(quoteId: number): Observable<Rider[]> {
    return this.http.get<any>(`${this.base}/quotes/${quoteId}/riders`).pipe(this.unwrap<Rider[]>());
  }

  addRiderToQuote(quoteId: number, riderId: number): Observable<any> {
    return this.http.post<any>(`${this.base}/quotes/${quoteId}/riders/${riderId}`, {}).pipe(this.unwrap<any>());
  }

  removeRiderFromQuote(quoteId: number, riderId: number): Observable<any> {
    return this.http.delete<any>(`${this.base}/quotes/${quoteId}/riders/${riderId}`).pipe(this.unwrap<any>());
  }

  // ---- Quote History ----
  getQuoteHistory(quoteId: number): Observable<QuoteHistory[]> {
    return this.http.get<any>(`${this.base}/quotes/${quoteId}/history`).pipe(this.unwrap<QuoteHistory[]>());
  }
}
