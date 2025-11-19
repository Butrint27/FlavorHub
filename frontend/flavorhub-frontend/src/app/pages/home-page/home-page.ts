import { Component } from '@angular/core';
import { Toolbar } from "../../shared/toolbar/toolbar";
import {MatGridListModule} from '@angular/material/grid-list';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-home-page',
  imports: [Toolbar, MatGridListModule, RouterLink],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {

}
