import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { initFormio } from './core/formio';
import { AuthService } from './core/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    provideHttpClient(),

    // One-time Form.io setup (project URL, contrib bundle from jsDelivr).
    // Must complete BEFORE forms render so custom components are
    // registered when the renderer instantiates them.
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: () => () => initFormio(),
    },
    // Hydrate the auth user from any existing JWT before guards run.
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [AuthService],
      useFactory: (auth: AuthService) => async () => {
        await auth.refresh();
        auth.loading.set(false);
      },
    },
  ],
};
