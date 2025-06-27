import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { SleepFactors } from '../models/sleep-factors.model';
import { SleepSession } from '../models/sleep-session.model';

@Component({
  selector: 'app-sleep-factors',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sleep-factors.html',
  styleUrls: ['./sleep-factors.css'],
})
export class SleepFactorsComponent implements OnInit {
  newFactors: SleepFactors = {
    sessionId: 0,
    coffee: false,
    alcohol: false,
    stressScore: 0,
    physicalActivity: 0,
  };

  session: SleepSession | null = null;
  fetchedFactors: SleepFactors | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private apiService: ApiService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const sessionId = Number(this.route.snapshot.queryParamMap.get('sessionId'));

    if (sessionId > 0) {
      this.newFactors.sessionId = sessionId;

      this.apiService.getSleepSessionById(sessionId).subscribe({
        next: (data) => (this.session = data),
        error: (err) => {
          console.error('Ошибка при получении сессии:', err);
          this.errorMessage = 'Не удалось загрузить информацию о сессии';
        },
      });
    } else {
      this.errorMessage = 'ID сессии не передан в URL';
    }
  }

  createFactors(): void {
    this.clearMessages();

    if (!this.isValid(this.newFactors)) return;

    this.apiService.createSleepFactors(this.newFactors).subscribe({
      next: (created) => {
        this.successMessage = `Факторы сна для сессии ${created.sessionId} успешно созданы`;
        this.fetchedFactors = created;
      },
      error: (err) => {
        const msg = err.error?.message || err.message || 'Неизвестная ошибка';
        this.errorMessage = `Не удалось создать факторы сна: ${msg}`;
      },
    });
  }

  getFactors(sessionId: number): void {
    this.clearMessages();

    this.apiService.getSleepFactors(sessionId).subscribe({
      next: (factors) => {
        this.fetchedFactors = factors;
        this.successMessage = `Факторы сна для сессии ${sessionId} успешно загружены`;
      },
      error: (err) => {
        const msg = err.error?.message || err.message || 'Неизвестная ошибка';
        this.errorMessage = `Не удалось получить факторы сна: ${msg}`;
        this.fetchedFactors = null;
      },
    });
  }

  deleteFactors(sessionId: number): void {
    this.clearMessages();

    this.apiService.deleteSleepFactors(sessionId).subscribe({
      next: () => {
        this.successMessage = `Факторы сна для сессии ${sessionId} успешно удалены`;
        this.fetchedFactors = null;
      },
      error: (err) => {
        const msg = err.error?.message || err.message || 'Неизвестная ошибка';
        this.errorMessage = `Не удалось удалить факторы сна: ${msg}`;
      },
    });
  }

  goBackToSessions(): void {
    window.location.href = '/sleep-sessions';
  }

  private isValid(f: SleepFactors): boolean {
    if (f.sessionId <= 0) {
      this.errorMessage = 'ID сессии отсутствует';
      return false;
    }
    if (f.stressScore < 0 || f.stressScore > 5) {
      this.errorMessage = 'Уровень стресса должен быть от 0 до 5';
      return false;
    }
    if (f.physicalActivity < 0 || f.physicalActivity > 5) {
      this.errorMessage = 'Физическая активность должна быть от 0 до 5';
      return false;
    }
    return true;
  }

  private clearMessages(): void {
    this.errorMessage = null;
    this.successMessage = null;
  }
}
