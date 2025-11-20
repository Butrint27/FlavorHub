import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EmailInput } from '../../shared/inputs/email_input/input';
import { PasswordInput } from "../../shared/inputs/password-input/password-input";
import { ConfirmButton } from "../../shared/buttons/confirm-button/confirm-button";

@Component({
  selector: 'app-login-page',
  imports: [EmailInput, PasswordInput, ConfirmButton],
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.css'],
})
export class LoginPage {  

  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']);
  }

  goRegister() {
    this.router.navigate(['/register']);
  }
}

