import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { SleepQuality } from '../models/sleep-quality.model';
import { SleepSession } from '../models/sleep-session.model';

@Component({
  selector: 'app-sleep-quality',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sleep-quality.html',
  styleUrls: ['./sleep-quality.css'],
})
export class SleepQualityComponent implements OnInit {
  newQuality: SleepQuality = {
    sessionId: 0,
    feelingScore: 0,
    sleepScore: 0,
    wakeupCount: 0,
  };
  username: string = '';
  session: SleepSession | null = null;
  fetchedQuality: SleepQuality | null = null;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private apiService: ApiService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const sessionId = Number(this.route.snapshot.queryParamMap.get('sessionId'));
    const userParam = this.route.snapshot.queryParamMap.get('user');
    if (userParam) {
      this.username = userParam;
    } else {
      this.errorMessage = 'Имя пользователя не передано в URL';
    }
    if (sessionId > 0) {
      this.newQuality.sessionId = sessionId;

      this.apiService.getSleepSessionById(sessionId).subscribe({
        next: (session) => (this.session = session),
        error: (err) => {
          console.error('Ошибка при получении сессии:', err);
          this.errorMessage = 'Не удалось загрузить информацию о сессии';
        },
      });
    } else {
      this.errorMessage = 'ID сессии не передан в URL';
    }
  }

  createQuality(): void {
    this.clearMessages();

    if (!this.isValid(this.newQuality)) return;

    this.apiService.createSleepQuality(this.newQuality).subscribe({
      next: (created) => {
        this.successMessage = `Качество сна для сессии ${created.sessionId} успешно создано`;
        this.fetchedQuality = created;
      },
      error: (err) => {
        const msg = err.error?.message || err.message || 'Неизвестная ошибка';
        this.errorMessage = `Не удалось создать качество сна: ${msg}`;
      },
    });
  }

  getQuality(sessionId: number): void {
    this.clearMessages();

    this.apiService.getSleepQuality(sessionId).subscribe({
      next: (quality) => {
        this.fetchedQuality = quality;
        this.successMessage = `Качество сна для сессии ${sessionId} успешно загружено`;
      },
      error: (err) => {
        const msg = err.error?.message || err.message || 'Неизвестная ошибка';
        this.errorMessage = `Не удалось получить качество сна: ${msg}`;
        this.fetchedQuality = null;
      },
    });
  }

  deleteQuality(sessionId: number): void {
    this.clearMessages();

    this.apiService.deleteSleepQuality(sessionId).subscribe({
      next: () => {
        this.successMessage = `Качество сна для сессии ${sessionId} успешно удалено`;
        this.fetchedQuality = null;
      },
      error: (err) => {
        const msg = err.error?.message || err.message || 'Неизвестная ошибка';
        this.errorMessage = `Не удалось удалить качество сна: ${msg}`;
      },
    });
  }

  goBackToSessions(): void {
    window.location.href = `/sleep-sessions?user=${this.username}`;
  }

  private isValid(q: SleepQuality): boolean {
    if (q.sessionId <= 0) {
      this.errorMessage = 'ID сессии отсутствует';
      return false;
    }
    if (q.feelingScore < 0 || q.feelingScore > 5) {
      this.errorMessage = 'Оценка самочувствия должна быть от 0 до 5';
      return false;
    }
    if (q.sleepScore < 0 || q.sleepScore > 5) {
      this.errorMessage = 'Оценка сна должна быть от 0 до 5';
      return false;
    }
    if (q.wakeupCount < 0) {
      this.errorMessage = 'Количество пробуждений не может быть отрицательным';
      return false;
    }
    return true;
  }

  private clearMessages(): void {
    this.errorMessage = null;
    this.successMessage = null;
  }
}
