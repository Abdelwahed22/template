import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response';
import { FoundItemDto, CreateFoundItemDto, UpdateFoundItemDto } from '../models/item';

@Injectable({
    providedIn: 'root'
})
export class FoundItemService {
    private http = inject(HttpClient);
    private apiUrl = 'https://localhost:7282/api/FoundItems';

    getById(id: string): Observable<ApiResponse<FoundItemDto>> {
        return this.http.get<ApiResponse<FoundItemDto>>(`${this.apiUrl}/${id}`);
    }

    getMyItems(): Observable<ApiResponse<FoundItemDto[]>> {
        return this.http.get<ApiResponse<FoundItemDto[]>>(`${this.apiUrl}/my-items`);
    }

    create(data: CreateFoundItemDto): Observable<ApiResponse<FoundItemDto>> {
        return this.http.post<ApiResponse<FoundItemDto>>(this.apiUrl, data);
    }

    update(id: string, data: UpdateFoundItemDto): Observable<ApiResponse<FoundItemDto>> {
        return this.http.put<ApiResponse<FoundItemDto>>(`${this.apiUrl}/${id}`, data);
    }

    delete(id: string): Observable<ApiResponse<null>> {
        return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
    }
}
