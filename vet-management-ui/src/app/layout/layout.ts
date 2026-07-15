import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Toast } from '../common/toast/toast';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Toast],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  collapsed: boolean = false;

  toggleSidebar(): void {
    this.collapsed = !this.collapsed;
  }
}
