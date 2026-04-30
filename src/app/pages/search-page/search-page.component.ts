import { DjService } from '../../services/dj.service';
import { AvailabilityService } from '../../services/availability.service';

export class SearchPageComponent {
  selectedDate = new Date().toISOString().slice(0, 10);

  constructor(private djService: DjService, private availability: AvailabilityService) {}

  get results() {
    return this.djService
      .getDjs()
      .filter((dj) => this.availability.getAvailability(dj.id, this.selectedDate) === 'AVAILABLE')
      .map((dj) => ({ ...dj, status: 'AVAILABLE' as const }));
  }
}
