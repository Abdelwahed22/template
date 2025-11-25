import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TokenService } from '../../core/services/token.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private tokenService = inject(TokenService);
  private router = inject(Router);

  isSubmitting = false;

  // فورم الدخول
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const credentials = {
      email: this.loginForm.get('email')?.value || '',
      password: this.loginForm.get('password')?.value || ''
    };

    this.auth.login(credentials).subscribe({
      next: (res) => {
        this.isSubmitting = false;

        if (res.isSuccess) {
          // Store tokens using TokenService
          this.tokenService.saveTokens(res.data);

          // Welcome message
          Swal.fire({
            title: 'أهلاً بك! 👋',
            text: 'تم تسجيل الدخول بنجاح',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          }).then(() => {
            // Navigate to home
            this.router.navigate(['/home']);
          });
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        // Error is handled by error interceptor
      }
    });
  }

  get f() { return this.loginForm.controls; }
}