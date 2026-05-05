import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormioModule } from '@formio/angular';
import { PageFrameComponent } from '../../shared/page-frame.component';
import { SectionHeadComponent } from '../../shared/section-head.component';
import { PROJECT_URL } from '../../core/formio';

@Component({
  selector: 'app-new-rental',
  standalone: true,
  imports: [PageFrameComponent, SectionHeadComponent, FormioModule],
  templateUrl: './new-rental.component.html',
  styleUrl: './new-rental.component.css',
})
export class NewRentalComponent {
  private router = inject(Router);
  readonly rentalUrl = `${PROJECT_URL}/carrental`;

  /**
   * Wizard button visibility — passed to the Form.io renderer via
   * [renderOptions], NOT [options]. The Angular wrapper's
   * getRendererOptions() cherry-picks a fixed set of keys from
   * [options] (i18n, icons, hooks, etc.) and silently drops
   * buttonSettings, but it spreads [renderOptions] verbatim into the
   * final config. Took a stack trace to figure that out — easy trap.
   *
   * Default Submit button is hidden so a custom "Confirm Reservation"
   * button on the last wizard page can replace it. Cancel/Previous/Next
   * stay on for normal navigation. Flip showSubmit to true to restore.
   */
  readonly formioRenderOptions = {
    buttonSettings: {
      showCancel: true,
      showPrevious: true,
      showNext: true,
      showSubmit: false,
    },
  };

  // (submit) fires AFTER the server save succeeds — safe to navigate.
  onSubmit(): void {
    this.router.navigate(['/dashboard'], { queryParams: { confirmed: 1 } });
  }
}
