import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-confirm-button',
  imports: [MatButtonModule, MatDividerModule, MatIconModule],
  templateUrl: './confirm-button.html',
  styleUrl: './confirm-button.css',
})
export class ConfirmButton {

}
