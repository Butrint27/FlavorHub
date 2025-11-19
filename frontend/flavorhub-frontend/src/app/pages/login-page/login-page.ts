import { Component } from '@angular/core';
import { EmailInput } from '../../shared/inputs/email_input/input';
import { PasswordInput } from "../../shared/inputs/password-input/password-input";


@Component({
  selector: 'app-login-page',
  imports: [EmailInput, PasswordInput],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {  

}
