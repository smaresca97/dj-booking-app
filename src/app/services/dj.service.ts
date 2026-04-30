export interface DjProfile { id: string; name: string; avatar: string; }

export class DjService {
  private djs: DjProfile[] = [
    { id: 'marco', name: 'DJ Marco', avatar: '🎧' },
    { id: 'luca', name: 'DJ Luca', avatar: '🎛️' },
    { id: 'erika', name: 'DJ Erika', avatar: '🎚️' }
  ];

  getDjs(): DjProfile[] { return this.djs; }
}
