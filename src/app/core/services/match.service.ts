import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response';
import { MatchDto, UpdateMatchStatusDto } from '../models/match';

@Injectable({
    providedIn: 'root'
})
export class MatchService {
    private http = inject(HttpClient);
    private apiUrl = 'https://localhost:7282/api/Matches';

    getMyMatches(): Observable<ApiResponse<MatchDto[]>> {
        return this.http.get<ApiResponse<MatchDto[]>>(`${this.apiUrl}/my-matches`);
    }

    getById(id: string): Observable<ApiResponse<MatchDto>> {
        return this.http.get<ApiResponse<MatchDto>>(`${this.apiUrl}/${id}`);
    }

    updateStatus(id: string, data: UpdateMatchStatusDto): Observable<ApiResponse<MatchDto>> {
        return this.http.put<ApiResponse<MatchDto>>(`${this.apiUrl}/${id}/status`, data);
    }
}
