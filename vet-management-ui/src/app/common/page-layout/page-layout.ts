import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { BackButton } from '../back-button/back-button';

@Component({
  selector: 'app-page-layout',
  imports: [CommonModule, BackButton],
  templateUrl: './page-layout.html',
  styleUrl: './page-layout.css',
})
export class PageLayout {

  title = input('');
  subtitle = input('');
  backButton = input(false);
  smallFont = input(false);
  isSubPage = input(false);
}
