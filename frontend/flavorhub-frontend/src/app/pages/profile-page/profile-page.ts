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
  // Use signals for Angular 20 reactivity
  avatarUrl = signal<string | ArrayBuffer | null>(null);
  isModalOpen = signal(false);

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => this.avatarUrl.set(reader.result);
    reader.readAsDataURL(file);
  }

  openModal() {
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }
}






