import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ToolbarMenu } from "../../shared/toolbar-menu/toolbar-menu";
import { RepositoryService } from '../../services/repository.service';

interface Repo {
  id?: number;
  title: string;
  image: string | ArrayBuffer | null;
  dishType: string;
  ingredience: string;
  description: string;
  likes: number;
  showMenu?: boolean;
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

  title = signal('');
  dishType = signal('');
  ingredience = signal('');
  description = signal('');

  repos = signal<Repo[]>([]);
  editingRepoId: number | null = null;

  constructor(private repositoryService: RepositoryService) {
    this.loadAllRepositories();
  }

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

  loadAllRepositories() {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.log('JWT not found');
      return;
    }

    let userId: number;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userId = payload.sub;
    } catch (error) {
      console.error('Invalid JWT', error);
      return;
    }

    this.repositoryService.getRepositoriesByUser(userId).subscribe({
      next: (res: any) => {
        // Backend might return { success: true, data: [...] } or just [...]
        const reposArray = Array.isArray(res) ? res : res.data || [];

        const formattedRepos = reposArray.map((repo: { id: any; title: any; dishType: any; ingredience: any; description: any; likes: any; image: any; }) => ({
          id: repo.id,
          title: repo.title,
          dishType: repo.dishType,
          ingredience: repo.ingredience,
          description: repo.description,
          likes: repo.likes || 0,
          showMenu: false,
          image: repo.image ? this.convertBufferToImage(repo.image) : null,
        }));

        this.repos.set(formattedRepos);
      },
      error: (err) => console.error(err),
    });
  }

  convertBufferToImage(buffer: any): string | null {
    if (!buffer?.data) return null;
    const uint8Array = new Uint8Array(buffer.data);
    const blob = new Blob([uint8Array], { type: 'image/png' });
    return URL.createObjectURL(blob);
  }

  confirmRepo() {
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('You are not logged in!');
      return;
    }

    let userId: number;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userId = payload.sub;
    } catch (error) {
      console.error('Invalid JWT', error);
      return;
    }

    if (!this.title() || !this.selectedImage() || !this.ingredience() || !this.dishType() || !this.description()) {
      alert('Please fill all fields');
      return;
    }

    const formData = new FormData();
    formData.append('title', this.title());
    formData.append('dishType', this.dishType());
    formData.append('ingredience', this.ingredience());
    formData.append('description', this.description());
    formData.append('userId', userId.toString());

    if (this.selectedImage()) {
      const byteString = atob((this.selectedImage() as string).split(',')[1]);
      const mimeString = (this.selectedImage() as string).split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
      const blob = new Blob([ab], { type: mimeString });
      formData.append('image', blob, 'image.png');
    }

    if (this.editingRepoId) {
      this.repositoryService.updateRepository(this.editingRepoId, formData).subscribe({
        next: () => {
          this.loadAllRepositories();
          this.toggleModal();
          this.editingRepoId = null;
        },
        error: (err) => console.error(err),
      });
    } else {
      this.repositoryService.createRepository(formData).subscribe({
        next: () => {
          this.loadAllRepositories();
          this.toggleModal();
        },
        error: (err) => console.error(err),
      });
    }
  }

  toggleMenu(event: Event, repo: Repo) {
    event.stopPropagation();
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
    this.editingRepoId = repo.id || null;
    this.title.set(repo.title);
    this.selectedImage.set(repo.image);
    this.ingredience.set(repo.ingredience);
    this.dishType.set(repo.dishType);
    this.description.set(repo.description);
    this.toggleModal();
    repo.showMenu = false;
  }

  deleteRepo(event: Event, repo: Repo) {
    event.stopPropagation();
    if (!repo.id) return;

    this.repositoryService.deleteRepository(repo.id).subscribe({
      next: () => this.loadAllRepositories(),
      error: (err) => console.error(err),
    });
  }

  resetForm() {
    this.title.set('');
    this.dishType.set('');
    this.ingredience.set('');
    this.description.set('');
    this.selectedImage.set(null);
    this.editingRepoId = null;
  }
}






















