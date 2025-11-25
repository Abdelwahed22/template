import { LocationDto } from './location';

// Item status enums
export enum LostItemStatus {
    Active = 'Active',
    Found = 'Found',
    Closed = 'Closed'
}

export enum FoundItemStatus {
    Available = 'Available',
    Returned = 'Returned',
    Closed = 'Closed'
}

// Item categories
export type ItemCategory =
    | 'Electronics'
    | 'Documents'
    | 'Jewelry'
    | 'Clothing'
    | 'Keys'
    | 'Bags'
    | 'Pets'
    | 'Other';

// Base item interface
interface BaseItem {
    id: string;
    userId: string;
    userName: string;
    category: ItemCategory;
    title: string;
    description: string;
    imageUrl?: string;
    location: LocationDto;
    contactInfo: string;
    createdAt: string;
}

// Lost Item DTOs
export interface LostItemDto extends BaseItem {
    userProfilePicture?: string;
    dateLost: string;
    status: LostItemStatus;
    matchCount: number;
}

export interface CreateLostItemDto {
    category: ItemCategory;
    title: string;
    description: string;
    imageUrl?: string;
    location: LocationDto;
    dateLost: string;
    contactInfo: string;
}

export interface UpdateLostItemDto {
    title: string;
    description: string;
    imageUrl?: string;
    location: LocationDto;
    contactInfo: string;
    status: LostItemStatus;
}

// Found Item DTOs
export interface FoundItemDto extends BaseItem {
    dateFound: string;
    status: FoundItemStatus;
}

export interface CreateFoundItemDto {
    category: ItemCategory;
    title: string;
    description: string;
    imageUrl?: string;
    location: LocationDto;
    dateFound: string;
    contactInfo: string;
}

export interface UpdateFoundItemDto {
    title: string;
    description: string;
    imageUrl?: string;
    location: LocationDto;
    contactInfo: string;
    status: FoundItemStatus;
}
