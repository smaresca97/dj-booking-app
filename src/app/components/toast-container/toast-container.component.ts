import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="toast-stack" aria-live="polite" aria-atomic="true">
      <button
        type="button"
        class="toast-message"
        *ngFor="let toast of toastService.messages()"
        [class.toast-success]="toast.type === 'success'"
        [class.toast-error]="toast.type === 'error'"
        [class.toast-info]="toast.type === 'info'"
        (click)="toastService.dismiss(toast.id)"
      >
        <span class="toast-dot"></span>
        <span>{{ toast.message }}</span>
      </button>
    </section>
  `
})
export class ToastContainerComponent {
  constructor(public toastService: ToastService) {}
}
