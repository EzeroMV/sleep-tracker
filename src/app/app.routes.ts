import { Routes } from '@angular/router';
import { UserComponent } from './user/user';
import { SleepSessionComponent } from './sleep-session/sleep-session';
import { SleepQualityComponent } from './sleep-quality/sleep-quality';
import { SleepFactorsComponent } from './sleep-factors/sleep-factors';

export const routes: Routes = [
  { path: 'users', component: UserComponent },
  { path: 'sleep-sessions', component: SleepSessionComponent },
  { path: 'sleep-quality', component: SleepQualityComponent },
  { path: 'sleep-factors', component: SleepFactorsComponent },
  { path: '', redirectTo: '/users', pathMatch: 'full' },
];