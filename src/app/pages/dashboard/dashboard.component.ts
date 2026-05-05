import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PageFrameComponent } from '../../shared/page-frame.component';
import { SectionHeadComponent } from '../../shared/section-head.component';
import { ReservationRowComponent } from '../../shared/reservation-row.component';
import { ToastComponent } from '../../shared/toast.component';
import { AuthService } from '../../core/auth.service';
import { Formio, PROJECT_URL, type Reservation } from '../../core/formio';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    PageFrameComponent,
    SectionHeadComponent,
    ReservationRowComponent,
    ToastComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  readonly reservations = signal<Reservation[] | null>(null);
  readonly loadError = signal<string | null>(null);
  readonly confirmed = signal(false);

  readonly firstName = computed(() => {
    const u = this.auth.user();
    return (u?.data?.['firstName'] as string | undefined) ?? 'there';
  });

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    if (params.get('confirmed') === '1') {
      this.confirmed.set(true);
      this.router.navigate(['/dashboard'], { replaceUrl: true });
    }
    this.loadReservations();
  }

  async loadReservations(): Promise<void> {
    const user = this.auth.user();
    if (!user) return;
    this.loadError.set(null);
    try {
      const rentalForm = new Formio(`${PROJECT_URL}/carrental`);
      const rows = (await (rentalForm as unknown as {
        loadSubmissions: (opts: unknown) => Promise<unknown>;
      }).loadSubmissions({
        params: { owner: user._id, limit: 50, sort: '-created' },
      })) as Reservation[];
      this.reservations.set(rows);
    } catch (err) {
      console.error('Failed to load reservations', err);
      const status = (err as { status?: number })?.status;
      if (status === 401) {
        await this.auth.logout();
        this.router.navigate(['/login'], { queryParams: { expired: 1 } });
        return;
      }
      this.loadError.set(`Couldn't load your reservations.`);
      this.reservations.set([]);
    }
  }

  dismissToast(): void {
    this.loadError.set(null);
  }
}
