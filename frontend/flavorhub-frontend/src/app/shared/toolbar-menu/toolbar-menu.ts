import { Component, Input, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink } from '@angular/router';
import { AuthService, DecodedToken } from '../../services/auth.service';

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
export class ToolbarMenu implements OnInit {
  @Input() sidenav!: MatSidenav;
  @Input() showMenuButton: boolean = true;

  currentUser: DecodedToken | null = null;
  avatarUrl: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getUser();

    if (this.currentUser) {
      // Fetch avatar from backend
      this.authService.getAvatar(this.currentUser.sub).subscribe({
        next: (base64) => this.avatarUrl = base64,
        error: () => console.log('No avatar found')
      });
    }
  }

  toggleSidenav() {
    this.sidenav.toggle();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}









