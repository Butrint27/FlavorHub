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

  toggleModal() {
    this.modalVisible = !this.modalVisible;
  }
}




