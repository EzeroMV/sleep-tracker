import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    // Логика входа убрана, так как AuthService не используется
    return of(null); // Пустой ответ
  }

  logout(): void {}

  getCurrentUser(): any {
    return null; // Ничего не возвращаем
  }

  isLoggedIn(): boolean {
    return false;
  }
}