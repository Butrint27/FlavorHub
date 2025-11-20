import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'fullname-input',
  imports: [FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './fullname-input.html',
  styleUrl: './fullname-input.css',
})
export class FullnameInput {

  fullname: string = '';

  // Optional: could add errorMessage method like email
  errorMessage(): string {
    return 'Fullname is required';
  }
}
