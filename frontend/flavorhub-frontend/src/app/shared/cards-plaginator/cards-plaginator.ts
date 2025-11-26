import { Component, HostListener, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface Card {
  id: number;
  title: string;
  image: string;
  ingredients: string;
  dishType: string;
  description: string;
  liked?: boolean;
}

@Component({
  selector: 'app-cards-plaginator',
  templateUrl: './cards-plaginator.html',
  styleUrls: ['./cards-plaginator.css'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatDialogModule],
})
export class CardsPlaginator implements OnInit {
  cards: Card[] = Array.from({ length: 16 }, (_, i) => ({
    id: i + 1,
    title: `Delicious Dish ${i + 1}`,
    image: 'https://material.angular.dev/assets/img/examples/shiba2.jpg',
    ingredients: 'Tomatoes, Cheese, Basil, Olive Oil',
    dishType: 'Italian',
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, urna eu tincidunt consectetur, nisi nisl aliquam nunc, eget dapibus orci erat vitae elit. Suspendisse potenti. Sed vulputate sapien ut ligula fermentum, non tincidunt massa pretium. Integer vel lorem vel lectus feugiat consectetur. Curabitur id urna et lectus mattis blandit. Praesent sit amet dolor et turpis dictum ultrices. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec eget sem eget risus tincidunt commodo. Aliquam erat volutpat. Proin eget nulla sed leo lacinia commodo. Quisque ut purus nec nisl venenatis posuere in nec justo. Mauris faucibus, metus a congue facilisis, enim justo sagittis leo, sed tincidunt libero purus at nisl. Sed euismod ligula vitae felis dictum, sed gravida sapien sollicitudin. Etiam id arcu sit amet purus fringilla vestibulum. Curabitur consectetur sapien vitae magna pellentesque, a egestas erat facilisis.`,
    liked: false
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
    let newCardsPerPage = 5;
    if (width < 600) newCardsPerPage = 1;
    else if (width < 1024) newCardsPerPage = 2;

    if (keepVisibleCard) {
      const firstVisibleIndex = this.currentPage * this.cardsPerPage;
      this.currentPage = Math.floor(firstVisibleIndex / newCardsPerPage);
    }

    this.cardsPerPage = newCardsPerPage;
    if (this.currentPage >= this.totalPages) this.currentPage = this.totalPages - 1;
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

  openModal(card: Card) {
    this.dialog.open(CardModal, {
      data: card,
      width: '90%',
      maxWidth: '500px',
    });
  }
}

/** Modal component */
@Component({
  selector: 'card-modal',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatIconModule],
  template: `
    <h2>{{data.title}}</h2>
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
      <button mat-button color="primary" (click)="close()">Close</button>
    </div>
  `,
  styles: [`
    img.modal-image {
      width: 100%;
      max-height: 300px;
      object-fit: cover;
      margin-bottom: 15px;
      border-radius: 8px;
    }
    h2 { margin-top: 0; }
    p { margin: 5px 0; }

    .modal-description {
      max-height: 200px;
      overflow-y: auto;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 6px;
      white-space: pre-wrap;
      background: #f9f9f9;
      margin-bottom: 15px;
    }

    .modal-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
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
}




























