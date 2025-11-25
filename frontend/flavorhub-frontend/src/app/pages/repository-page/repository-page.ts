import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- needed for *ngFor, *ngIf, etc.
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ToolbarMenu } from "../../shared/toolbar-menu/toolbar-menu";

interface Repo {
  title: string;
  image: string | ArrayBuffer | null;
  dishType: string;
  description: string;
  likes: number;
  dislikes: number;
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
  description = signal('');

  // cards array
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
    reader.onload = () => {
      this.selectedImage.set(reader.result);
    };
    reader.readAsDataURL(file);
  }

  confirmRepo() {
    if (!this.title() || !this.selectedImage() || !this.dishType() || !this.description()) return;

    this.repos.set([
      {
        title: this.title(),
        image: this.selectedImage(),
        dishType: this.dishType(),
        description: this.description(),
        likes: Math.floor(Math.random() * 100),
        dislikes: Math.floor(Math.random() * 100),
      },
      ...this.repos(), // newest on top
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

  editRepo(repo: Repo) {
    this.title.set(repo.title);
    this.selectedImage.set(repo.image);
    this.dishType.set(repo.dishType);
    this.description.set(repo.description);
    this.toggleModal();
    this.repos.set(this.repos().filter(r => r !== repo));
  }

  deleteRepo(repo: Repo) {
    this.repos.set(this.repos().filter(r => r !== repo));
  }

  resetForm() {
    this.title.set('');
    this.dishType.set('');
    this.description.set('');
    this.selectedImage.set(null);
  }
}








