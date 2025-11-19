import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {merge} from 'rxjs';


/** @title Form field with error messages */
@Component({
  selector: 'email-input',
  templateUrl: 'input.html',
  styleUrl: 'input.css',
  imports: [MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailInput {
  readonly email = new FormControl('', [Validators.required, Validators.email]);

  errorMessage = signal('');



}


