import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { SleepSession } from '../models/sleep-session.model';
import { SleepQuality } from '../models/sleep-quality.model';
import * as echarts from 'echarts';
import { lastValueFrom } from 'rxjs';

interface SleepDuration {
  sessionId: number;
  sleepTime: string;
  sleepScore: number;
}

@Component({
  selector: 'app-sleep-session',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sleep-session.html',
  styleUrls: ['./sleep-session.css'],
})
export class SleepSessionComponent implements OnInit {
  sessions: SleepSession[] = [];
  durations: SleepDuration[] = [];

  newSession: SleepSession = {
    sessionId: 0,
    userName: '',
    timeSleep: '',
    timeWakeup: ''
  };

  errorMessage: string | null = null;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadSessions();
  }

  loadSessions(): void {
    this.apiService.getSleepSessions().subscribe({
      next: (sessions) => {
        this.sessions = sessions;
      },
      error: (err) => (this.errorMessage = err.message),
    });
  }

  private toIsoStringNoMs(datetimeLocal: string): string {
    const [date, time] = datetimeLocal.split('T');
    return `${date}T${time}:00`;
  }

  createSession(): void {
    if (!this.newSession.timeSleep || !this.newSession.timeWakeup) {
      this.errorMessage = 'Пожалуйста, укажите оба времени';
      return;
    }

    const sessionToSend: Partial<SleepSession> = {
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
    window.location.href = `/sleep-quality?sessionId=${sessionId}`;
  }

  goToFactors(sessionId: number): void {
    window.location.href = `/sleep-factors?sessionId=${sessionId}`;
  }

  drawSleepChart(): void {
    this.apiService.getSleepDurationsWithQuality().subscribe({
      next: (durations: SleepDuration[]) => {
        this.durations = durations;

        const chartDom = document.getElementById('sleepChart');
        if (!chartDom) return;

        if (echarts.getInstanceByDom(chartDom)) {
          echarts.dispose(chartDom);
        }

        const myChart = echarts.init(chartDom);

        const labels = this.durations.map((d) => `Сессия ${d.sessionId}`);
        const bars = this.durations.map((d) => {
          const sleepValue = parseFloat(d.sleepTime);
          const color = this.getColorByScore(d.sleepScore);
          return {
            value: Math.round(sleepValue * 10) / 10,
            itemStyle: { color }
          };
        });

        const option = {
          title: {
            text: 'Продолжительность сна (в часах)'
          },
          tooltip: {},
          xAxis: {
            type: 'category',
            data: labels
          },
          yAxis: {
            type: 'value',
            name: 'Часы'
          },
          series: [
            {
              name: 'Продолжительность сна',
              data: bars,
              type: 'bar'
            }
          ],
          color: [
            '#000000', '#f44336', '#ff9800',
            '#ffeb3b', '#cddc39', '#4caf50'
          ]
        };

        myChart.setOption(option);
      },
      error: (err) => {
        this.errorMessage = 'Ошибка при загрузке данных для графика: ' + err.message;
      }
    });
  }

  private getColorByScore(score: number): string {
    switch (score) {
      case 0: return '#000000';
      case 1: return '#f44336';
      case 2: return '#ff9800';
      case 3: return '#ffeb3b';
      case 4: return '#cddc39';
      case 5: return '#4caf50';
      default: return '#9e9e9e';
    }
  }

  tableVisible = false;

  tableData: {
    session: SleepSession;
    quality: SleepQuality | null;
    factors: {
      coffee: boolean;
      alcohol: boolean;
      stressScore: number;
      physicalActivity: number;
    } | null;
  }[] = [];

  loadTableData(): void {
    this.tableVisible = false;
    this.tableData = [];

    const promises = this.sessions.map(async (session) => {
      let quality: SleepQuality | null = null;
      let factors: any = null;

      try {
        quality = await lastValueFrom(this.apiService.getSleepQuality(session.sessionId));
      } catch (_) {
        quality = null;
      }

      try {
        factors = await lastValueFrom(this.apiService.getSleepFactors(session.sessionId));
      } catch (_) {
        factors = null;
      }

      return { session, quality, factors };
    });

    Promise.all(promises).then((results) => {
      this.tableData = results;
      this.tableVisible = true;
    });
  }

  logout(): void {
    this.apiService.logout().subscribe({
      next: () => {
        localStorage.clear();
        window.location.href = '/login';
      },
      error: () => {
        alert('Не удалось выйти из системы');
      }
    });
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  getUsername(): string | null {
    return localStorage.getItem('user');
  }
}
