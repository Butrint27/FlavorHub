import { Component, Input } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // 👈 adjust the path if needed

@Component({
  selector: 'app-toolbar-menu',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    RouterLink
  ],
  templateUrl: './toolbar-menu.html',
  styleUrls: ['./toolbar-menu.css']
})
export class ToolbarMenu {
  @Input() sidenav!: MatSidenav;
  @Input() showMenuButton: boolean = true;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  toggleSidenav() {
    this.sidenav.toggle();
  }

  logout() {
    this.authService.logout();   // 🗑 remove JWT + user
    this.router.navigate(['/login']); // 🔄 redirect to login
  }
}







