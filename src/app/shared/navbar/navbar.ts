import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TokenService } from '../../core/services/token.service';
import { User } from '../../core/models/auth';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive],
    templateUrl: './navbar.html',
    styleUrl: './navbar.css'
})
export class Navbar implements OnInit, OnDestroy {
    private tokenService = inject(TokenService);
    private router = inject(Router);
    private userSubscription?: Subscription;

    currentUser: User | null = null;
    isDropdownOpen = false;
    defaultProfilePicture = 'images/Default User Icon.jpg';

    ngOnInit() {
        // Subscribe to user changes
        this.userSubscription = this.tokenService.currentUser$.subscribe(user => {
            this.currentUser = user;
        });
    }

    ngOnDestroy() {
        this.userSubscription?.unsubscribe();
    }

    getProfilePictureUrl(): string {
        return this.currentUser?.profilePictureUrl || this.defaultProfilePicture;
    }

    isAdmin(): boolean {
        return this.currentUser?.email === 'admin@talaqi.com';
    }

    toggleDropdown() {
        this.isDropdownOpen = !this.isDropdownOpen;
    }

    closeDropdown() {
        this.isDropdownOpen = false;
    }

    logout() {
        this.tokenService.clearTokens();
        this.closeDropdown();
        this.router.navigate(['/login']);
    }
}
