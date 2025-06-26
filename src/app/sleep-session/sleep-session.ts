import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { SleepSession } from '../models/sleep-session.model';

@Component({
  selector: 'app-sleep-session',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sleep-session.html',
  styleUrls: ['./sleep-session.css'],
})
export class SleepSessionComponent {
  sessions: SleepSession[] = [];
  newSession: SleepSession = { sessionId: 0, userName: '', timeSleep: '', timeWakeup: '' };
  username: string = '';
  errorMessage: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {}

  loadSessions(): void {
    if (this.username) {
      this.apiService.getSleepSessionsByUser(this.username).subscribe({
        next: (sessions) => (this.sessions = sessions),
        error: (err) => (this.errorMessage = err.message),
      });
    }
  }

  createSession(): void {
    this.apiService.createSleepSession(this.newSession).subscribe({
      next: () => {
        this.loadSessions();
        this.newSession = { sessionId: 0, userName: '', timeSleep: '', timeWakeup: '' };
        this.errorMessage = null;
      },
      error: (err) => (this.errorMessage = err.message),
    });
  }

  deleteSession(sessionId: number): void {
    this.apiService.deleteSleepSession(sessionId).subscribe({
      next: () => this.loadSessions(),
      error: (err) => (this.errorMessage = err.message),
    });
  }
}