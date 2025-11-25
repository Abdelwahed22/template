import { Routes } from '@angular/router';
import { Register } from './pages/register/register';
import { Verify } from './pages/verify/verify';
import { Login } from './pages/login/login';
import { ForgotPassword } from './pages/forgot-password/forgot-password';
import { ResetPassword } from './pages/reset-password/reset-password';
import { Home } from './pages/home/home';
import { EditProfile } from './pages/edit-profile/edit-profile';
import { AdminPanel } from './pages/admin-panel/admin-panel';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'register', component: Register },
  { path: 'verify', component: Verify },
  { path: 'login', component: Login },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'reset-password', component: ResetPassword },
  { path: 'home', component: Home },
  { path: 'edit-profile', component: EditProfile, canActivate: [authGuard] },
  { path: 'admin-panel', component: AdminPanel, canActivate: [authGuard, adminGuard] },
];
