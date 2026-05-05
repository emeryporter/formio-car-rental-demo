import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormioModule } from '@formio/angular';
import { PageFrameComponent } from '../../shared/page-frame.component';
import { AuthService } from '../../core/auth.service';
import { PROJECT_URL } from '../../core/formio';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, PageFrameComponent, FormioModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  readonly loginUrl = `${PROJECT_URL}/user/login`;
  readonly banner = signal<string | null>(null);
  readonly bannerWarn = signal(false);

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    if (params.get('expired') === '1') {
      this.banner.set('Your session expired. Please sign in again.');
      this.bannerWarn.set(true);
    } else if (params.get('registered') === '1') {
      this.banner.set('Your account was created. Sign in to continue.');
      this.bannerWarn.set(false);
    }
  }

  // (submit) fires AFTER a successful server save — the login action has
  // already issued the JWT at this point, so refresh picks up the user.
  async onSubmit(): Promise<void> {
    const current = await this.auth.refresh();
    if (current) {
      this.router.navigate(['/dashboard']);
    } else {
      this.banner.set(`Signed in, but the session didn't stick. Please try again.`);
      this.bannerWarn.set(true);
    }
  }
}
