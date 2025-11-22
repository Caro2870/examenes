import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getComments(preguntaId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/comments/question/${preguntaId}`);
  }

  createComment(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/comments`, data);
  }

  voteComment(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/comments/vote`, data);
  }

  reportQuestion(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/comments/report-question`, data);
  }
}

