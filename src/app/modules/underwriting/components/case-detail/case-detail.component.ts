import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UnderwritingService } from '../../../../core/services/underwriting.service';
import { UnderwritingCase, MedicalDetails, FinancialDetails, RiskScore, UnderwritingDecision, UnderwritingAuditLog } from '../../../../shared/models/underwriting.model';

@Component({
  selector: 'app-case-detail',
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-header">
      <div style="display: flex; align-items: center; gap: 12px;">
        <a routerLink="/underwriting" class="btn btn-secondary btn-sm">← Back</a>
        <div>
          <div class="page-title">Underwriting Case #{{ uwId }}</div>
          <div class="page-subtitle">Quote #{{ uwCase?.quoteId }} | Customer: {{ uwCase?.customerId }}</div>
        </div>
      </div>
    </div>

    <div *ngIf="loading" class="loading-wrap"><div class="spinner"></div><div class="loading-text">Loading...</div></div>
    <div *ngIf="successMsg" class="alert alert-success">✅ {{ successMsg }}</div>
    <div *ngIf="errorMsg" class="alert alert-danger">❌ {{ errorMsg }}</div>

    <div *ngIf="!loading && uwCase">
      <!-- Status Card -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">Case Status</div>
          <span class="badge"
            [class.badge-warning]="uwCase.underwritingStatus === 'Pending'"
            [class.badge-info]="uwCase.underwritingStatus === 'In Progress'"
            [class.badge-success]="uwCase.underwritingStatus === 'Approved'"
            [class.badge-danger]="uwCase.underwritingStatus === 'Rejected'">
            {{ uwCase.underwritingStatus }}
          </span>
        </div>
        <div class="detail-grid">
          <div class="detail-item"><div class="detail-label">Case ID</div><div class="detail-value">#{{ uwCase.underwritingId }}</div></div>
          <div class="detail-item"><div class="detail-label">Quote</div><div class="detail-value"><a [routerLink]="['/quotes', uwCase.quoteId]" style="color: var(--primary-light);">Quote #{{ uwCase.quoteId }}</a></div></div>
          <div class="detail-item"><div class="detail-label">Customer ID</div><div class="detail-value">{{ uwCase.customerId }}</div></div>
          <div class="detail-item"><div class="detail-label">Product ID</div><div class="detail-value">{{ uwCase.productId }}</div></div>
        </div>
        <div class="flex gap-8 mt-16">
          <button class="btn btn-primary" (click)="calculateRisk()" [disabled]="processing">📊 Calculate Risk Score</button>
          <button class="btn btn-success" *ngIf="uwCase.underwritingStatus !== 'Approved'" (click)="showApproveForm = true" [disabled]="processing">✅ Approve</button>
          <button class="btn btn-danger" *ngIf="uwCase.underwritingStatus !== 'Rejected'" (click)="showRejectForm = true" [disabled]="processing">❌ Reject</button>
        </div>

        <!-- Approve Form -->
        <div *ngIf="showApproveForm" style="margin-top: 16px; padding: 16px; border: 1px solid var(--border); border-radius: 8px; background: var(--bg-dark);">
          <div class="form-row">
            <div class="form-group mb-0"><label class="form-label">Approved By (User ID)</label><input type="number" class="form-control" [(ngModel)]="approveForm.approvedBy" placeholder="5"></div>
            <div class="form-group mb-0"><label class="form-label">Remarks</label><input class="form-control" [(ngModel)]="approveForm.remarks" placeholder="Remarks..."></div>
          </div>
          <div class="flex gap-8 mt-12">
            <button class="btn btn-success btn-sm" (click)="approve()">Confirm Approve</button>
            <button class="btn btn-secondary btn-sm" (click)="showApproveForm = false">Cancel</button>
          </div>
        </div>

        <!-- Reject Form -->
        <div *ngIf="showRejectForm" style="margin-top: 16px; padding: 16px; border: 1px solid var(--border); border-radius: 8px; background: var(--bg-dark);">
          <div class="form-row">
            <div class="form-group mb-0"><label class="form-label">Rejected By (User ID)</label><input type="number" class="form-control" [(ngModel)]="rejectForm.approvedBy" placeholder="5"></div>
            <div class="form-group mb-0"><label class="form-label">Rejection Reason</label><input class="form-control" [(ngModel)]="rejectForm.rejectionReason" placeholder="Reason for rejection..."></div>
          </div>
          <div class="flex gap-8 mt-12">
            <button class="btn btn-danger btn-sm" (click)="reject()">Confirm Reject</button>
            <button class="btn btn-secondary btn-sm" (click)="showRejectForm = false">Cancel</button>
          </div>
        </div>
      </div>

      <!-- Medical Details -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">Medical Details</div>
          <button class="btn btn-sm btn-primary" (click)="showMedicalForm = !showMedicalForm">{{ medical ? '✏️ Update' : '➕ Add' }}</button>
        </div>
        <div *ngIf="medical && !showMedicalForm">
          <div class="detail-grid">
            <div class="detail-item"><div class="detail-label">Height</div><div class="detail-value">{{ medical.height }} cm</div></div>
            <div class="detail-item"><div class="detail-label">Weight</div><div class="detail-value">{{ medical.weight }} kg</div></div>
            <div class="detail-item"><div class="detail-label">BMI (Auto-calculated)</div><div class="detail-value">{{ medical.bmi }}</div></div>
            <div class="detail-item"><div class="detail-label">Blood Pressure</div><div class="detail-value">{{ medical.bloodPressure }}</div></div>
            <div class="detail-item"><div class="detail-label">Diabetes</div><div class="detail-value">{{ medical.diabetes ? 'Yes' : 'No' }}</div></div>
            <div class="detail-item"><div class="detail-label">Heart Disease</div><div class="detail-value">{{ medical.heartDisease ? 'Yes' : 'No' }}</div></div>
            <div class="detail-item"><div class="detail-label">Cancer History</div><div class="detail-value">{{ medical.cancerHistory ? 'Yes' : 'No' }}</div></div>
            <div class="detail-item"><div class="detail-label">Smoking</div><div class="detail-value">{{ medical.smoking ? 'Yes' : 'No' }}</div></div>
            <div class="detail-item" style="grid-column: span 2;"><div class="detail-label">Medical History</div><div class="detail-value">{{ medical.medicalHistory }}</div></div>
          </div>
        </div>
        <div *ngIf="showMedicalForm" style="padding-top: 8px;">
          <div class="form-row">
            <div class="form-group"><label class="form-label">Height (cm)</label><input type="number" class="form-control" [(ngModel)]="medForm.height" placeholder="175"></div>
            <div class="form-group"><label class="form-label">Weight (kg)</label><input type="number" class="form-control" [(ngModel)]="medForm.weight" placeholder="75"></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label class="form-label">Blood Pressure</label><input class="form-control" [(ngModel)]="medForm.bloodPressure" placeholder="120/80 Normal"></div>
            <div class="form-group"><label class="form-label">Medical History</label><input class="form-control" [(ngModel)]="medForm.medicalHistory" placeholder="No major illnesses..."></div>
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 16px;">
            <label class="checkbox-group"><input type="checkbox" [(ngModel)]="medForm.diabetes"> Diabetes</label>
            <label class="checkbox-group"><input type="checkbox" [(ngModel)]="medForm.heartDisease"> Heart Disease</label>
            <label class="checkbox-group"><input type="checkbox" [(ngModel)]="medForm.cancerHistory"> Cancer History</label>
            <label class="checkbox-group"><input type="checkbox" [(ngModel)]="medForm.smoking"> Smoking</label>
            <label class="checkbox-group"><input type="checkbox" [(ngModel)]="medForm.alcohol"> Alcohol</label>
          </div>
          <div class="flex gap-8">
            <button class="btn btn-primary btn-sm" (click)="saveMedical()">💾 Save Medical</button>
            <button class="btn btn-secondary btn-sm" (click)="showMedicalForm = false">Cancel</button>
          </div>
        </div>
        <div *ngIf="!medical && !showMedicalForm" class="empty-state" style="padding: 20px;"><p>No medical details added yet.</p></div>
      </div>

      <!-- Financial Details -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">Financial Details</div>
          <button class="btn btn-sm btn-primary" (click)="showFinancialForm = !showFinancialForm">{{ financial ? '✏️ Update' : '➕ Add' }}</button>
        </div>
        <div *ngIf="financial && !showFinancialForm">
          <div class="detail-grid">
            <div class="detail-item"><div class="detail-label">Annual Income</div><div class="detail-value">₹{{ financial.annualIncome | number }}</div></div>
            <div class="detail-item"><div class="detail-label">Employer</div><div class="detail-value">{{ financial.employerName }}</div></div>
            <div class="detail-item"><div class="detail-label">Occupation</div><div class="detail-value">{{ financial.occupation }}</div></div>
            <div class="detail-item"><div class="detail-label">Existing Insurance</div><div class="detail-value">₹{{ financial.existingInsurance | number }}</div></div>
            <div class="detail-item"><div class="detail-label">Loan Liability</div><div class="detail-value">₹{{ financial.loanLiability | number }}</div></div>
          </div>
        </div>
        <div *ngIf="showFinancialForm" style="padding-top: 8px;">
          <div class="form-row">
            <div class="form-group"><label class="form-label">Annual Income (₹)</label><input type="number" class="form-control" [(ngModel)]="finForm.annualIncome" placeholder="1200000"></div>
            <div class="form-group"><label class="form-label">Employer Name</label><input class="form-control" [(ngModel)]="finForm.employerName" placeholder="Tech Corp Pvt Ltd"></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label class="form-label">Occupation</label><input class="form-control" [(ngModel)]="finForm.occupation" placeholder="Software Engineer"></div>
            <div class="form-group"><label class="form-label">Existing Insurance (₹)</label><input type="number" class="form-control" [(ngModel)]="finForm.existingInsurance" placeholder="500000"></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label class="form-label">Loan Liability (₹)</label><input type="number" class="form-control" [(ngModel)]="finForm.loanLiability" placeholder="200000"></div>
            <div></div>
          </div>
          <div class="flex gap-8">
            <button class="btn btn-primary btn-sm" (click)="saveFinancial()">💾 Save Financial</button>
            <button class="btn btn-secondary btn-sm" (click)="showFinancialForm = false">Cancel</button>
          </div>
        </div>
        <div *ngIf="!financial && !showFinancialForm" class="empty-state" style="padding: 20px;"><p>No financial details added yet.</p></div>
      </div>

      <!-- Risk Score -->
      <div class="card" *ngIf="riskScore">
        <div class="card-header">
          <div class="card-title">Risk Score (Auto-calculated)</div>
          <span class="badge"
            [class.badge-success]="riskScore.riskCategory === 'Low'"
            [class.badge-warning]="riskScore.riskCategory === 'Medium'"
            [class.badge-danger]="riskScore.riskCategory === 'High' || riskScore.riskCategory === 'Very High'">
            {{ riskScore.riskCategory }}
          </span>
        </div>
        <div class="detail-grid">
          <div class="detail-item"><div class="detail-label">Age Score</div><div class="detail-value">{{ riskScore.ageScore }}</div></div>
          <div class="detail-item"><div class="detail-label">Medical Score</div><div class="detail-value">{{ riskScore.medicalScore }}</div></div>
          <div class="detail-item"><div class="detail-label">Occupation Score</div><div class="detail-value">{{ riskScore.occupationScore }}</div></div>
          <div class="detail-item"><div class="detail-label">Lifestyle Score</div><div class="detail-value">{{ riskScore.lifestyleScore }}</div></div>
          <div class="detail-item"><div class="detail-label">Financial Score</div><div class="detail-value">{{ riskScore.financialScore }}</div></div>
          <div class="detail-item"><div class="detail-label">Total Score</div><div class="detail-value" style="font-size: 18px; font-weight: 700;">{{ riskScore.totalScore }}</div></div>
          <div class="detail-item"><div class="detail-label">Loading %</div><div class="detail-value text-warning">{{ riskScore.loadingPercentage }}%</div></div>
        </div>
      </div>

      <!-- Decision -->
      <div class="card" *ngIf="decision">
        <div class="card-header">
          <div class="card-title">Underwriting Decision</div>
        </div>
        <div class="detail-grid">
          <div class="detail-item"><div class="detail-label">Decision</div><div class="detail-value"><span class="badge" [class.badge-success]="decision.decision === 'Approved'" [class.badge-danger]="decision.decision === 'Rejected'">{{ decision.decision }}</span></div></div>
          <div class="detail-item"><div class="detail-label">Decision Date</div><div class="detail-value">{{ decision.decisionDate | date:'dd-MM-yyyy' }}</div></div>
          <div class="detail-item" style="grid-column: span 2;"><div class="detail-label">Remarks / Reason</div><div class="detail-value">{{ decision.remarks || decision.rejectionReason }}</div></div>
        </div>
      </div>

      <!-- Audit Logs -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">Audit Logs</div>
        </div>
        <div class="table-wrapper" *ngIf="auditLogs.length > 0">
          <table>
            <thead><tr><th>Date</th><th>Action</th><th>Performed By</th><th>Remarks</th></tr></thead>
            <tbody>
              <tr *ngFor="let l of auditLogs">
                <td>{{ l.performedAt | date:'dd-MM-yyyy HH:mm' }}</td>
                <td><span class="badge badge-info">{{ l.action }}</span></td>
                <td>{{ l.performedBy }}</td>
                <td>{{ l.remarks }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div *ngIf="auditLogs.length === 0" class="empty-state" style="padding: 20px;"><p>No audit logs yet.</p></div>
      </div>
    </div>
  `
})
export class CaseDetailComponent implements OnInit {
  uwId!: number;
  uwCase: UnderwritingCase | null = null;
  medical: MedicalDetails | null = null;
  financial: FinancialDetails | null = null;
  riskScore: RiskScore | null = null;
  decision: UnderwritingDecision | null = null;
  auditLogs: UnderwritingAuditLog[] = [];
  loading = true;
  processing = false;
  successMsg = '';
  errorMsg = '';
  showMedicalForm = false;
  showFinancialForm = false;
  showApproveForm = false;
  showRejectForm = false;

  medForm: MedicalDetails = { height: 0, weight: 0, bloodPressure: '', diabetes: false, heartDisease: false, cancerHistory: false, smoking: false, alcohol: false, medicalHistory: '' };
  finForm: FinancialDetails = { annualIncome: 0, employerName: '', occupation: '', existingInsurance: 0, loanLiability: 0 };
  approveForm: any = { approvedBy: 0, remarks: '' };
  rejectForm: any = { approvedBy: 0, rejectionReason: '' };

  constructor(private route: ActivatedRoute, private uwService: UnderwritingService) {}

  ngOnInit() {
    this.uwId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadAll();
  }

  loadAll() {
    this.loading = true;
    this.uwService.getCaseById(this.uwId).subscribe({
      next: (d) => { this.uwCase = d; this.loading = false; },
      error: () => { this.errorMsg = 'Case not found.'; this.loading = false; }
    });
    this.uwService.getMedicalDetails(this.uwId).subscribe({ next: (d) => { this.medical = d; this.medForm = { ...d }; }, error: () => {} });
    this.uwService.getFinancialDetails(this.uwId).subscribe({ next: (d) => { this.financial = d; this.finForm = { ...d }; }, error: () => {} });
    this.uwService.getRiskScore(this.uwId).subscribe({ next: (d) => this.riskScore = d, error: () => {} });
    this.uwService.getDecision(this.uwId).subscribe({ next: (d) => this.decision = d, error: () => {} });
    this.uwService.getAuditLogs(this.uwId).subscribe({ next: (d) => this.auditLogs = d, error: () => {} });
  }

  saveMedical() {
    const obs = this.medical
      ? this.uwService.updateMedicalDetails(this.uwId, this.medForm)
      : this.uwService.saveMedicalDetails(this.uwId, this.medForm);
    obs.subscribe({
      next: (d) => { this.medical = d; this.successMsg = 'Medical details saved.'; this.showMedicalForm = false; },
      error: () => this.errorMsg = 'Failed to save medical details.'
    });
  }

  saveFinancial() {
    const obs = this.financial
      ? this.uwService.updateFinancialDetails(this.uwId, this.finForm)
      : this.uwService.saveFinancialDetails(this.uwId, this.finForm);
    obs.subscribe({
      next: (d) => { this.financial = d; this.successMsg = 'Financial details saved.'; this.showFinancialForm = false; },
      error: () => this.errorMsg = 'Failed to save financial details.'
    });
  }

  calculateRisk() {
    this.processing = true;
    this.uwService.calculateRiskScore(this.uwId).subscribe({
      next: (d) => { this.riskScore = d; this.successMsg = 'Risk score calculated! Premium updated automatically.'; this.processing = false; },
      error: () => { this.errorMsg = 'Failed to calculate risk. Make sure medical and financial details are saved first.'; this.processing = false; }
    });
  }

  approve() {
    this.processing = true;
    this.uwService.approveCase(this.uwId, this.approveForm).subscribe({
      next: () => { this.successMsg = 'Case Approved!'; this.processing = false; this.showApproveForm = false; this.loadAll(); },
      error: () => { this.errorMsg = 'Failed to approve.'; this.processing = false; }
    });
  }

  reject() {
    this.processing = true;
    this.uwService.rejectCase(this.uwId, this.rejectForm).subscribe({
      next: () => { this.successMsg = 'Case Rejected.'; this.processing = false; this.showRejectForm = false; this.loadAll(); },
      error: () => { this.errorMsg = 'Failed to reject.'; this.processing = false; }
    });
  }
}
