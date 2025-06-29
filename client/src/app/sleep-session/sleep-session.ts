import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { SleepSession } from '../models/sleep-session.model';
import { SleepQuality } from '../models/sleep-quality.model';
import * as echarts from 'echarts';
import { lastValueFrom } from 'rxjs';


interface SleepDuration {
  sessionId: number;
  sleepTime: string; // в часах
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

  drawSleepChart(): void {
    this.apiService.getSleepDurationsWithQuality(this.username).subscribe({
      next: (durations: SleepDuration[]) => {
        this.durations = durations;

        const chartDom = document.getElementById('sleepChart');
        if (!chartDom) return;

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
              data: bars,
              type: 'bar'
            }
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
      case 0: return '#000000';  // чёрный
      case 1: return '#f44336';  // красный
      case 2: return '#ff9800';  // оранжевый
      case 3: return '#ffeb3b';  // жёлтый
      case 4: return '#cddc39';  // жёлто-зелёный (лайм)
      case 5: return '#4caf50';  // зелёный
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

}

