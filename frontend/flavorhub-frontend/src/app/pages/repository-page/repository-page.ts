import { Component } from '@angular/core';
import { ToolbarMenu } from "../../shared/toolbar-menu/toolbar-menu";

@Component({
  selector: 'app-repository-page',
  standalone: true,
  imports: [ToolbarMenu],
  templateUrl: './repository-page.html',
  styleUrls: ['./repository-page.css'],
})
export class RepositoryPage {
  modalVisible = false;
  selectedImage: string | ArrayBuffer | null = null;

  toggleModal() {
    this.modalVisible = !this.modalVisible;
    if (!this.modalVisible) this.selectedImage = null; // reset image when modal closes
  }

  onImageSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.selectedImage = reader.result;
    };
    reader.readAsDataURL(file);
  }
}





