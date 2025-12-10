import { Component, signal, OnInit } from '@angular/core';
import { ToolbarMenu } from "../../shared/toolbar-menu/toolbar-menu";
import { AuthService } from '../../services/auth.service';
import { FollowersService } from '../../services/followers.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  templateUrl: './profile-page.html',
  styleUrls: ['./profile-page.css'],
  imports: [ToolbarMenu],
})
export class ProfilePage implements OnInit {
  avatarUrl = signal<string | ArrayBuffer | null>(null);
  fullName = signal('');
  email = signal('');

  followersCount = signal(0);
  followingCount = signal(0);

  isModalOpen = signal(false);
  selectedFile: File | null = null;

  constructor(
    private authService: AuthService,
    private followersService: FollowersService
  ) {}

  ngOnInit() {
    const user = this.authService.getUser();
    if (!user) return;

    // Initialize fullName/email from JWT
    this.fullName.set(user.fullName);
    this.email.set(user.email);

    // Fetch avatar from backend
    this.authService.getAvatar(user.sub).subscribe({
      next: (base64) => this.avatarUrl.set(base64),
      error: () => console.log('No avatar found or error fetching avatar')
    });

    // Optional: fetch fullName/email from backend to make sure it's up-to-date
    this.authService.fetchUser().subscribe(res => {
      if (res.fullName) this.fullName.set(res.fullName);
      if (res.email) this.email.set(res.email);
    });

    // Fetch followers and following counts
    this.followersService.getFollowersByUserId(user.sub).subscribe(followers => {
      this.followersCount.set(followers.length);
    });

    this.followersService.getFollowingByUserId(user.sub).subscribe(following => {
      this.followingCount.set(following.length);
    });
  }

  openModal() {
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => this.avatarUrl.set(reader.result);
    reader.readAsDataURL(file);
  }

  updateProfile(fullNameInput: HTMLInputElement, emailInput: HTMLInputElement, passwordInput: HTMLInputElement) {
    this.authService.updateUser({
      fullName: fullNameInput.value,
      email: emailInput.value,
      password: passwordInput.value,
      avatar: this.selectedFile || undefined
    }).subscribe(res => {
      // Update signals
      this.fullName.set(fullNameInput.value);
      this.email.set(emailInput.value);

      // Update JWT localStorage
      const user = this.authService.getUser();
      if (user) {
        user.fullName = fullNameInput.value;
        user.email = emailInput.value;
        localStorage.setItem('current_user', JSON.stringify(user));
      }

      this.closeModal();
    });
  }
}































