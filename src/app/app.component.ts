import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ViewComponent } from './View/View.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'LBS_MAP_Consult';
  @ViewChild(ViewComponent) viewComponent!: ViewComponent;

  fetchLocationData(phoneNumber: string): void {
    this.viewComponent.fetchLocationData(phoneNumber);
  }
}
