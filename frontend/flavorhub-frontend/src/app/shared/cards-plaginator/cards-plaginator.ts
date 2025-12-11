import { Component, HostListener, OnInit, Input, OnChanges, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RepositoryService } from '../../services/repository.service';
import { AuthService } from '../../services/auth.service';
import { LikesService } from '../../services/likes.service';
import { CommentsService, CreateCommentDto, Comment } from '../../services/comments.service';
import { FollowersService, Follower } from '../../services/followers.service';

export interface Card {
  id: number;
  title: string;
  image?: string;
  ingredients: string;
  dishType: string;
  description: string;
  userId: number;
  avatar?: string;
  liked?: boolean;
  followed?: boolean;
  comments?: string[];
}

@Component({
  selector: 'app-cards-plaginator',
  templateUrl: './cards-plaginator.html',
  styleUrls: ['./cards-plaginator.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    RouterModule,
    FormsModule
  ],
})
export class CardsPlaginator implements OnInit, OnChanges {
  @Input() allCards: Card[] | null = null;
  cards: Card[] = [];
  currentPage = 0;
  cardsPerPage = 5;

  constructor(
    private dialog: MatDialog,
    private repositoryService: RepositoryService,
    private authService: AuthService,
    private likesService: LikesService,
    private followersService: FollowersService
  ) {}

  ngOnInit(): void {
    this.updateCardsPerPage();
    if (!this.allCards) this.loadCards();
    else this.cards = this.allCards;

    this.loadLikes();
  }

  ngOnChanges(): void {
    if (this.allCards) {
      this.cards = this.allCards;
      this.currentPage = 0;
      this.updateCardsPerPage();
      this.loadAvatars();
      this.loadLikes();
      this.loadFollowedUsers();
    }
  }

  @HostListener('window:resize')
  onResize(): void { this.updateCardsPerPage(true); }

  updateCardsPerPage(keepVisibleCard = false): void {
    const width = window.innerWidth;
    let newCardsPerPage = 4;
    if (width < 600) newCardsPerPage = 1;
    else if (width < 1024) newCardsPerPage = 2;

    if (keepVisibleCard) {
      const firstIndex = this.currentPage * this.cardsPerPage;
      this.currentPage = Math.floor(firstIndex / newCardsPerPage);
    }

    this.cardsPerPage = newCardsPerPage;
    if (this.currentPage >= this.totalPages) this.currentPage = this.totalPages - 1;
  }

  get totalPages() { return Math.ceil(this.cards.length / this.cardsPerPage); }

  get visibleCards() {
    const start = this.currentPage * this.cardsPerPage;
    return this.cards.slice(start, start + this.cardsPerPage);
  }

  prevPage() { if (this.currentPage > 0) this.currentPage--; }
  nextPage() { if (this.currentPage < this.totalPages - 1) this.currentPage++; }

  // ===========================
  // LIKE BUTTON ACTION
  // ===========================
  toggleLike(card: Card, event?: Event) {
    if (event) event.stopPropagation();
    const previous = !!card.liked;
    card.liked = !previous;

    const user = this.authService.getUser();
    if (!user?.sub) { card.liked = previous; return; }

    if (previous) {
      this.likesService.updateLikeByUser(user.sub, card.id, card.liked).subscribe({
        next: res => { if (res && typeof res.isLiked === 'boolean') card.liked = res.isLiked; },
        error: () => { card.liked = previous; }
      });
    } else {
      this.likesService.create({ repositoryId: card.id, isLiked: card.liked }).subscribe({
        next: res => { if (res && typeof res.isLiked === 'boolean') card.liked = res.isLiked; },
        error: () => { card.liked = previous; }
      });
    }
  }

  // ===========================
  // FOLLOW BUTTON ACTION
  // ===========================
  loadFollowedUsers(): void {
    const user = this.authService.getUser();
    if (!user?.sub) return;

    this.followersService.findByUserId(user.sub).subscribe({
      next: (follows: Follower[]) => {
        const followedIds = follows.map(f => f.followsUser.id);
        this.cards.forEach(card => card.followed = followedIds.includes(card.userId));
      },
      error: err => console.error('Error loading followed users', err)
    });
  }

