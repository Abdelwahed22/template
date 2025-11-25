import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../core/services/auth.service';


@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './verify.html',
  styleUrl: './verify.css'
})
export class Verify implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(AuthService);

  email = '';
  isSubmitting = false;

  verifyForm = this.fb.group({
    code: ['', [Validators.required, Validators.minLength(6)]]
  });

  ngOnInit() {
    this.email = this.route.snapshot.queryParams['email'] || '';

    if (!this.email) {
      this.router.navigate(['/register']);
    }
  }

  onSubmit() {
    if (this.verifyForm.invalid) return;

    this.isSubmitting = true;

    const requestData = {
      email: this.email,
      code: this.verifyForm.get('code')?.value || ''
    };

    this.auth.verifyEmail(requestData).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        if (res.isSuccess) {
          Swal.fire({
            title: 'تم التفعيل بنجاح! 🚀',
            text: 'أهلاً بك في تلاقي.. يمكنك تسجيل الدخول الآن',
            icon: 'success',
            confirmButtonText: 'دخول'
          }).then(() => {
            this.router.navigate(['/login']);
          });
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        Swal.fire({
          title: 'كود خاطئ',
          text: 'تأكد من كتابة الكود بشكل صحيح من بريدك الإلكتروني',
          icon: 'error',
          confirmButtonText: 'حاول مرة أخرى'
        });
      }
    });
  }
}