import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav class="nav">
      <a routerLink="/" class="brand">drift<span class="dot">.</span></a>
      <div class="nav-right">
        @if (user(); as u) {
          @if (firstName()) {
            <span class="user">{{ firstName() }}</span>
          }
          <a routerLink="/dashboard">Dashboard</a>
          <a routerLink="/new">New rental</a>
          <button type="button" (click)="onLogout()">Sign out</button>
        } @else {
          <a routerLink="/login">Sign in</a>
          <a routerLink="/register">Register</a>
        }
      </div>
    </nav>
  `,
})
export class NavComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  readonly user = this.auth.user;
  readonly firstName = computed(() => {
    const u = this.auth.user();
    return (u?.data?.['firstName'] as string | undefined) ?? '';
  });

  async onLogout(): Promise<void> {
    await this.auth.logout();
    this.router.navigate(['/']);
  }
}
