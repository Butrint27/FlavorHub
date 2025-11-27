import { Component, HostListener, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

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
    ReactiveFormsModule
  ],
})
export class CardsPlaginator implements OnInit {

  cards: Card[] = Array.from({ length: 16 }, (_, i) => ({
    id: i + 1,
    title: `Delicious Dish ${i + 1}`,
    image: 'https://material.angular.dev/assets/img/examples/shiba2.jpg',
    ingredients: 'Tomatoes, Cheese, Basil, Olive Oil',
    dishType: 'Italian',
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, urna eu tincidunt consectetur, nisi nisl aliquam nunc, eget dapibus orci erat vitae elit.`,
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
      const firstVisibleIndex = this.currentPage * this.cardsPerPage;
      this.currentPage = Math.floor(firstVisibleIndex / newCardsPerPage);
    }

    this.cardsPerPage = newCardsPerPage;
    if (this.currentPage >= this.totalPages) this.currentPage = Math.max(this.totalPages - 1, 0);
  }

  get totalPages(): number {
    return Math.ceil(this.cards.length / this.cardsPerPage);
  }

  get visibleCards(): Card[] {
    const start = this.currentPage * this.cardsPerPage;
    return this.cards.slice(start, start + this.cardsPerPage);
  }

  prevPage(): void {
    if (this.currentPage > 0) this.currentPage--;
  }

  nextPage(): void {
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
      width: '90%',
      maxWidth: '500px',
    });
  }

  openComments(card: Card) {
    this.dialog.open(CommentsModal, {
      data: card,
      width: '90%',
      maxWidth: '500px',
    });
  }
}


/* ---------------------------
      CARD DETAILS MODAL
----------------------------*/
@Component({
  selector: 'card-modal',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatIconModule, RouterModule],
  template: `
    <div class="modal-header">
      <h2>{{data.title}}</h2>
    </div>
    <img [src]="data.image" alt="Dish Image" class="modal-image">
    <p><strong>Ingredients:</strong> {{data.ingredients}}</p>
    <p><strong>Dish Type:</strong> {{data.dishType}}</p>

    <p><strong>Description:</strong></p>
    <div class="modal-description">{{data.description}}</div>

    <div class="modal-actions">
      <button mat-icon-button (click)="toggleLike()">
        <mat-icon [color]="data.liked ? 'warn' : ''">
          {{ data.liked ? 'favorite' : 'favorite_border' }}
        </mat-icon>
      </button>

      <button mat-button color="primary" (click)="toggleFollow()">
        {{ data.followed ? 'Following' : 'Follow' }}
      </button>

      <button mat-button color="accent" (click)="close()">Close</button>
    </div>
  `,
  styles: [`
    .modal-header { margin-bottom: 15px; text-align: left; }
    .modal-image {
      width: 100%; border-radius: 8px;
      max-height: 300px; object-fit: cover;
      margin-bottom: 15px;
    }
    .modal-description {
      max-height: 200px; overflow-y: auto;
      background: #f9f9f9; padding: 10px;
      border-radius: 6px; margin-bottom: 15px;
      border: 1px solid #ddd;
    }
    .modal-actions {
      display: flex; justify-content: space-between; align-items: center;
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


/* ---------------------------
         COMMENTS MODAL
----------------------------*/
@Component({
  selector: 'comments-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatCardModule,
    ReactiveFormsModule
  ],
  template: `
    <h2 class="modal-title">Comments</h2>

    <div class="comments-list">
      <p *ngIf="(data.comments?.length ?? 0) === 0" class="no-comments">
        No comments yet. Be the first!
      </p>

      <mat-card class="comment-item" *ngFor="let c of data.comments">
        <mat-icon>person</mat-icon>
        <span>{{ c }}</span>
      </mat-card>
    </div>

    <textarea [formControl]="commentControl" placeholder="Write a comment..."></textarea>

    <div class="modal-actions">
      <button mat-button color="primary" (click)="addComment()">Post</button>
      <button mat-button color="accent" (click)="close()">Close</button>
    </div>
  `,
  styles: [`
    .modal-title {
      margin-bottom: 15px;
      text-align: center;
    }
    .comments-list {
      max-height: 250px;
      overflow-y: auto;
      border-radius: 6px;
      margin-bottom: 15px;
    }
    .comment-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px;
      margin-bottom: 10px;
    }
    textarea {
      width: 100%;
      height: 80px;
      border-radius: 6px;
      padding: 10px;
      border: 1px solid #ccc;
      resize: none;
      margin-bottom: 15px;
      font-family: inherit;
      font-size: 14px;
    }
    .no-comments {
      color: #777;
      text-align: center;
      padding: 10px 0;
    }
    .modal-actions {
      display: flex;
      justify-content: space-between;
    }
  `]
})
export class CommentsModal {
  commentControl = new FormControl('');

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Card,
    private dialogRef: MatDialogRef<CommentsModal>
  ) {
    // Ensure comments is always an array to avoid runtime/TS issues
    if (!this.data.comments) this.data.comments = [];
  }

  addComment() {
    const val = (this.commentControl.value ?? '').toString().trim();
    if (!val) return;
    this.data.comments!.push(val);
    this.commentControl.setValue('');
  }

  close() { this.dialogRef.close(); }
}






























