import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { merge } from 'rxjs';

@Component({
  selector: 'password-input',
  templateUrl: 'password-input.html',
  styleUrls: ['password-input.css'],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordInput {
  hide = signal(true);

  readonly password = new FormControl('', [Validators.required, Validators.minLength(6)]);
  errorMessage = signal('');

  constructor() {
    merge(this.password.statusChanges, this.password.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  updateErrorMessage() {
    if (this.password.hasError('required')) {
      this.errorMessage.set('You must enter a value'); // ✅ same as email
    } else if (this.password.hasError('minlength')) {
      this.errorMessage.set('Password must be at least 6 characters');
    } else {
      this.errorMessage.set('');
    }
  }
}





