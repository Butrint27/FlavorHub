import { Routes } from '@angular/router';
import { HomePage } from './pages/home-page/home-page';
import { LoginPage } from './pages/login-page/login-page';
import { RegisterPage } from './pages/register-page/register-page';
import { MainPage } from './pages/main-page/main-page';
import { P } from '@angular/cdk/keycodes';
import { ProfilePage } from './pages/profile-page/profile-page';
import { ErrorPage } from './pages/error-page/error-page';
import { RepositoryPage } from './pages/repository-page/repository-page';

export const routes: Routes = [
 {
    path: '',
    component: HomePage,
  },
  {
    path: 'login',
    component: LoginPage
  },
  {
    path: 'register',
    component: RegisterPage
  },
  {
    path: 'main-page',
    component: MainPage
  },
  {
    path: 'profile',
    component: ProfilePage
  },
  {
    path: 'my-repositorys',
    component: RepositoryPage
  },
  {
    path: '**',
    component: ErrorPage
  }

];
