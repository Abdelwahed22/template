import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ForgotPasswordDto } from '../../core/models/auth';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './forgot-password.html',
    styleUrl: './forgot-password.css'
})
export class ForgotPassword {
    private fb = inject(FormBuilder);
    private auth = inject(AuthService);
    private router = inject(Router);

    isSubmitting = false;

    forgotPasswordForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]]
    });

    onSubmit() {
        if (this.forgotPasswordForm.invalid) {
            this.forgotPasswordForm.markAllAsTouched();
            return;
        }

        this.isSubmitting = true;
        const request: ForgotPasswordDto = {
            email: this.forgotPasswordForm.get('email')?.value || ''
        };

        this.auth.forgotPassword(request).subscribe({
            next: (res) => {
                this.isSubmitting = false;
                if (res.isSuccess) {
                    Swal.fire({
                        title: 'تم الإرسال! 📧',
                        text: 'تم إرسال كود إعادة تعيين كلمة المرور إلى بريدك الإلكتروني',
                        icon: 'success',
                        confirmButtonText: 'إعادة تعيين كلمة المرور',
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    }).then((result) => {
                        if (result.isConfirmed || result.isDismissed) {
                            this.router.navigate(['/reset-password'], {
                                queryParams: { email: request.email }
                            });
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

    get f() { return this.forgotPasswordForm.controls; }
}
