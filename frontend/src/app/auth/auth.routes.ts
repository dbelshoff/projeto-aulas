import { Routes } from '@angular/router';
import { SignupComponent } from './signup.component';
import { SigninComponent } from './signin.component';
import { LogoutComponent } from './logout.component';

export const AUTH_ROUTES: Routes = [
  { path: '', redirectTo: 'signup', pathMatch: 'full' },
  {
    path: 'signup',
    title: 'Autenticação | Signup',
    component: SignupComponent,
  },
  {
    path: 'signin',
    title: 'Autenticação | Signin',
    component: SigninComponent,
  },
  {
    path: 'logout',
    title: 'Autenticação | Logout',
    component: LogoutComponent,
  },
];
