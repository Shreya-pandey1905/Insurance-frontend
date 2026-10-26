import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  UnderwritingCase,
  MedicalDetails,
  FinancialDetails,
  RiskScore,
  UnderwritingDecision,
  UnderwritingAuditLog
} from '../../shared/models/underwriting.model';

@Injectable({
  providedIn: 'root'
})
export class UnderwritingService {
  private base = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  private unwrap<T>() {
    return map((res: any) => (res && res.data !== undefined ? res.data : res) as T);
  }

  // ---- Underwriting Cases ----
  getAllCases(): Observable<UnderwritingCase[]> {
    return this.http.get<any>(`${this.base}/underwriting`).pipe(this.unwrap<UnderwritingCase[]>());
  }

  getCaseById(id: number): Observable<UnderwritingCase> {
    return this.http.get<any>(`${this.base}/underwriting/${id}`).pipe(this.unwrap<UnderwritingCase>());
  }

  getCaseByQuoteId(quoteId: number): Observable<UnderwritingCase> {
    return this.http.get<any>(`${this.base}/underwriting/quote/${quoteId}`).pipe(this.unwrap<UnderwritingCase>());
  }

  createCase(data: UnderwritingCase): Observable<UnderwritingCase> {
    return this.http.post<any>(`${this.base}/underwriting`, data).pipe(this.unwrap<UnderwritingCase>());
  }

  updateCase(id: number, data: UnderwritingCase): Observable<UnderwritingCase> {
    return this.http.put<any>(`${this.base}/underwriting/${id}`, data).pipe(this.unwrap<UnderwritingCase>());
  }

  // ---- Medical Details ----
  getMedicalDetails(uwId: number): Observable<MedicalDetails> {
    return this.http.get<any>(`${this.base}/underwriting/${uwId}/medical`).pipe(this.unwrap<MedicalDetails>());
  }

  saveMedicalDetails(uwId: number, data: MedicalDetails): Observable<MedicalDetails> {
    return this.http.post<any>(`${this.base}/underwriting/${uwId}/medical`, data).pipe(this.unwrap<MedicalDetails>());
  }

  updateMedicalDetails(uwId: number, data: MedicalDetails): Observable<MedicalDetails> {
    return this.http.put<any>(`${this.base}/underwriting/${uwId}/medical`, data).pipe(this.unwrap<MedicalDetails>());
  }

  // ---- Financial Details ----
  getFinancialDetails(uwId: number): Observable<FinancialDetails> {
    return this.http.get<any>(`${this.base}/underwriting/${uwId}/financial`).pipe(this.unwrap<FinancialDetails>());
  }

  saveFinancialDetails(uwId: number, data: FinancialDetails): Observable<FinancialDetails> {
    return this.http.post<any>(`${this.base}/underwriting/${uwId}/financial`, data).pipe(this.unwrap<FinancialDetails>());
  }

  updateFinancialDetails(uwId: number, data: FinancialDetails): Observable<FinancialDetails> {
    return this.http.put<any>(`${this.base}/underwriting/${uwId}/financial`, data).pipe(this.unwrap<FinancialDetails>());
  }

  // ---- Risk Calculation ----
  calculateRiskScore(uwId: number): Observable<RiskScore> {
    return this.http.post<any>(`${this.base}/underwriting/${uwId}/calculate-risk`, {}).pipe(this.unwrap<RiskScore>());
  }

  getRiskScore(uwId: number): Observable<RiskScore> {
    return this.http.get<any>(`${this.base}/underwriting/${uwId}/risk-score`).pipe(this.unwrap<RiskScore>());
  }

  // ---- Decision ----
  approveCase(uwId: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.base}/underwriting/${uwId}/approve`, data).pipe(this.unwrap<any>());
  }

  rejectCase(uwId: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.base}/underwriting/${uwId}/reject`, data).pipe(this.unwrap<any>());
  }

  applyLoading(uwId: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.base}/underwriting/${uwId}/loading`, data).pipe(this.unwrap<any>());
  }

  getDecision(uwId: number): Observable<UnderwritingDecision> {
    return this.http.get<any>(`${this.base}/underwriting/${uwId}/decision`).pipe(this.unwrap<UnderwritingDecision>());
  }

  // ---- Audit Logs ----
  getAuditLogs(uwId: number): Observable<UnderwritingAuditLog[]> {
    return this.http.get<any>(`${this.base}/underwriting/${uwId}/audit-logs`).pipe(this.unwrap<UnderwritingAuditLog[]>());
  }
}
