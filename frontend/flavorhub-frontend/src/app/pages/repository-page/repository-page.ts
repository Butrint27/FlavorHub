import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ToolbarMenu } from "../../shared/toolbar-menu/toolbar-menu";

interface Repo {
  title: string;
  image: string | ArrayBuffer | null;
  dishType: string;
  ingredience: string;
  description: string;
  likes: number;
  dislikes: number;
  showMenu?: boolean; // needed for the dropdown
}

@Component({
  selector: 'app-repository-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, ToolbarMenu],
  templateUrl: './repository-page.html',
  styleUrls: ['./repository-page.css'],
})
export class RepositoryPage {
  modalVisible = signal(false);
  selectedImage = signal<string | ArrayBuffer | null>(null);

  // form signals
  title = signal('');
  dishType = signal('');
  ingredience = signal('');
  description = signal('');

  repos = signal<Repo[]>([]);

  toggleModal() {
    this.modalVisible.set(!this.modalVisible());
    if (!this.modalVisible()) this.resetForm();
  }

  onImageSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => this.selectedImage.set(reader.result);
    reader.readAsDataURL(file);
  }

  confirmRepo() {
    if (!this.title() || !this.selectedImage() || !this.ingredience() || !this.dishType() || !this.description())
      return;

    this.repos.set([
      {
        title: this.title(),
        image: this.selectedImage(),
        ingredience: this.ingredience(),
        dishType: this.dishType(),
        description: this.description(),
        likes: Math.floor(Math.random() * 100),
        dislikes: Math.floor(Math.random() * 100),
        showMenu: false,
      },
      ...this.repos(),
    ]);

    this.toggleModal();
  }

  likeRepo(repo: Repo) {
    repo.likes++;
    this.repos.set([...this.repos()]);
  }

  dislikeRepo(repo: Repo) {
    repo.dislikes++;
    this.repos.set([...this.repos()]);
  }

  toggleMenu(event: Event, repo: Repo) {
    event.stopPropagation();

    // Close all other menus
    this.repos().forEach(r => {
      if (r !== repo) r.showMenu = false;
    });

    repo.showMenu = !repo.showMenu;
    this.repos.set([...this.repos()]);
  }

  @HostListener('document:click')
  closeAllMenus() {
    this.repos().forEach(r => r.showMenu = false);
    this.repos.set([...this.repos()]);
  }

  editRepo(event: Event, repo: Repo) {
    event.stopPropagation();

    this.title.set(repo.title);
    this.selectedImage.set(repo.image);
    this.ingredience.set(repo.ingredience);
    this.dishType.set(repo.dishType);
    this.description.set(repo.description);

    this.toggleModal();
    repo.showMenu = false;
    this.repos.set(this.repos().filter(r => r !== repo));
  }

  deleteRepo(event: Event, repo: Repo) {
    event.stopPropagation();

    this.repos.set(this.repos().filter(r => r !== repo));
  }

  resetForm() {
    this.title.set('');
    this.dishType.set('');
    this.ingredience.set('');
    this.description.set('');
    this.selectedImage.set(null);
  }
}










