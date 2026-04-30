import { AvailabilityService, Availability } from '../../services/availability.service';

export class CalendarPageComponent {
  selectedDate = new Date().toISOString().slice(0, 10);
  status: Availability = 'AVAILABLE';

  constructor(private availability: AvailabilityService, private djId: string) {}

  setStatus(status: Availability): void {
    this.status = status;
    this.availability.setAvailability(this.djId, this.selectedDate, status);
  }

  get currentStatus(): Availability | null {
    return this.availability.getAvailability(this.djId, this.selectedDate);
  }
}
