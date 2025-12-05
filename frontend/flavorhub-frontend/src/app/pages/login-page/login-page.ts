import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService, DecodedToken } from '../../services/auth.service';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateEmailError());

    merge(this.password.statusChanges, this.password.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updatePasswordError());
  }

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);

  emailError = signal('');
  passwordError = signal('');
  hidePassword = signal(true);

  goHome() {
    this.router.navigate(['/']);
  }

  goRegister() {
    this.router.navigate(['/register']);
  }

  togglePasswordVisibility(event: MouseEvent) {
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
  }

  updateEmailError() {
    if (this.email.hasError('required')) {
      this.emailError.set('Email is required');
    } else if (this.email.hasError('email')) {
      this.emailError.set('Enter a valid email');
    } else {
      this.emailError.set('');
    }
  }

  updatePasswordError() {
    if (this.password.hasError('required')) {
      this.passwordError.set('Password is required');
    } else {
      this.passwordError.set('');
    }
  }

  login() {
    this.updateEmailError();
    this.updatePasswordError();

    if (this.email.invalid || this.password.invalid) return;

    this.authService.login({
      email: this.email.value!,
      password: this.password.value!,
    }).subscribe({
      next: () => {
        const user: DecodedToken | null = this.authService.getUser();
        this.snackBar.open(`Welcome, ${user?.fullName}!`, 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });

        this.router.navigate(['/main-page']);
      },
      error: () => {
        this.snackBar.open('Email or password is wrong', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }
}








