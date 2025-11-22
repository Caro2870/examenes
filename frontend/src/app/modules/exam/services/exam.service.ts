import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  startExam(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/exam/start`, data);
  }

  answerQuestion(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/exam/answer`, data);
  }

  finishExam(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/exam/finish/${id}`, {});
  }

  getResults(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/exam/results/${id}`);
  }

  getMyExams(): Observable<any> {
    return this.http.get(`${this.apiUrl}/exam/my-exams`);
  }
}

