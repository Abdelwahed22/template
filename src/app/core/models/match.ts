import { LostItemDto } from './item';
import { FoundItemDto } from './item';

// Match status enum
export enum MatchStatus {
    Pending = 'Pending',
    Confirmed = 'Confirmed',
    Rejected = 'Rejected',
    Completed = 'Completed'
}

// Match DTO
export interface MatchDto {
    id: string;
    lostItemId: string;
    foundItemId: string;
    confidenceScore: number;
    status: MatchStatus;
    createdAt: string;
    lostItem?: LostItemDto;
    foundItem?: FoundItemDto;
}

// Update match status DTO
export interface UpdateMatchStatusDto {
    status: MatchStatus;
}

// Admin statistics DTO
export interface AdminStatisticsDto {
    users: {
        total: number;
        active: number;
    };
    items: {
        lost: number;
        found: number;
    };
    matches: {
        total: number;
        pending: number;
    };
}
