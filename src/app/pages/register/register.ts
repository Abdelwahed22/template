import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TokenService } from '../../core/services/token.service';
import { RegisterRequest } from '../../core/models/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private tokenService = inject(TokenService);
  private router = inject(Router);

  isSubmitting = false;

  registerForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(3)]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  });

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const request = this.registerForm.value as RegisterRequest;

    this.auth.register(request).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        if (res.isSuccess) {
          // Store tokens
          this.tokenService.saveTokens(res.data);

          Swal.fire({
            title: 'تم إنشاء الحساب! 📧',
            text: 'تم إرسال كود التفعيل إلى بريدك الإلكتروني',
            icon: 'success',
            confirmButtonText: 'تفعيل الحساب',
            allowOutsideClick: false,
            allowEscapeKey: false
          }).then((result) => {
            if (result.isConfirmed || result.isDismissed) {
              this.router.navigateByUrl(`/verify?email=${request.email}`);
            }
          });
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        // Error is handled by error interceptor
      }
    });
  }

  get f() { return this.registerForm.controls; }
}