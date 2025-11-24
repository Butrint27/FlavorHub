import { Component, ViewChild } from '@angular/core';
import { ToolbarMenu } from '../../shared/toolbar-menu/toolbar-menu';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { CardsPlaginator } from '../../shared/cards-plaginator/cards-plaginator';

@Component({
  selector: 'app-main-page',
  imports: [ToolbarMenu, MatSidenavModule,MatButtonModule, CardsPlaginator],
  templateUrl: './main-page.html',
  styleUrls: ['./main-page.css']
})
export class MainPage {
  @ViewChild('sidenav') sidenav!: MatSidenav;
}

