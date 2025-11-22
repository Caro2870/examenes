import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class QuestionsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getQuestions(filters?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/questions`, { params: filters });
  }

  getQuestion(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/questions/${id}`);
  }

  getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/questions/categories`);
  }

  getNiveles(): Observable<any> {
    return this.http.get(`${this.apiUrl}/questions/niveles`);
  }

  getDificultades(): Observable<any> {
    return this.http.get(`${this.apiUrl}/questions/dificultades`);
  }
}

