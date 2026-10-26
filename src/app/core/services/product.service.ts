import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  ProductCategory,
  InsuranceProduct,
  Coverage,
  Rider,
  Benefit,
  ProductCommission,
  PremiumFrequency,
  Discount
} from '../../shared/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private base = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  private unwrap<T>() {
    return map((res: any) => (res && res.data !== undefined ? res.data : res) as T);
  }

  // ---- Product Categories ----
  getAllCategories(): Observable<ProductCategory[]> {
    return this.http.get<any>(`${this.base}/product-categories`).pipe(this.unwrap<ProductCategory[]>());
  }

  getCategoryById(id: number): Observable<ProductCategory> {
    return this.http.get<any>(`${this.base}/product-categories/${id}`).pipe(this.unwrap<ProductCategory>());
  }

  createCategory(data: ProductCategory): Observable<ProductCategory> {
    return this.http.post<any>(`${this.base}/product-categories`, data).pipe(this.unwrap<ProductCategory>());
  }

  updateCategory(id: number, data: ProductCategory): Observable<ProductCategory> {
    return this.http.put<any>(`${this.base}/product-categories/${id}`, data).pipe(this.unwrap<ProductCategory>());
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete<any>(`${this.base}/product-categories/${id}`).pipe(this.unwrap<any>());
  }

  // ---- Products ----
  getAllProducts(): Observable<InsuranceProduct[]> {
    return this.http.get<any>(`${this.base}/products`).pipe(this.unwrap<InsuranceProduct[]>());
  }

  getProductById(id: number): Observable<InsuranceProduct> {
    return this.http.get<any>(`${this.base}/products/${id}`).pipe(this.unwrap<InsuranceProduct>());
  }

  createProduct(data: InsuranceProduct): Observable<InsuranceProduct> {
    return this.http.post<any>(`${this.base}/products`, data).pipe(this.unwrap<InsuranceProduct>());
  }

  updateProduct(id: number, data: any): Observable<InsuranceProduct> {
    return this.http.put<any>(`${this.base}/products/${id}`, data).pipe(this.unwrap<InsuranceProduct>());
  }

  deactivateProduct(id: number): Observable<any> {
    return this.http.delete<any>(`${this.base}/products/${id}`).pipe(this.unwrap<any>());
  }

  // ---- Coverages ----
  getCoverages(productId: number): Observable<Coverage[]> {
    return this.http.get<any>(`${this.base}/products/${productId}/coverages`).pipe(this.unwrap<Coverage[]>());
  }

  addCoverage(productId: number, data: Coverage): Observable<Coverage> {
    return this.http.post<any>(`${this.base}/products/${productId}/coverages`, data).pipe(this.unwrap<Coverage>());
  }

  updateCoverage(coverageId: number, data: Coverage): Observable<Coverage> {
    return this.http.put<any>(`${this.base}/coverages/${coverageId}`, data).pipe(this.unwrap<Coverage>());
  }

  deleteCoverage(coverageId: number): Observable<any> {
    return this.http.delete<any>(`${this.base}/coverages/${coverageId}`).pipe(this.unwrap<any>());
  }

  // ---- Riders ----
  getProductRiders(productId: number): Observable<Rider[]> {
    return this.http.get<any>(`${this.base}/products/${productId}/riders`).pipe(this.unwrap<Rider[]>());
  }

  addRider(productId: number, data: Rider): Observable<Rider> {
    return this.http.post<any>(`${this.base}/products/${productId}/riders`, data).pipe(this.unwrap<Rider>());
  }

  updateRider(riderId: number, data: Rider): Observable<Rider> {
    return this.http.put<any>(`${this.base}/riders/${riderId}`, data).pipe(this.unwrap<Rider>());
  }

  deleteRider(riderId: number): Observable<any> {
    return this.http.delete<any>(`${this.base}/riders/${riderId}`).pipe(this.unwrap<any>());
  }

  // ---- Benefits ----
  getBenefits(productId: number): Observable<Benefit[]> {
    return this.http.get<any>(`${this.base}/products/${productId}/benefits`).pipe(this.unwrap<Benefit[]>());
  }

  addBenefit(productId: number, data: Benefit): Observable<Benefit> {
    return this.http.post<any>(`${this.base}/products/${productId}/benefits`, data).pipe(this.unwrap<Benefit>());
  }

  updateBenefit(benefitId: number, data: Benefit): Observable<Benefit> {
    return this.http.put<any>(`${this.base}/benefits/${benefitId}`, data).pipe(this.unwrap<Benefit>());
  }

  deleteBenefit(benefitId: number): Observable<any> {
    return this.http.delete<any>(`${this.base}/benefits/${benefitId}`).pipe(this.unwrap<any>());
  }

  // ---- Commission ----
  getCommission(productId: number): Observable<ProductCommission> {
    return this.http.get<any>(`${this.base}/products/${productId}/commissions`).pipe(this.unwrap<ProductCommission>());
  }

  saveCommission(productId: number, data: ProductCommission): Observable<ProductCommission> {
    return this.http.post<any>(`${this.base}/products/${productId}/commissions`, data).pipe(this.unwrap<ProductCommission>());
  }

  // ---- Premium Frequencies ----
  getAllFrequencies(): Observable<PremiumFrequency[]> {
    return this.http.get<any>(`${this.base}/premium-frequencies`).pipe(this.unwrap<PremiumFrequency[]>());
  }

  getFrequencyById(id: number): Observable<PremiumFrequency> {
    return this.http.get<any>(`${this.base}/premium-frequencies/${id}`).pipe(this.unwrap<PremiumFrequency>());
  }

  createFrequency(data: PremiumFrequency): Observable<PremiumFrequency> {
    return this.http.post<any>(`${this.base}/premium-frequencies`, data).pipe(this.unwrap<PremiumFrequency>());
  }

  updateFrequency(id: number, data: PremiumFrequency): Observable<PremiumFrequency> {
    return this.http.put<any>(`${this.base}/premium-frequencies/${id}`, data).pipe(this.unwrap<PremiumFrequency>());
  }

  deleteFrequency(id: number): Observable<any> {
    return this.http.delete<any>(`${this.base}/premium-frequencies/${id}`).pipe(this.unwrap<any>());
  }

  // ---- Discounts ----
  getAllDiscounts(): Observable<Discount[]> {
    return this.http.get<any>(`${this.base}/discounts`).pipe(this.unwrap<Discount[]>());
  }

  getDiscountById(id: number): Observable<Discount> {
    return this.http.get<any>(`${this.base}/discounts/${id}`).pipe(this.unwrap<Discount>());
  }

  createDiscount(data: Discount): Observable<Discount> {
    return this.http.post<any>(`${this.base}/discounts`, data).pipe(this.unwrap<Discount>());
  }

  updateDiscount(id: number, data: Discount): Observable<Discount> {
    return this.http.put<any>(`${this.base}/discounts/${id}`, data).pipe(this.unwrap<Discount>());
  }

  deleteDiscount(id: number): Observable<any> {
    return this.http.delete<any>(`${this.base}/discounts/${id}`).pipe(this.unwrap<any>());
  }
}
