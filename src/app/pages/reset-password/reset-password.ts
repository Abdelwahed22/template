import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ResetPasswordDto } from '../../core/models/auth';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './reset-password.html',
    styleUrl: './reset-password.css'
})
export class ResetPassword implements OnInit {
    private fb = inject(FormBuilder);
    private auth = inject(AuthService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    email = '';
    isSubmitting = false;

    resetPasswordForm = this.fb.group({
        code: ['', [Validators.required, Validators.minLength(6)]],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]]
    });

    ngOnInit() {
        this.email = this.route.snapshot.queryParams['email'] || '';

        if (!this.email) {
            this.router.navigate(['/forgot-password']);
        }
    }

    onSubmit() {
        if (this.resetPasswordForm.invalid) {
            this.resetPasswordForm.markAllAsTouched();
            return;
        }

        // Check if passwords match
        const newPassword = this.resetPasswordForm.get('newPassword')?.value || '';
        const confirmPassword = this.resetPasswordForm.get('confirmPassword')?.value || '';

        if (newPassword !== confirmPassword) {
            Swal.fire({
                title: 'خطأ',
                text: 'كلمات المرور غير متطابقة',
                icon: 'error',
                confirmButtonText: 'حسناً'
            });
            return;
        }

        this.isSubmitting = true;
        const request: ResetPasswordDto = {
            email: this.email,
            code: this.resetPasswordForm.get('code')?.value || '',
            newPassword: newPassword,
            confirmPassword: confirmPassword
        };

        this.auth.resetPassword(request).subscribe({
            next: (res) => {
                this.isSubmitting = false;
                if (res.isSuccess) {
                    Swal.fire({
                        title: 'تم التحديث! ✅',
                        text: 'تم تغيير كلمة المرور بنجاح',
                        icon: 'success',
                        confirmButtonText: 'تسجيل الدخول',
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    }).then((result) => {
                        if (result.isConfirmed || result.isDismissed) {
                            this.router.navigate(['/login']);
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

    get f() { return this.resetPasswordForm.controls; }
}
