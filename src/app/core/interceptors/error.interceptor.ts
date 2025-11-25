import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { TokenService } from '../services/token.service';
import Swal from 'sweetalert2';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const tokenService = inject(TokenService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'حدث خطأ غير متوقع';

            if (error.error instanceof ErrorEvent) {
                // Client-side error
                errorMessage = `خطأ: ${error.error.message}`;
            } else {
                // Server-side error
                switch (error.status) {
                    case 0:
                        errorMessage = 'لا يمكن الاتصال بالخادم. تأكد من تشغيل الخادم وتوفر الإنترنت.';
                        break;
                    case 400:
                        errorMessage = error.error?.message || 'بيانات غير صحيحة';
                        break;
                    case 401:
                        errorMessage = 'يجب تسجيل الدخول أولاً';
                        tokenService.clearTokens();
                        router.navigate(['/login']);
                        break;
                    case 403:
                        errorMessage = 'ليس لديك صلاحية للوصول إلى هذا المحتوى';
                        break;
                    case 404:
                        errorMessage = 'المحتوى المطلوب غير موجود';
                        break;
                    case 500:
                        errorMessage = 'خطأ في الخادم، يرجى المحاولة لاحقاً';
                        break;
                    default:
                        errorMessage = error.error?.message || 'حدث خطأ غير متوقع';
                }
            }

            console.error('HTTP Error:', error);

            // Don't show alert for 401 errors (will redirect to login)
            if (error.status !== 401) {
                Swal.fire({
                    title: 'خطأ',
                    text: errorMessage,
                    icon: 'error',
                    confirmButtonText: 'حسناً'
                });
            }

            return throwError(() => error);
        })
    );
};
