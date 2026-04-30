import { AuthService } from '../../services/auth.service';

export class DjDashboardComponent {
  constructor(private auth: AuthService) {}

  get djName(): string {
    return this.auth.getCurrentDj() || 'DJ';
  }

  links = [
    { label: 'Calendar', route: '/calendar' },
    { label: 'Availability', route: '/calendar' },
    { label: 'Search bookings', route: '/search' }
  ];
}
