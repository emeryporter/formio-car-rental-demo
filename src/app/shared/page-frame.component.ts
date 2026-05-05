import { Component, Input } from '@angular/core';
import { NavComponent } from './nav.component';

@Component({
  selector: 'app-page-frame',
  standalone: true,
  imports: [NavComponent],
  template: `
    <div class="page">
      <app-nav />
      @if (issueLabel !== null) {
        <div class="issue-strip">
          <span>{{ issueLabel }}</span>
          <span>{{ today }}</span>
        </div>
      }
      <main>
        <ng-content />
      </main>
    </div>
  `,
})
export class PageFrameComponent {
  @Input() issueLabel: string | null = null;

  readonly today = new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
