import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule],
  template: `
    <main class="min-h-screen flex items-center justify-center bg-slate-950 text-white p-6">
      <section class="w-full max-w-md rounded-2xl border border-fuchsia-500/40 shadow-[0_0_40px_rgba(217,70,239,.25)] bg-slate-900/70 backdrop-blur p-8">
        <h1 class="text-4xl font-black mb-2">DJ BOOKING</h1>
        <p class="text-slate-300 mb-6">Login area artisti</p>
        <input [(ngModel)]="username" placeholder="Username" class="w-full mb-3 p-3 rounded bg-slate-800" />
        <input [(ngModel)]="password" type="password" placeholder="Password" class="w-full mb-4 p-3 rounded bg-slate-800" />
        <button (click)="submit()" class="w-full py-3 rounded bg-gradient-to-r from-fuchsia-500 to-cyan-500 font-bold">ENTRA</button>
        <p class="text-pink-300 mt-3" *ngIf="error()">Credenziali non valide</p>
      </section>
    </main>
  `
})
export class LoginPageComponent {
  username = '';
  password = '';
  error = signal(false);

  constructor(private auth: AuthService, private router: Router) {}

  submit(): void {
    this.error.set(false);
    if (this.auth.login(this.username, this.password)) {
      this.router.navigateByUrl('/dashboard');
      return;
    }
    this.error.set(true);
  }
}
