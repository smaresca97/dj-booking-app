import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Availability } from '../../services/availability.service';
import { I18nService } from '../../services/i18n.service';

export interface DjCardViewModel {
  id: string;
  stageName: string;
  phone: string;
  city: string;
  genres: string;
  bio: string;
  avatar: string;
  status: Availability | null;
}

@Component({
  selector: 'app-dj-card',
  standalone: true,
  template: `
    <button type="button" class="surface card-pad block w-full text-left transition hover:border-cyan-300" (click)="selected.emit(dj)">
      <div class="flex items-center gap-4">
        <div class="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-slate-800 text-3xl">{{ dj.avatar }}</div>
        <div class="min-w-0">
          <h3 class="status-text text-xl font-black">{{ dj.stageName }}</h3>
          <p class="mt-1 truncate text-xs text-slate-400">{{ dj.city || dj.genres }}</p>
          <p
            class="mt-1 text-sm"
            [class.text-emerald-300]="dj.status === 'AVAILABLE'"
            [class.text-pink-400]="dj.status === 'NOT_AVAILABLE'"
            [class.text-slate-400]="!dj.status"
          >
            {{ statusLabel }}
          </p>
        </div>
      </div>
    </button>
  `
})
export class DjCardComponent {
  @Input({ required: true }) dj!: DjCardViewModel;
  @Output() selected = new EventEmitter<DjCardViewModel>();

  constructor(private i18n: I18nService) {}

  get statusLabel(): string {
    if (this.dj.status === 'AVAILABLE') {
      return this.i18n.t('available');
    }

    if (this.dj.status === 'NOT_AVAILABLE') {
      return this.i18n.t('notAvailable');
    }

    return this.i18n.t('noStatus');
  }
}
