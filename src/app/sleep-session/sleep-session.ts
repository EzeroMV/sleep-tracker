import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { SleepSession } from '../models/sleep-session.model';

@Component({
  selector: 'app-sleep-session',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sleep-session.html',
  styleUrls: ['./sleep-session.css'],
})
export class SleepSessionComponent implements OnInit {
  sessions: SleepSession[] = [];
  newSession: SleepSession = { sessionId: 0, userName: '', timeSleep: '', timeWakeup: '' };
  errorMessage: string | null = null;
  username: string = '';

  constructor(private apiService: ApiService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const userParam = this.route.snapshot.queryParamMap.get('user');
    if (userParam) {
      this.username = userParam;
      this.newSession.userName = this.username;
      this.loadSessions();
    } else {
      this.errorMessage = 'Имя пользователя не передано в URL';
    }
  }

  loadSessions(): void {
    this.apiService.getSleepSessionsByUser(this.username).subscribe({
      next: (sessions) => (this.sessions = sessions),
      error: (err) => (this.errorMessage = err.message),
    });
  }

  private toIsoStringNoMs(datetimeLocal: string): string {
    const date = new Date(datetimeLocal);
    return date.toISOString().slice(0, 19);
  }

  createSession(): void {
    if (!this.newSession.timeSleep || !this.newSession.timeWakeup) {
      this.errorMessage = 'Пожалуйста, укажите оба времени';
      return;
    }

    const sessionToSend: Partial<SleepSession> = {
      userName: this.username,
      timeSleep: this.toIsoStringNoMs(this.newSession.timeSleep),
      timeWakeup: this.toIsoStringNoMs(this.newSession.timeWakeup),
    };

    this.apiService.createSleepSession(sessionToSend).subscribe({
      next: (createdSession: SleepSession) => {
        this.loadSessions();
        this.newSession.timeSleep = '';
        this.newSession.timeWakeup = '';
        alert(`Сессия сна успешно создана! Номер сессии: ${createdSession.sessionId}`);
      },
      error: (err) => {
        this.errorMessage = `Не удалось создать сессию сна: ${err.message}`;
      },
    });
  }

  deleteSession(sessionId: number): void {
    this.apiService.deleteSleepSession(sessionId).subscribe({
      next: () => this.loadSessions(),
      error: (err) => (this.errorMessage = err.message),
    });
  }

  goToQuality(sessionId: number): void {
    window.location.href = `/sleep-quality?sessionId=${sessionId}&user=${this.username}`;
  }

  goToFactors(sessionId: number): void {
    window.location.href = `/sleep-factors?sessionId=${sessionId}&user=${this.username}`;
  }
}
