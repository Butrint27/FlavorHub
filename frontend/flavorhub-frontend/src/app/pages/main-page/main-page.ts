import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenav } from '@angular/material/sidenav';
import { ToolbarMenu } from '../../shared/toolbar-menu/toolbar-menu';
import { CardsPlaginator, Card } from '../../shared/cards-plaginator/cards-plaginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { RepositoryService } from '../../services/repository.service';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [CommonModule, ToolbarMenu, MatSidenavModule, MatButtonModule, CardsPlaginator],
  templateUrl: './main-page.html',
  styleUrls: ['./main-page.css']
})
export class MainPage implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  allCards: Card[] = [];
  selectedCategory: string = 'All';

  // Precomputed category arrays
  appetizers: Card[] = [];
  protein: Card[] = [];
  breakfast: Card[] = [];
  desserts: Card[] = [];
  snacks: Card[] = [];

  constructor(private repositoryService: RepositoryService) {}

  ngOnInit() {
    this.repositoryService.getAllRepositories().subscribe(res => {
      if (res && res.success && Array.isArray(res.data)) {
        this.allCards = res.data.map((repo: any) => ({
          id: repo.id,
          title: repo.title,
          ingredients: repo.ingredience,
          dishType: repo.dishType,
          description: repo.description,
          userId: repo.userId,
          liked: false,
          followed: false,
          comments: [],
          avatar: 'https://material.angular.dev/assets/img/examples/shiba2.jpg',
          image: repo.image ? `data:image/png;base64,${this.arrayBufferToBase64(repo.image.data)}` : 'https://material.angular.dev/assets/img/examples/shiba2.jpg'
        }));

        // Precompute category arrays
        this.appetizers = this.allCards.filter(c => c.dishType === 'Appetizers');
        this.protein = this.allCards.filter(c => c.dishType === 'Protein');
        this.breakfast = this.allCards.filter(c => c.dishType === 'Breakfast');
        this.desserts = this.allCards.filter(c => c.dishType === 'Desserts');
        this.snacks = this.allCards.filter(c => c.dishType === 'Snacks');
      }
    });
  }

  toggleCategory(category: string) {
    this.selectedCategory = category;
  }

  isChecked(category: string): boolean {
    return this.selectedCategory === 'All' || this.selectedCategory === category;
  }

  arrayBufferToBase64(buffer: any) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
    return window.btoa(binary);
  }
}






