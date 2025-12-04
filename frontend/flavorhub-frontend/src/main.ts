import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { RegisterPage } from './app/pages/register-page/register-page';
import { LoginPage } from './app/pages/login-page/login-page';
import { HomePage } from './app/pages/home-page/home-page';
import { MainPage } from './app/pages/main-page/main-page';
import { ProfilePage } from './app/pages/profile-page/profile-page';
import { RepositoryPage } from './app/pages/repository-page/repository-page';
import { ErrorPage } from './app/pages/error-page/error-page';

bootstrapApplication(App, {
  providers: [
    provideHttpClient(), // ✅ Provides HttpClient globally
    importProvidersFrom(
      MatSnackBarModule,
      ReactiveFormsModule
    ),
    provideRouter([
      { path: '', component: HomePage },
      { path: 'login', component: LoginPage },
      { path: 'register', component: RegisterPage },
      { path: 'main-page', component: MainPage },
      { path: 'profile', component: ProfilePage },
      { path: 'my-repositorys', component: RepositoryPage },
      { path: '**', component: ErrorPage }
    ])
  ]
}).catch(err => console.error(err));


