// User profile DTOs
export interface UserProfileDto {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    profilePictureUrl?: string;
    createdAt: string;
    lostItemsCount: number;
    foundItemsCount: number;
}

export interface UpdateUserProfileDto {
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

// Admin user DTO
export interface AdminUserDto {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: string;
    isActive: boolean;
    createdAt: string;
}

export interface UpdateUserStatusDto {
    isActive: boolean;
}
