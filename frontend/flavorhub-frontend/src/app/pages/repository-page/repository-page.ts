import { Component } from '@angular/core';
import { ToolbarMenu } from "../../shared/toolbar-menu/toolbar-menu";
import { Chips } from '../../shared/chips/chips';

@Component({
  selector: 'app-repository-page',
  standalone: true,
  imports: [ToolbarMenu, Chips],
  templateUrl: './repository-page.html',
  styleUrls: ['./repository-page.css'],
})
export class RepositoryPage {
  modalVisible = false;

  toggleModal() {
    this.modalVisible = !this.modalVisible;
  }

  
}




