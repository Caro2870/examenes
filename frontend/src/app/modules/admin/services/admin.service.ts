import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPendingQuestions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/questions/pending`);
  }

  approveQuestion(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/questions/${id}/approve`, {});
  }

  rejectQuestion(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/questions/${id}/reject`, {});
  }

  generateQuestion(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/ai-generator/create-question`, data);
  }

  getReports(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/reports`);
  }

  getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/categories`);
  }

  getNiveles(): Observable<any> {
    return this.http.get(`${this.apiUrl}/questions/niveles`);
  }

  getDificultades(): Observable<any> {
    return this.http.get(`${this.apiUrl}/questions/dificultades`);
  }

  createQuestion(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/questions`, data);
  }

  uploadExcel(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/admin/questions/upload-excel`, formData);
  }
}

