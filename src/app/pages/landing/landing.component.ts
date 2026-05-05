import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageFrameComponent } from '../../shared/page-frame.component';
import { AuthService } from '../../core/auth.service';

function currentSeason(): string {
  const month = new Date().getMonth();
  if (month <= 1 || month === 11) return 'Winter';
  if (month <= 4) return 'Spring';
  if (month <= 7) return 'Summer';
  return 'Fall';
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, PageFrameComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent {
  private auth = inject(AuthService);

  readonly issueLabel = `Available now · ${currentSeason()} fleet`;
  readonly user = this.auth.user;
}
