import { SleepQuality } from './sleep-quality.model';
import { SleepFactors } from './sleep-factors.model';

export interface SleepSession {
  sessionId: number;
  userName: string;
  timeSleep: string;
  timeWakeup: string;
  sleepQuality?: SleepQuality;
  sleepFactors?: SleepFactors;
}