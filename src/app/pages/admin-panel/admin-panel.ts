import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';
import { AdminStatisticsDto } from '../../core/models/match';
import { AdminUserDto, UpdateUserStatusDto } from '../../core/models/user';
import { PaginatedResponse } from '../../core/models/pagination';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-admin-panel',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './admin-panel.html',
    styleUrl: './admin-panel.css'
})
export class AdminPanel implements OnInit {
    private adminService = inject(AdminService);

    statistics: AdminStatisticsDto | null = null;
    loadingStats = true;

    users: AdminUserDto[] = [];
    usersPage = 1;
    usersPageSize = 20;
    totalUsers = 0;
    loadingUsers = false;
    searchQuery = '';

    activeTab: 'lost' | 'found' = 'lost';
    items: any[] = [];
    itemsPage = 1;
    itemsPageSize = 20;
    totalItems = 0;
    loadingItems = false;

    Math = Math;

    ngOnInit() {
        this.loadStatistics();
        this.loadUsers();
        this.loadItems();
    }

    loadStatistics() {
        this.loadingStats = true;
        this.adminService.getStatistics().subscribe({
            next: (data) => {
                this.loadingStats = false;
                this.statistics = data;
            },
            error: (err) => {
                this.loadingStats = false;
                console.error('Failed to load statistics:', err);
            }
        });
    }

    loadUsers() {
        this.loadingUsers = true;
        this.adminService.getUsers(this.usersPage, this.usersPageSize).subscribe({
            next: (response: PaginatedResponse<AdminUserDto>) => {
                this.loadingUsers = false;
                this.users = response.items;
                this.totalUsers = response.totalCount;
            },
            error: (err) => {
                this.loadingUsers = false;
                console.error('Failed to load users:', err);
            }
        });
    }

    get filteredUsers(): AdminUserDto[] {
        if (!this.searchQuery) {
            return this.users;
        }
        const query = this.searchQuery.toLowerCase();
        return this.users.filter(user =>
            user.firstName.toLowerCase().includes(query) ||
            user.lastName.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query)
        );
    }

    toggleUserStatus(user: AdminUserDto) {
        const action = user.isActive ? 'حظر' : 'إلغاء حظر';

        Swal.fire({
            title: `${action} المستخدم؟`,
            text: `هل أنت متأكد من ${action} ${user.firstName} ${user.lastName}؟`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: `نعم، ${action}`,
            cancelButtonText: 'إلغاء'
        }).then((result) => {
            if (result.isConfirmed) {
                const updateData: UpdateUserStatusDto = {
                    isActive: !user.isActive
                };

                this.adminService.updateUserStatus(user.id, updateData).subscribe({
                    next: () => {
                        user.isActive = !user.isActive;
                        Swal.fire({
                            title: 'تم بنجاح!',
                            text: `تم ${action} المستخدم`,
                            icon: 'success',
                            timer: 2000,
                            showConfirmButton: false
                        });
                    },
                    error: (err) => {
                        Swal.fire({
                            title: 'خطأ',
                            text: `فشل ${action} المستخدم`,
                            icon: 'error',
                            confirmButtonText: 'حسناً'
                        });
                    }
                });
            }
        });
    }

    nextUsersPage() {
        if (this.usersPage * this.usersPageSize < this.totalUsers) {
            this.usersPage++;
            this.loadUsers();
        }
    }

    prevUsersPage() {
        if (this.usersPage > 1) {
            this.usersPage--;
            this.loadUsers();
        }
    }

    switchTab(tab: 'lost' | 'found') {
        this.activeTab = tab;
        this.itemsPage = 1;
        this.loadItems();
    }

    loadItems() {
        this.loadingItems = true;
        this.adminService.getItems(this.activeTab, this.itemsPage, this.itemsPageSize).subscribe({
            next: (response: PaginatedResponse<any>) => {
                this.loadingItems = false;
                this.items = response.items;
                this.totalItems = response.totalCount;
            },
            error: (err) => {
                this.loadingItems = false;
                console.error('Failed to load items:', err);
            }
        });
    }

    nextItemsPage() {
        if (this.itemsPage * this.itemsPageSize < this.totalItems) {
            this.itemsPage++;
            this.loadItems();
        }
    }

    prevItemsPage() {
        if (this.itemsPage > 1) {
            this.itemsPage--;
            this.loadItems();
        }
    }

    get totalUsersPages(): number {
        return Math.ceil(this.totalUsers / this.usersPageSize);
    }

    get totalItemsPages(): number {
        return Math.ceil(this.totalItems / this.itemsPageSize);
    }
}
