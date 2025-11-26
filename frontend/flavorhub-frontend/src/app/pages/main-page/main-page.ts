import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ToolbarMenu } from '../../shared/toolbar-menu/toolbar-menu';
import { CardsPlaginator } from '../../shared/cards-plaginator/cards-plaginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [CommonModule, ToolbarMenu, MatSidenavModule, MatButtonModule, CardsPlaginator],
  templateUrl: './main-page.html',
  styleUrls: ['./main-page.css']
})
export class MainPage {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  // Current selected category, default is "All"
  selectedCategory: string = 'All';

  toggleCategory(category: string) {
    if (category === 'All') {
      this.selectedCategory = 'All';
    } else {
      this.selectedCategory = category;
    }
  }

  getDisplay(category: string): string {
    return this.selectedCategory === 'All' || this.selectedCategory === category ? 'block' : 'none';
  }

  isChecked(category: string): boolean {
    return this.selectedCategory === 'All' || this.selectedCategory === category;
  }
}


