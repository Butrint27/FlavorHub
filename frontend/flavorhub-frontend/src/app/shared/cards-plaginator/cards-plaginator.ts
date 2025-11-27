import { Component, HostListener, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Card {
  id: number;
  title: string;
  image: string;
  ingredients: string;
  dishType: string;
  description: string;
  liked?: boolean;
  avatar?: string;
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
export class CardsPlaginator implements OnInit {
  cards: Card[] = Array.from({ length: 16 }, (_, i) => ({
    id: i + 1,
    title: `Delicious Dish ${i + 1}`,
    image: 'https://material.angular.dev/assets/img/examples/shiba2.jpg',
    ingredients: 'Tomatoes, Cheese, Basil, Olive Oil',
    dishType: 'Italian',
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit...`,
    liked: false,
    avatar: 'https://material.angular.dev/assets/img/examples/shiba2.jpg',
    followed: false,
    comments: []
  }));

  currentPage = 0;
  cardsPerPage = 5;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.updateCardsPerPage();
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
      maxWidth: '650px', /* bigger modal */
    });
  }

  openComments(card: Card) {
    this.dialog.open(CommentsModal, {
      data: card,
      width: '95%',
      maxWidth: '650px',
    });
  }
}

/* ================================
   COMMENTS MODAL
================================= */

@Component({
  selector: 'comments-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, FormsModule],
  template: `
    <div class="modal-container">
      <h2 class="title">Comments</h2>

      <div class="comments-box">
        <div *ngFor="let c of data.comments" class="comment-item">
          {{ c }}
        </div>
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
  styles: [`
    .modal-container {
      padding: 20px;
    }
    .title {
      margin-bottom: 15px;
      text-align: center;
    }
    .comments-box {
      max-height: 250px;
      overflow-y: auto;
      border: 1px solid #ccc;
      border-radius: 6px;
      padding: 10px;
      background: #fafafa;
      margin-bottom: 15px;
    }
    .comment-item {
      padding: 8px;
      margin-bottom: 6px;
      background: #fff;
      border-radius: 6px;
      border: 1px solid #eee;
    }
    .input-container {
      display: flex;
      gap: 8px;
    }
    input {
      flex: 1;
      padding: 10px;
      border-radius: 6px;
      border: 1px solid #ccc;
    }
    .actions {
      margin-top: 15px;
      text-align: center;
    }
  `]
})
export class CommentsModal {
  newComment = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CommentsModal>
  ) {}

  addComment() {
    if (this.newComment.trim().length > 0) {
      this.data.comments.push(this.newComment.trim());
      this.newComment = '';
    }
  }

  close() {
    this.dialogRef.close();
  }
}

/* ===================================
   ORIGINAL CARD MODAL (unchanged)
===================================== */

@Component({
  selector: 'card-modal',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatIconModule],
  template: `
    <div class="modal-header">
      <h2>{{data.title}}</h2>
    </div>
    <img [src]="data.image" class="modal-image">

    <p><strong>Ingredients:</strong> {{data.ingredients}}</p>
    <p><strong>Dish Type:</strong> {{data.dishType}}</p>

    <div class="modal-description">
      {{data.description}}
    </div>

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
  styles: [`
    .modal-header { margin-bottom: 10px; }
    .modal-image {
      width: 100%;
      max-height: 300px;
      object-fit: cover;
      border-radius: 6px;
      margin-bottom: 12px;
    }
    .modal-description {
      max-height: 200px;
      overflow-y: auto;
      padding: 10px;
      border-radius: 6px;
      background: #f3f3f3;
      margin-bottom: 15px;
    }
    .modal-actions {
      display: flex;
      justify-content: space-between;
    }
  `]
})
export class CardModal {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CardModal>
  ) {}

  close() { this.dialogRef.close(); }
  toggleLike() { this.data.liked = !this.data.liked; }
  toggleFollow() { this.data.followed = !this.data.followed; }
}































