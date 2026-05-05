import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormioModule } from '@formio/angular';
import { PageFrameComponent } from '../../shared/page-frame.component';
import { AuthService } from '../../core/auth.service';
import { PROJECT_URL } from '../../core/formio';

type MaybeCreds = { email?: string; password?: string };

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, PageFrameComponent, FormioModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  readonly registerUrl = `${PROJECT_URL}/user/register`;
  readonly banner = signal<string | null>(null);

  private pendingCreds: { email: string; password: string } | null = null;

  // (beforeSubmit) fires BEFORE the server save with the raw submission —
  // the password is still present here. We capture it for the auto-login
  // fallback in onSubmit below.
  onBeforeSubmit(event: { data?: MaybeCreds }): void {
    const email = event?.data?.email;
    const password = event?.data?.password;
    if (email && password) this.pendingCreds = { email, password };
  }

  // (submit) fires AFTER a successful server save. If the register action
  // issued a JWT, auth.refresh() picks it up. Otherwise we try to log in
  // with the creds captured above.
  async onSubmit(): Promise<void> {
    const current = await this.auth.refresh();
    if (current) {
      this.router.navigate(['/dashboard']);
      return;
    }

    const creds = this.pendingCreds;
    if (!creds) {
      this.banner.set('Account created. Please sign in.');
      this.router.navigate(['/login'], { queryParams: { registered: 1 } });
      return;
    }
    try {
      await this.auth.login(creds.email, creds.password);
      this.router.navigate(['/dashboard']);
    } catch {
      this.banner.set('Account created, but automatic sign-in failed. Please sign in manually.');
      this.router.navigate(['/login'], { queryParams: { registered: 1 } });
    }
  }
}
