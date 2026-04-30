export type Availability = 'AVAILABLE' | 'NOT_AVAILABLE';

export class AvailabilityService {
  private key = 'dj-availability';

  private read(): Record<string, Record<string, Availability>> {
    return JSON.parse(localStorage.getItem(this.key) || '{}');
  }

  private write(data: Record<string, Record<string, Availability>>): void {
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  setAvailability(djId: string, date: string, value: Availability): void {
    const data = this.read();
    data[djId] = data[djId] || {};
    data[djId][date] = value;
    this.write(data);
  }

  getAvailability(djId: string, date: string): Availability | null {
    const data = this.read();
    return data[djId]?.[date] || null;
  }

  getAvailableDjs(date: string, djIds: string[]): string[] {
    return djIds.filter((id) => this.getAvailability(id, date) === 'AVAILABLE');
  }
}
