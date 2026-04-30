export interface DjCardViewModel {
  name: string;
  avatar: string;
  status: 'AVAILABLE' | 'NOT_AVAILABLE';
}

export class DjCardComponent {
  constructor(public dj: DjCardViewModel) {}

  render(): string {
    return `<article class="neon-card p-6 transition hover:scale-[1.02]">
      <div class="text-5xl">${this.dj.avatar}</div>
      <h3 class="mt-3 text-2xl font-bold">${this.dj.name}</h3>
      <p class="mt-2 ${this.dj.status === 'AVAILABLE' ? 'text-cyan-300' : 'text-pink-400'}">${this.dj.status}</p>
    </article>`;
  }
}
