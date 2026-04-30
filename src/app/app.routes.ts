import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { DjDashboardComponent } from './pages/dj-dashboard/dj-dashboard.component';
import { CalendarPageComponent } from './pages/calendar-page/calendar-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'dashboard', component: DjDashboardComponent },
  { path: 'calendar', component: CalendarPageComponent },
  { path: 'search', component: SearchPageComponent },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' }
];
