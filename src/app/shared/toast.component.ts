import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="toast" role="status">
      <span>{{ message }}</span>
      @if (actionLabel) {
        <button type="button" (click)="action.emit()">{{ actionLabel }}</button>
      }
      <button type="button" (click)="dismiss.emit()">Dismiss</button>
    </div>
  `,
})
export class ToastComponent {
  @Input({ required: true }) message!: string;
  @Input() actionLabel: string | null = null;
  @Output() action = new EventEmitter<void>();
  @Output() dismiss = new EventEmitter<void>();
}
