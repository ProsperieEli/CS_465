import { Inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { BROWSER_STORAGE } from '../storage';
import { User } from '../models/user';
import { TripData } from './trip-data';

@Injectable({
  providedIn: 'root'
})
export class Authentication {
  constructor(
    @Inject(BROWSER_STORAGE) private storage: Storage,
    private tripData: TripData
  ) {}

  public getToken(): string {
    return this.storage.getItem('travlr-token') || '';
  }

  public saveToken(token: string): void {
    this.storage.setItem('travlr-token', token);
  }

  public logout(): void {
    this.storage.removeItem('travlr-token');
  }

  private getPayload(): any {
    const token = this.getToken();

    if (!token) {
      return null;
    }

    try {
      const encoded = token.split('.')[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/');

      const padded = encoded.padEnd(
        Math.ceil(encoded.length / 4) * 4,
        '='
      );

      return JSON.parse(atob(padded));
    } catch {
      return null;
    }
  }

  public isLoggedIn(): boolean {
    const payload = this.getPayload();

    return !!payload && payload.exp > Date.now() / 1000;
  }

  public getCurrentUser(): User | null {
    if (!this.isLoggedIn()) {
      return null;
    }

    const payload = this.getPayload();

    return {
      email: payload.email,
      name: payload.name
    };
  }

  public async login(user: User, password: string): Promise<void> {
    const response = await firstValueFrom(
      this.tripData.login(user, password)
    );

    this.saveToken(response.token);
  }

  public async register(user: User, password: string): Promise<void> {
    const response = await firstValueFrom(
      this.tripData.register(user, password)
    );

    this.saveToken(response.token);
  }
}