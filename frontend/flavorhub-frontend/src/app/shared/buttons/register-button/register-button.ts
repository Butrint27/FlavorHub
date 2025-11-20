import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register-button',
  imports: [MatButtonModule, MatDividerModule, MatIconModule],
  templateUrl: './register-button.html',
  styleUrl: './register-button.css',
})
export class RegisterButton {

}
