import { Formio } from '@formio/js';

export const PROJECT_URL = 'https://formio-product-overview.form.io';

// Hosted contrib bundle, commit-pinned. Branch URLs are subject to
// jsDelivr's ~12hr cache, so during active development we pin to a
// specific commit SHA to guarantee the latest build is loaded.
// Bump CONTRIB_REF after each contrib push.
const CONTRIB_REF = '3d80aff';
const CONTRIB_JS_URL =
  `https://cdn.jsdelivr.net/gh/emeryporter/card-component@${CONTRIB_REF}/dist/formio-contrib.use.min.js`;
const CONTRIB_CSS_URL =
  `https://cdn.jsdelivr.net/gh/emeryporter/card-component@${CONTRIB_REF}/dist/formio-contrib.css`;

let initialized = false;

/**
 * Call once at bootstrap. Sets Form.io's base URL and dynamically loads
 * the contrib bundle from jsDelivr — this is the same URL configured at
 * the Form.io project level for the portal builder, giving us a single
 * source of truth instead of a parallel npm install.
 */
export async function initFormio(): Promise<void> {
  if (initialized) return;
  initialized = true;

  Formio.setProjectUrl(PROJECT_URL);
  Formio.setBaseUrl(PROJECT_URL);

  // contrib's UMD bundle reads `window.Formio` (configured as an
  // external in its webpack build). The ESM import above pulls in the
  // class but doesn't auto-assign to window. Set it explicitly so the
  // bundle's Formio.use() call reaches the same instance the app uses.
  (window as unknown as { Formio: unknown }).Formio = Formio;

  loadStylesheet(CONTRIB_CSS_URL);
  await loadScript(CONTRIB_JS_URL);
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.onload = () => resolve();
    script.onerror = () => resolve();
    document.head.appendChild(script);
  });
}

function loadStylesheet(href: string): void {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

export { Formio };

export type FormioUser = {
  _id: string;
  data: {
    email?: string;
    firstName?: string;
    lastName?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

export type Reservation = {
  _id: string;
  created: string;
  modified: string;
  data: {
    vehicleMake?: string;
    vehicleModel?: string;
    dailyRate?: number;
    pickupDate?: string;
    returnDate?: string;
    pickupLocation?: { formatted_address?: string } | string;
    returnLocation?: { formatted_address?: string } | string;
    total?: number;
    estimatedTotal?: number;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};
