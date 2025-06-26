import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { SleepQuality } from '../models/sleep-quality.model';

@Component({
  selector: 'app-sleep-quality',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sleep-quality.html',
  styleUrls: ['./sleep-quality.css'],
})
export class SleepQualityComponent {
  newQuality: SleepQuality = { sessionId: 0, feelingScore: 0, sleepScore: 0, wakeupCount: 0 };
  errorMessage: string | null = null;

  constructor(private apiService: ApiService) {}

  createQuality(): void {
    this.apiService.createSleepQuality(this.newQuality).subscribe({
      next: () => {
        this.newQuality = { sessionId: 0, feelingScore: 0, sleepScore: 0, wakeupCount: 0 };
        this.errorMessage = null;
        alert('Качество сна добавлено!');
      },
      error: (err) => (this.errorMessage = err.message),
    });
  }

  getQuality(sessionId: number): void {
    this.apiService.getSleepQuality(sessionId).subscribe({
      next: (quality) => (this.newQuality = quality),
      error: (err) => (this.errorMessage = err.message),
    });
  }

  deleteQuality(sessionId: number): void {
    this.apiService.deleteSleepQuality(sessionId).subscribe({
      next: () => {
        this.newQuality = { sessionId: 0, feelingScore: 0, sleepScore: 0, wakeupCount: 0 };
        this.errorMessage = null;
      },
      error: (err) => (this.errorMessage = err.message),
    });
  }
}