import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { SleepFactors } from '../models/sleep-factors.model';

@Component({
  selector: 'app-sleep-factors',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sleep-factors.html',
  styleUrls: ['./sleep-factors.css'],
})
export class SleepFactorsComponent {
  newFactors: SleepFactors = { sessionId: 0, coffee: false, alcohol: false, stressScore: 0, physicalActivity: 0 };
  errorMessage: string | null = null;

  constructor(private apiService: ApiService) {}

  createFactors(): void {
    this.apiService.createSleepFactors(this.newFactors).subscribe({
      next: () => {
        this.newFactors = { sessionId: 0, coffee: false, alcohol: false, stressScore: 0, physicalActivity: 0 };
        this.errorMessage = null;
        alert('Факторы сна добавлены!');
      },
      error: (err) => (this.errorMessage = err.message),
    });
  }

  getFactors(sessionId: number): void {
    this.apiService.getSleepFactors(sessionId).subscribe({
      next: (factors) => (this.newFactors = factors),
      error: (err) => (this.errorMessage = err.message),
    });
  }

  deleteFactors(sessionId: number): void {
    this.apiService.deleteSleepFactors(sessionId).subscribe({
      next: () => {
        this.newFactors = { sessionId: 0, coffee: false, alcohol: false, stressScore: 0, physicalActivity: 0 };
        this.errorMessage = null;
      },
      error: (err) => (this.errorMessage = err.message),
    });
  }
}