import { Component, signal } from '@angular/core';
import { ToolbarMenu } from "../../shared/toolbar-menu/toolbar-menu";

@Component({
  selector: 'app-profile-page',
  standalone: true,
  templateUrl: './profile-page.html',
  styleUrls: ['./profile-page.css'],
  imports: [ToolbarMenu],
})
export class ProfilePage {
  avatarUrl = signal<string | ArrayBuffer | null>(null);

  // Modal is hidden by default
  isModalOpen = signal(false);

  // Handle avatar selection
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => this.avatarUrl.set(reader.result);
    reader.readAsDataURL(file);
  }

  // Open modal
  openModal() {
    this.isModalOpen.set(true);
  }

  // Close modal
  closeModal() {
    this.isModalOpen.set(false);
  }

  
}










