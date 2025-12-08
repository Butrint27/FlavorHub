import { Component, HostListener, OnInit, Input, Inject, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RepositoryService } from '../../services/repository.service';

export interface Card {
  id: number;
  title: string;
  image?: string;
  ingredients: string;
  dishType: string;
  description: string;
  liked?: boolean;
  avatar?: string;
  followed?: boolean;
  comments?: string[];
  userId?: number;
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
  @Input() allCards: Card[] | null = null;  // NEW Input to receive cards from MainPage
  cards: Card[] = [];
  currentPage = 0;
  cardsPerPage = 5;

  constructor(private dialog: MatDialog, private repositoryService: RepositoryService) {}

  ngOnInit(): void {
    this.updateCardsPerPage();
    if (!this.allCards) {
      this.loadCards();
    } else {
      this.cards = this.allCards;
    }
  }

  ngOnChanges(): void {
    if (this.allCards) {
      this.cards = this.allCards;
      this.currentPage = 0;
      this.updateCardsPerPage();
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateCardsPerPage(true);
  }

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

    if (this.currentPage >= this.totalPages) {
      this.currentPage = this.totalPages - 1;
    }
  }

  get totalPages() {
    return Math.ceil(this.cards.length / this.cardsPerPage);
  }

  get visibleCards() {
    const start = this.currentPage * this.cardsPerPage;
    return this.cards.slice(start, start + this.cardsPerPage);
  }

  prevPage() {
    if (this.currentPage > 0) this.currentPage--;
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) this.currentPage++;
  }

  toggleLike(card: Card) {
    card.liked = !card.liked;
  }

  toggleFollow(card: Card) {
    card.followed = !card.followed;
  }

  openModal(card: Card) {
    this.dialog.open(CardModal, {
      data: card,
      width: '95%',
      maxWidth: '650px',
    });
  }

  openComments(card: Card) {
    this.dialog.open(CommentsModal, {
      data: card,
      width: '95%',
      maxWidth: '650px',
    });
  }

  loadCards() {
    this.repositoryService.getAllRepositories().subscribe({
      next: (res) => {
        if (res && res.success && Array.isArray(res.data)) {
          this.cards = res.data.map((repo: any) => ({
            id: repo.id,
            title: repo.title,
            ingredients: repo.ingredience,
            dishType: repo.dishType,
            description: repo.description,
            liked: false,
            followed: false,
            comments: [],
            avatar: 'https://material.angular.dev/assets/img/examples/shiba2.jpg',
            image: repo.image
              ? `data:image/png;base64,${this.arrayBufferToBase64(repo.image.data)}`
              : 'https://material.angular.dev/assets/img/examples/shiba2.jpg'
          }));
          this.currentPage = 0;
          this.updateCardsPerPage();
        }
      },
      error: (err) => console.error(err),
    });
  }

  arrayBufferToBase64(buffer: any) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
}

/* ================= COMMENTS MODAL ================= */
@Component({
  selector: 'comments-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, FormsModule],
  template: `
    <div class="modal-container">
      <h2 class="title">Comments</h2>
      <div class="comments-box">
        <div *ngFor="let c of data.comments" class="comment-item">{{ c }}</div>
      </div>
      <div class="input-container">
        <input type="text" placeholder="Write a comment..." [(ngModel)]="newComment">
        <button mat-icon-button (click)="addComment()">
          <mat-icon>send</mat-icon>
        </button>
      </div>
      <div class="actions">
        <button mat-button (click)="close()">Close</button>
      </div>
    </div>
  `,
  styles: [/* keep your styles here */]
})
export class CommentsModal {
  newComment = '';
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<CommentsModal>) {}
  addComment() {
    if (this.newComment.trim()) {
      this.data.comments.push(this.newComment.trim());
      this.newComment = '';
    }
  }
  close() { this.dialogRef.close(); }
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
    <div class="modal-description">{{data.description}}</div>
    <div class="modal-actions">
      <button mat-icon-button (click)="toggleLike()">
        <mat-icon>{{ data.liked ? 'favorite' : 'favorite_border' }}</mat-icon>
      </button>
      <button mat-button color="primary" (click)="toggleFollow()">
        {{ data.followed ? 'Following' : 'Follow' }}
      </button>
      <button mat-button color="accent" (click)="close()">Close</button>
    </div>
  `,
  styles: [/* keep your styles here */]
})
export class CardModal {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<CardModal>) {}
  close() { this.dialogRef.close(); }
  toggleLike() { this.data.liked = !this.data.liked; }
  toggleFollow() { this.data.followed = !this.data.followed; }
}



































