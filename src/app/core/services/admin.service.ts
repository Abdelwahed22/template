import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../models/pagination';
import { AdminUserDto, UpdateUserStatusDto } from '../models/user';
import { AdminStatisticsDto } from '../models/match';
import { LostItemDto, FoundItemDto } from '../models/item';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private http = inject(HttpClient);
    private apiUrl = 'https://localhost:7282/api/Admin';

    getUsers(pageNumber: number = 1, pageSize: number = 20): Observable<PaginatedResponse<AdminUserDto>> {
        const params = new HttpParams()
            .set('pageNumber', pageNumber.toString())
            .set('pageSize', pageSize.toString());

        return this.http.get<PaginatedResponse<AdminUserDto>>(`${this.apiUrl}/users`, { params });
    }

    getStatistics(): Observable<AdminStatisticsDto> {
        return this.http.get<AdminStatisticsDto>(`${this.apiUrl}/statistics`);
    }

    getItems(type: 'lost' | 'found' = 'lost', pageNumber: number = 1, pageSize: number = 20): Observable<PaginatedResponse<any>> {
        const params = new HttpParams()
            .set('type', type)
            .set('pageNumber', pageNumber.toString())
            .set('pageSize', pageSize.toString());

        return this.http.get<PaginatedResponse<any>>(`${this.apiUrl}/items`, { params });
    }

    updateUserStatus(userId: string, data: UpdateUserStatusDto): Observable<{ message: string }> {
        return this.http.put<{ message: string }>(`${this.apiUrl}/users/${userId}/status`, data);
    }
}
