import { Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-back-button',
  standalone: true,
  imports: [],
  templateUrl: './back-button.html',
  styleUrl: './back-button.css',
})
export class BackButton {

  constructor(
    private location: Location
  ) {}

  goBack(): void {
    this.location.back();
  }
}
