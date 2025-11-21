import { Component, ViewChild } from '@angular/core';
import { ToolbarMenu } from '../../shared/toolbar-menu/toolbar-menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-main-page',
  imports: [ToolbarMenu, MatSidenavModule, MatPaginatorModule, MatCardModule, MatButtonModule],
  templateUrl: './main-page.html',
  styleUrls: ['./main-page.css']
})
export class MainPage {
  @ViewChild('sidenav') sidenav!: MatSidenav;
}

