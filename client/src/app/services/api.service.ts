import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SleepDurationWithQuality } from '../models/sleep-duration';
import { SleepSession } from '../models/sleep-session.model';
import { User } from '../models/user.model';

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
    return throwError(() => errorMessage);
  }

  // Пользователи
  createUser(user: User): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/users/register`, user, { withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  getUser(username: string): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/users/${username}`, { withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  getAllUsers(): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/users`, { withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  deleteUser(username: string): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/users/${username}`, { withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  // Сессии сна
  createSleepSession(session: Partial<SleepSession>): Observable<SleepSession> {
    return this.http
      .post<SleepSession>(`${this.baseUrl}/sleep-sessions`, session, { withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  getSleepSessions(): Observable<SleepSession[]> {
    return this.http
      .get<SleepSession[]>(`${this.baseUrl}/sleep-sessions`, { withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  getSleepSessionById(sessionId: number): Observable<SleepSession> {
    return this.http
      .get<SleepSession>(`${this.baseUrl}/sleep-sessions/${sessionId}`, { withCredentials: true });
  }

  deleteSleepSession(sessionId: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/sleep-sessions/${sessionId}`, { withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  getSleepDurationsWithQuality(): Observable<SleepDurationWithQuality[]> {
    return this.http
      .get<SleepDurationWithQuality[]>(`${this.baseUrl}/sleep-sessions/duration-with-quality`, {
        withCredentials: true,
      });
  }

  // Качество сна
  createSleepQuality(quality: any): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/sleep-quality`, quality, { withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  getSleepQuality(sessionId: number): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/sleep-quality/${sessionId}`, { withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  deleteSleepQuality(sessionId: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/sleep-quality/${sessionId}`, { withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  // Факторы сна
  createSleepFactors(factors: any): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/sleep-factors`, factors, { withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  getSleepFactors(sessionId: number): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/sleep-factors/${sessionId}`, { withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  deleteSleepFactors(sessionId: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/sleep-factors/${sessionId}`, { withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  // Аутентификация
  loginUser(user: User): Observable<string> {
    return this.http.post(`${this.baseUrl}/users/login`, user, {
      withCredentials: true,
      responseType: 'text',
    });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/sleep-sessions/logout`, {}, {
      withCredentials: true,
    });
  }
}
