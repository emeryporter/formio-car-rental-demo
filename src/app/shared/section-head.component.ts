import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-section-head',
  standalone: true,
  template: `
    <div class="section-head">
      <div>
        <div class="section-number">{{ number }}</div>
        <div class="section-label">{{ label }}</div>
      </div>
      <h2 class="section-title">{{ title }}</h2>
    </div>
  `,
})
export class SectionHeadComponent {
  @Input({ required: true }) number!: string;
  @Input({ required: true }) label!: string;
  @Input({ required: true }) title!: string;
}
