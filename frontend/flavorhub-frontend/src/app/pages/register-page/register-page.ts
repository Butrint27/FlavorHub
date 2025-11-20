import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EmailInput } from "../../shared/inputs/email_input/input";
import { PasswordInput } from "../../shared/inputs/password-input/password-input";
import { FullnameInput } from "../../shared/inputs/fullname-input/fullname-input";
import { RegisterButton } from "../../shared/buttons/register-button/register-button";

@Component({
  selector: 'app-register-page',
  imports: [EmailInput, PasswordInput, FullnameInput, RegisterButton],
  templateUrl: './register-page.html',
  styleUrls: ['./register-page.css'],
})
export class RegisterPage {

  constructor(private router: Router) {}

  goLogin() {
    this.router.navigate(['/login']);
  }

}

