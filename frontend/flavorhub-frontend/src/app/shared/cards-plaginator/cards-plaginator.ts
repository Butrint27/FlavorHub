import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-cards-plaginator',
  templateUrl: './cards-plaginator.html',
  styleUrls: ['./cards-plaginator.css'],
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardsPlaginator implements AfterViewInit {
  @ViewChild('slider', { static: false }) slider!: ElementRef<HTMLDivElement>;

  cards = [
    { title: 'Shiba', description: 'Cute doggo', image: 'https://material.angular.dev/assets/img/examples/shiba2.jpg' },
    { title: 'Ginger', description: 'Another doggo', image: 'https://material.angular.dev/assets/img/examples/shiba1.jpg' },
    { title: 'Snowy', description: 'A snowy doggo', image: 'https://material.angular.dev/assets/img/examples/shiba2.jpg' },
    { title: 'Rocky', description: 'Strong doggo', image: 'https://material.angular.dev/assets/img/examples/shiba1.jpg' },
    { title: 'Niko', description: 'Happy doggo', image: 'https://material.angular.dev/assets/img/examples/shiba2.jpg' },
    { title: 'Leo', description: 'Lion doggo', image: 'https://material.angular.dev/assets/img/examples/shiba1.jpg' },
    { title: 'Momo', description: 'Fast doggo', image: 'https://material.angular.dev/assets/img/examples/shiba2.jpg' },
    { title: 'Kiki', description: 'Smart doggo', image: 'https://material.angular.dev/assets/img/examples/shiba1.jpg' },
  ];

  cardWidth = 0;

  ngAfterViewInit() {
    this.updateCardWidth();
    window.addEventListener('resize', () => this.updateCardWidth());
  }

  updateCardWidth() {
    if (this.slider) {
      const card = this.slider.nativeElement.querySelector('.slide-card') as HTMLElement;
      if (card) {
        this.cardWidth = card.offsetWidth + 16; // card width + gap
      }
    }
  }

  scrollLeft() {
    this.slider.nativeElement.scrollLeft -= this.cardWidth;
  }

  scrollRight() {
    this.slider.nativeElement.scrollLeft += this.cardWidth;
  }
}


