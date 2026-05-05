import { Component, Input, computed, input } from '@angular/core';
import type { Reservation } from '../core/formio';

function formatDate(raw: string | undefined): string {
  if (!raw) return '—';
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function locationLabel(loc: Reservation['data']['pickupLocation']): string {
  if (!loc) return '';
  if (typeof loc === 'string') return loc;
  return loc.formatted_address ?? '';
}

@Component({
  selector: 'app-reservation-row',
  standalone: true,
  template: `
    <a class="reservation-row" href="/dashboard" (click)="$event.preventDefault()">
      <div class="index">{{ num() }}</div>
      <div class="body">
        <div class="kicker-line">
          <span class="kicker kicker-accent">Pickup</span>
          <span class="kicker">&nbsp;·&nbsp; {{ pickup() }}</span>
        </div>
        <h3>{{ heading() }}</h3>
        <div class="meta">
          Return {{ ret() }}
          @if (pickupLoc()) {
            <span>&nbsp;·&nbsp; {{ pickupLoc() }}</span>
          }
        </div>
      </div>
      <div class="price">{{ price() }}</div>
    </a>
  `,
})
export class ReservationRowComponent {
  readonly reservation = input.required<Reservation>();
  readonly index = input.required<number>();

  readonly num = computed(() => String(this.index() + 1).padStart(2, '0'));
  readonly pickup = computed(() => formatDate(this.reservation().data.pickupDate as string | undefined));
  readonly ret = computed(() => formatDate(this.reservation().data.returnDate as string | undefined));
  readonly pickupLoc = computed(() => locationLabel(this.reservation().data.pickupLocation));
  readonly heading = computed(() => {
    const d = this.reservation().data;
    const make = (d.vehicleMake as string) ?? '';
    const model = (d.vehicleModel as string) ?? '';
    return make && model ? `${make} ${model}` : 'Reservation';
  });
  readonly price = computed(() => {
    const d = this.reservation().data;
    const total = (d.total as number | undefined) ?? (d.estimatedTotal as number | undefined);
    return typeof total === 'number' ? `$${total.toFixed(0)}` : '—';
  });
}
