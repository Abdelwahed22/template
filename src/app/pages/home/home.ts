import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TokenService } from '../../core/services/token.service';
import { LostItemService } from '../../core/services/lost-item.service';
import { User } from '../../core/models/auth';
import { LostItemDto } from '../../core/models/item';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './home.html',
    styleUrl: './home.css'
})
export class Home implements OnInit, OnDestroy {
    private tokenService = inject(TokenService);
    private lostItemService = inject(LostItemService);
    private router = inject(Router);
    private userSubscription?: Subscription;

    currentUser: User | null = null;
    lostItems: LostItemDto[] = [];
    isLoadingItems = false;

    ngOnInit() {
        this.userSubscription = this.tokenService.currentUser$.subscribe(user => {
            this.currentUser = user;
            if (this.currentUser) {
                this.loadLostItems();
            }
        });
    }

    ngOnDestroy() {
        this.userSubscription?.unsubscribe();
    }

    loadLostItems() {
        this.isLoadingItems = true;
        this.lostItemService.getFeed(20).subscribe({
            next: (res) => {
                this.isLoadingItems = false;
                if (res.isSuccess && res.data) {
                    this.lostItems = res.data;
                }
            },
            error: (err) => {
                this.isLoadingItems = false;
                console.error('Failed to load lost items:', err);
            }
        });
    }

    isAuthenticated(): boolean {
        return this.currentUser !== null;
    }

    helpOthers() {
        console.log('Help Others clicked - navigate to create found item page');
    }

    searchLost() {
        console.log('Search Lost clicked - navigate to lost items page');
    }

    getItemImageUrl(item: LostItemDto): string {
        if (item.imageUrl) {
            return item.imageUrl;
        }
        return 'images/placeholder-item.png';
    }

    getItemLocation(item: LostItemDto): string {
        return item.location?.city || 'غير محدد';
    }

    logout() {
        this.tokenService.clearTokens();
        this.router.navigate(['/login']);
    }
}