  toggleFollow(card: Card, event?: Event) {
    if (event) event.stopPropagation();
    const user = this.authService.getUser();
    if (!user?.sub || card.userId === user.sub) return;

    if (card.followed) return; // already following

    const prev = card.followed;
    card.followed = true;

    const dto = { userId: user.sub, followsUserId: card.userId };
    this.followersService.create(dto).subscribe({
      next: () => console.log(`Followed user ${card.userId}`),
      error: () => card.followed = prev
    });
  }

  // ===========================
  // MODALS
  // ===========================
  openModal(card: Card) { this.dialog.open(CardModal, { data: card, width: '95%', maxWidth: '650px' }); }
  openComments(card: Card) { this.dialog.open(CommentsModal, { data: card, width: '95%', maxWidth: '650px' }); }
  openUserModal(userId: number) { this.dialog.open(UserPreviewModal, { data: { userId }, width: '95%', maxWidth: '380px' }); }

  loadCards(): void {
    this.repositoryService.getAllRepositories().subscribe({
      next: (res) => {
        if (res?.success && Array.isArray(res.data)) {
          this.cards = res.data.map((repo: any) => ({
            id: Number(repo.id),
            title: repo.title,
            ingredients: repo.ingredience,
            dishType: repo.dishType,
            description: repo.description,
            userId: Number(repo.userId),
            liked: false,
            followed: false,
            comments: [],
            image: repo.image?.data ? `data:image/png;base64,${this.arrayBufferToBase64(repo.image.data)}` : ''
          }));
          this.loadAvatars();
          this.loadFollowedUsers(); // mark followed users here
        }
      },
      error: (err) => console.error('Error loading repositories', err),
    });
  }

  loadLikes(): void {
    this.likesService.getLikesByUser().subscribe({
      next: likes => {
        likes.forEach(like => {
          const card = this.cards.find(c => c.id === like.repository.id);
          if (card) card.liked = like.isLiked;
        });
      },
      error: err => console.error('Error loading likes', err)
    });
  }

  loadAvatars(): void {
    this.cards.forEach(card => {
      this.authService.getAvatar(card.userId).subscribe({
        next: avatarBase64 => card.avatar = avatarBase64,
        error: () => card.avatar = ''
      });
    });
  }

  private arrayBufferToBase64(buffer: any): string {
    if (!buffer) return '';
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
    return window.btoa(binary);
  }
}


/* ================= COMMENTS MODAL ================= */
@Component({
  selector: 'comments-modal',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, FormsModule],
  template: `
    <div class="comments-modal-container">
      <h2 class="title">Comments</h2>

      <div class="comments-box" *ngIf="comments?.length; else noComments">
        <div *ngFor="let c of comments" class="comment-item">
          <mat-icon class="comment-icon">account_circle</mat-icon>
          <span>{{ c.user?.fullName || 'Unknown' }}: {{ c.content }}</span>
        </div>
      </div>

      <ng-template #noComments>
        <p class="no-comments">No comments yet. Be the first to comment!</p>
      </ng-template>

      <div class="input-container">
        <input
          type="text"
          placeholder="Write a comment..."
          [(ngModel)]="newComment"
          (keydown.enter)="addComment()"
        />
        <button mat-icon-button color="primary" aria-label="Send comment" (click)="addComment()">
          <mat-icon>send</mat-icon>
        </button>
      </div>

      <div class="comments-actions">
        <button mat-stroked-button color="warn" (click)="close()">Close</button>
      </div>
    </div>
  `,
  styleUrls: ['./cards-plaginator.css']
})
export class CommentsModal implements OnInit {
  newComment: string = '';
  comments: Comment[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Card,
    private dialogRef: MatDialogRef<CommentsModal>,
    private commentsService: CommentsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    if (!this.data.id) return;

    this.commentsService.getCommentsByRepository(this.data.id).subscribe({
      next: (res: Comment[]) => this.comments = res,
      error: err => {
        console.error('Error loading comments', err);
        this.comments = [];
      }
    });
  }

