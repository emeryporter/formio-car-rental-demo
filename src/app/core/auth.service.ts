import { Injectable, signal } from '@angular/core';
import { Formio, PROJECT_URL, type FormioUser } from './formio';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly user = signal<FormioUser | null>(null);
  readonly loading = signal(true);

  async refresh(): Promise<FormioUser | null> {
    try {
      const token = Formio.getToken();
      if (!token) {
        this.user.set(null);
        return null;
      }
      const current = (await Formio.currentUser()) as FormioUser;
      this.user.set(current);
      return current;
    } catch {
      this.user.set(null);
      return null;
    }
  }

  async login(email: string, password: string): Promise<FormioUser> {
    const loginForm = new Formio(`${PROJECT_URL}/user/login`);
    await (loginForm as unknown as { saveSubmission: (s: { data: unknown }) => Promise<unknown> })
      .saveSubmission({ data: { email, password } });
    const current = (await Formio.currentUser()) as FormioUser;
    this.user.set(current);
    return current;
  }

  async logout(): Promise<void> {
    try {
      await Formio.logout();
    } catch {
      // ignore — clearing local state either way
    }
    Formio.setToken('');
    this.user.set(null);
  }
}
