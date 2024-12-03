import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MapService } from '../../../services/map.service';

@Component({
  selector: 'app-keypad',
  templateUrl: './keypad.component.html',
  styleUrls: ['./keypad.component.css']
})
export class KeypadComponent implements OnInit {
  phoneNumber: string = '';

  @Output() locationRequest = new EventEmitter<string>();

  constructor(
    private mapDraw: MapService
  ) { }

  ngOnInit() {
  }

  onButtonPress(key: number | string) {
    if (key === '⌫') {
      this.phoneNumber = this.phoneNumber.slice(0, -1);
    } else if (typeof key === 'number') {
      this.phoneNumber += key;
    }
  }

  formattedPhoneNumber(): string {
    // Basic formatting - you can adjust this as per your needs
    const cleaned = ('' + this.phoneNumber).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return this.phoneNumber;
  }

  openLocation() {
    // Logic to handle the location opening
    console.log('Opening location for:', this.formattedPhoneNumber());
    this.locationRequest.emit(this.formattedPhoneNumber());
  }

  private drawArcCircle(dataCircle: any): void {
    debugger;
    // L.circle([dataCircle.latitude, dataCircle.longitude], { radius: dataCircle.radius }).addTo(this.map);
  }
  


}
