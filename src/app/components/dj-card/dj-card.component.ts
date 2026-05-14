import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  photoUrl: string;
  status: Availability | null;
}

@Component({
  selector: 'app-dj-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button type="button" class="dj-result-card surface card-pad block w-full text-left" (click)="selected.emit(dj)">
      <div class="dj-result-glow" aria-hidden="true"></div>

      <div class="relative flex items-center gap-4">
        <div class="dj-result-photo">
          <img *ngIf="dj.photoUrl" [src]="dj.photoUrl" alt="" />
          <span *ngIf="!dj.photoUrl">{{ dj.avatar }}</span>
        </div>

        <div class="min-w-0 flex-1">
          <div class="flex min-w-0 items-start justify-between gap-3">
            <h3 class="status-text text-xl font-black">{{ dj.stageName }}</h3>
            <span class="availability-chip" *ngIf="dj.status === 'AVAILABLE'">
              <span class="availability-dot"></span>
              {{ statusLabel }}
            </span>
          </div>
          <p class="mt-1 truncate text-xs text-slate-400">{{ dj.city || dj.genres }}</p>
          <p class="mt-2 text-sm font-bold text-emerald-200" *ngIf="dj.status === 'AVAILABLE'">{{ i18n.t('readyForDate') }}</p>
        </div>
      </div>
    </button>
  `
})
export class DjCardComponent {
  @Input({ required: true }) dj!: DjCardViewModel;
  @Output() selected = new EventEmitter<DjCardViewModel>();

  constructor(public i18n: I18nService) {}

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
