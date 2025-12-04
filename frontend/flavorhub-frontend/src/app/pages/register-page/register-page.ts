import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './register-page.html',
  styleUrls: ['./register-page.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPage {
  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  // Form Controls
  fullname = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.minLength(6)]);

  // Error messages using signals
  fullnameError = signal('');
  emailError = signal('');
  passwordError = signal('');

  // Password toggle
  hidePassword = signal(true);

  goLogin() {
    this.router.navigate(['/login']);
  }

  togglePasswordVisibility(event: MouseEvent) {
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
  }

  updateFullnameError() {
    if (this.fullname.hasError('required')) {
      this.fullnameError.set('Fullname is required');
    } else {
      this.fullnameError.set('');
    }
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
    } else if (this.password.hasError('minlength')) {
      this.passwordError.set('Password must be at least 6 characters');
    } else {
      this.passwordError.set('');
    }
  }

  register() {
    // Update error messages
    this.updateFullnameError();
    this.updateEmailError();
    this.updatePasswordError();

    if (this.fullname.invalid || this.email.invalid || this.password.invalid) {
      return;
    }

    // Call AuthService
    this.authService
      .register({
        fullName: this.fullname.value as string,
        email: this.email.value as string,
        password: this.password.value as string,
      })
      .subscribe({
        next: (res) => {
          this.snackBar.open('Registration successful!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar'],
          });
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.snackBar.open('Registration failed. Try again.', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar'],
          });
        },
      });
  }
}






