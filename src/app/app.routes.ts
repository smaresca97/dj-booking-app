import { Routes } from '@angular/router';
import { WelcomePageComponent } from './pages/welcome-page/welcome-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { DjDashboardComponent } from './pages/dj-dashboard/dj-dashboard.component';
import { CalendarPageComponent } from './pages/calendar-page/calendar-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { PendingPageComponent } from './pages/pending-page/pending-page.component';
import { AdminUsersPageComponent } from './pages/admin-users-page/admin-users-page.component';
import { AdminAssignmentsPageComponent } from './pages/admin-assignments-page/admin-assignments-page.component';
import { VenueDashboardPageComponent } from './pages/venue-dashboard-page/venue-dashboard-page.component';
import { authGuard } from './guards/auth.guard';
import { djGuard } from './guards/dj.guard';
import { profileGuard } from './guards/profile.guard';
import { adminGuard } from './guards/admin.guard';
import { venueGuard } from './guards/venue.guard';

export const routes: Routes = [
  { path: '', component: WelcomePageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'pending', component: PendingPageComponent, canActivate: [authGuard] },
  { path: 'admin', component: AdminUsersPageComponent, canActivate: [authGuard, adminGuard] },
  { path: 'assignments', component: AdminAssignmentsPageComponent, canActivate: [authGuard, adminGuard] },
  { path: 'venue', component: VenueDashboardPageComponent, canActivate: [authGuard, venueGuard] },
  { path: 'profile', component: ProfilePageComponent, canActivate: [authGuard, djGuard] },
  { path: 'dashboard', component: DjDashboardComponent, canActivate: [authGuard, djGuard, profileGuard] },
  { path: 'calendar', component: CalendarPageComponent, canActivate: [authGuard, djGuard, profileGuard] },
  { path: 'search', component: SearchPageComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