  addComment(): void {
    const trimmed = this.newComment.trim();
    if (!trimmed) return;

    const user = this.authService.getUser();
    if (!user?.sub) {
      console.error('User not logged in');
      return;
    }

    const dto: CreateCommentDto = {
      content: trimmed,
      userId: user.sub,
      repositoryId: this.data.id
    };

    this.commentsService.createComment(dto).subscribe({
      next: (res: Comment) => {
        this.comments.push(res); // add the new comment
        this.newComment = '';
      },
      error: err => console.error('Error posting comment', err)
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}


/* ================= CARD MODAL ================= */
@Component({
  selector: 'card-modal',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatIconModule],
  template: `
    <div class="modal-header"><h2>{{data.title}}</h2></div>
    <img [src]="data.image" class="modal-image">
    <p><strong>Ingredients:</strong> {{data.ingredients}}</p>
    <p><strong>Dish Type:</strong> {{data.dishType}}</p>
    <p><strong>Description:</strong> {{data.description}}</p>
    <div class="modal-user" style="display: none"><strong>User ID:</strong> {{data.userId}}</div>
    <div class="modal-actions">
      <button mat-icon-button (click)="toggleLike(); $event.stopPropagation()">
        <mat-icon>{{ data.liked ? 'favorite' : 'favorite_border' }}</mat-icon>
      </button>
      <button mat-button color="primary" (click)="toggleFollow()">
        {{ data.followed ? 'Following' : 'Follow' }}
      </button>
      <button mat-button color="accent" (click)="close()">Close</button>
    </div>
  `
})
export class CardModal {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Card,
    private dialogRef: MatDialogRef<CardModal>,
    private likesService: LikesService,
    private authService: AuthService
  ) {}

  close() { this.dialogRef.close(); }

  toggleLike() {
    const prev = !!this.data.liked;
    this.data.liked = !prev;

    const user = this.authService.getUser();
    if (!user?.sub) { this.data.liked = prev; return; }

    if (prev) {
      this.likesService.updateLikeByUser(user.sub, this.data.id, this.data.liked).subscribe({
        next: res => { if (res && typeof res.isLiked === 'boolean') this.data.liked = res.isLiked; },
        error: () => { this.data.liked = prev; }
      });
    } else {
      this.likesService.create({ repositoryId: this.data.id, isLiked: this.data.liked }).subscribe({
        next: res => { if (res && typeof res.isLiked === 'boolean') this.data.liked = res.isLiked; },
        error: () => { this.data.liked = prev; }
      });
    }
  }

  toggleFollow() { this.data.followed = !this.data.followed; }
}

/* ================= USER PREVIEW MODAL ================= */
@Component({
  selector: 'user-preview-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <div class="user-preview-container" *ngIf="!loading && user">
      <div class="up-avatar-box">
        <img [src]="user.avatar || ''" class="up-avatar">
      </div>
      <h2 class="up-name">{{ user.fullName }}</h2>
      <p class="up-email">{{ user.email }}</p>
      <button mat-button color="primary" (click)="close()">Close</button>
    </div>
    <div class="up-spinner" *ngIf="loading"></div>
  `,
  styles: [`
    .user-preview-container { text-align:center; padding:20px; }
    .up-avatar-box { width:130px; height:130px; margin:auto; border-radius:50%; overflow:hidden; border:3px solid #C9B59C; }
    .up-avatar { width:100%; height:100%; object-fit:cover; }
    .up-name { margin-top:12px; font-size:22px; font-weight:600; }
    .up-email { font-size:15px; color:#555; margin-bottom:20px; }
    .up-spinner { margin:auto; width:40px; height:40px; border-radius:50%; border:4px solid #ddd; border-top-color:#3f51b5; animation: spin 0.8s linear infinite; }
    @keyframes spin { 100% { transform: rotate(360deg); } }
  `]
})
export class UserPreviewModal implements OnInit {
  user: { fullName: string; email: string; avatar?: string } | null = null;
  loading = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { userId: number },
    private authService: AuthService,
    private dialogRef: MatDialogRef<UserPreviewModal>
  ) {}

  ngOnInit() {
    this.authService.getUserById(this.data.userId).subscribe({
      next: user => {
        this.user = user;
        this.authService.getAvatar(this.data.userId).subscribe({
          next: avatarBase64 => { if(this.user) this.user.avatar = avatarBase64; this.loading = false; },
          error: () => { this.loading = false; }
        });
      },
      error: () => { this.loading = false; this.user = { fullName: 'Unknown', email: 'Unknown' }; }
    });
  }

  close() { this.dialogRef.close(); }
}


















































