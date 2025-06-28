import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SleepSession } from '../models/sleep-session.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  // Обработка ошибок
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Произошла ошибка';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Ошибка: ${error.error.message}`;
    } else {
      errorMessage = `Код ошибки: ${error.status}, сообщение: ${error.message}`;
    }
    return throwError(errorMessage);
  }

  // Методы для работы с пользователями
  createUser(user: any): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/users`, user)
      .pipe(catchError(this.handleError));
  }

  getUser(username: string): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/users/${username}`)
      .pipe(catchError(this.handleError));
  }

  getAllUsers(): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/users`)
      .pipe(catchError(this.handleError));
  }

  deleteUser(username: string): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/users/${username}`)
      .pipe(catchError(this.handleError));
  }

  // Методы для работы с сессиями сна
  createSleepSession(session: any): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/sleep-sessions`, session)
      .pipe(catchError(this.handleError));
  }

  getSleepSessionsByUser(username: string): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/sleep-sessions/user/${username}`)
      .pipe(catchError(this.handleError));
  }

  deleteSleepSession(sessionId: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/sleep-sessions/${sessionId}`)
      .pipe(catchError(this.handleError));
  }

  // Методы для работы с качеством сна
  createSleepQuality(quality: any): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/sleep-quality`, quality)
      .pipe(catchError(this.handleError));
  }

  getSleepQuality(sessionId: number): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/sleep-quality/${sessionId}`)
      .pipe(catchError(this.handleError));
  }

  deleteSleepQuality(sessionId: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/sleep-quality/${sessionId}`)
      .pipe(catchError(this.handleError));
  }

  // Методы для работы с факторами сна
  createSleepFactors(factors: any): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/sleep-factors`, factors)
      .pipe(catchError(this.handleError));
  }

  getSleepFactors(sessionId: number): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/sleep-factors/${sessionId}`)
      .pipe(catchError(this.handleError));
  }

  deleteSleepFactors(sessionId: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/sleep-factors/${sessionId}`)
      .pipe(catchError(this.handleError));
  }
  getSleepSessionById(sessionId: number): Observable<SleepSession> {
    return this.http.get<SleepSession>(`${this.baseUrl}/sessions/${sessionId}`);
  }

}