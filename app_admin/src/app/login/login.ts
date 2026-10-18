import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Authentication } from '../services/authentication.service';
import { User } from '../models/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  public email = '';
  public password = '';
  public errorMessage = '';
  public submitting = false;

  constructor(
    private authentication: Authentication,
    private router: Router
  ) {}

  public async onLoginSubmit(): Promise<void> {
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Email and password are required';
      return;
    }

    this.submitting = true;

    const user: User = {
      email: this.email,
      name: ''
    };

    try {
      await this.authentication.login(user, this.password);
      await this.router.navigate(['/']);
    } catch (err: any) {
      this.errorMessage =
        err.error?.message || 'Unable to log in. Please try again.';
    } finally {
      this.submitting = false;
    }
  }
}