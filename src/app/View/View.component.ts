import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { CircularArcArea, CircularArea } from '../Model/LocationData';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'app-View',
  templateUrl: './View.component.html',
  styleUrls: ['./View.component.css']
})
export class ViewComponent implements OnInit {
  private map!: L.Map;
  svgElement: any;

  constructor(
    private mapDraw: MapService
  ) { }

  ngOnInit() {
    console.log('ViewComponent.ngOnInit()');
    this.initMap();
    
  }

  // addMarker(): void {
  //   // const marker = L.marker([ 50.8503, 4.3517 ]);
  //   // marker.addTo(this.map);
  //   this.fetchLocationData();
  // }

  private initMap(): void {
    this.map = L.map('map', {
      center: [ 50.8503, 4.3517 ],
      zoom: 12
    });

    // const circle = L.circle([ -22.902278, -43.222125 ], {
    //   radius: 500
    // });
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18
    });

    // const circleArcArea = L.circleMarker([ -22.902278, -43.222125 ], {
    //   radius: 500
    // });

    tiles.addTo(this.map);
    //circle.addTo(this.map);
    // circleArcArea.addTo(this.map);
  }

  private drawCircle(dataCircle: CircularArea): void {
    L.circle([dataCircle.latitude, dataCircle.longitude], { radius: dataCircle.radius }).addTo(this.map);
  }

  fetchLocationData(phoneNumber: string): void {
    this.mapDraw.getLocationData(phoneNumber)
    .subscribe((data: any) => {
      debugger;
      this.drawLocationData(data);
    }
    );
  }


  drawLocationData(locationData: any): void {
    if(locationData.type === 'CircularArea') {
      this.drawCircle(locationData);
      this.map.setView([locationData.latitude, locationData.longitude], 15); // Adjust zoom level as needed
    } else if(locationData.type === 'CircularArcArea') {
      this.drawCircularArcArea(locationData);
      this.map.setView([locationData.latitude, locationData.longitude], 15);
    }
  }
  


  private drawCircularArcArea(circularArcArea: CircularArcArea): void {
    // Create an svg element
    this.svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svgElement.setAttribute('width', '100%');
    this.svgElement.setAttribute('height', '100%');
    this.svgElement.setAttribute('viewBox', '0 0 100 100');
    this.svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    this.svgElement.setAttribute('id', 'svg');
    this.svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    this.svgElement.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
    this.svgElement.setAttribute('version', '1.1');
    this.svgElement.setAttribute('baseProfile', 'full');
    // Consolidate style rules
    this.svgElement.setAttribute('style', 'background-color: transparent; transform-origin: 0px 0px 0px; transform: translate3d(0px, 0px, 0px); position: absolute; left: 0px; top: 0px; opacity: 1; visibility: visible;');
  
    // Append the svg element to the map
    this.map.getPanes().overlayPane.appendChild(this.svgElement);
  
    // Convert geographical coordinates to Leaflet layer point
    const centerPoint = this.map.latLngToLayerPoint(new L.LatLng(circularArcArea.latitude, circularArcArea.longitude));
  
    // Calculate the path for the circular arc area
    const path = this.calculateArcPath(centerPoint, circularArcArea);
  
    // Create a path element
    const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathElement.setAttribute('d', path);
    pathElement.setAttribute('stroke', 'black');
    pathElement.setAttribute('stroke-width', '1');
    pathElement.setAttribute('fill', 'red');
    pathElement.setAttribute('fill-opacity', '0.5');
    pathElement.setAttribute('pointer-events', 'auto');
    pathElement.setAttribute('class', 'leaflet-interactive');
  
    // Append the path element to the svg element
    this.svgElement.appendChild(pathElement);

    //Draw a simple circle
    const circleCenter: L.LatLngTuple = [circularArcArea.latitude, circularArcArea.longitude];
    const circleRadius = circularArcArea.outerRadius;
    
    const circle = L.circle(circleCenter, {
      radius: circleRadius / 12,
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5
    }).addTo(this.map);
    
  }
  
  
  
  
  calculateArcPath(centerPoint: L.Point, data: CircularArcArea): string {
  // Convert start and stop angles from degrees to radians
  const startAngle = data.startAngle * Math.PI / 180;
  const stopAngle = data.stopAngle * Math.PI / 180;

  // Calculate start and end points for the outer arc
  const x1 = centerPoint.x + data.outerRadius * Math.cos(startAngle);
  const y1 = centerPoint.y + data.outerRadius * Math.sin(startAngle);
  const x2 = centerPoint.x + data.outerRadius * Math.cos(stopAngle);
  const y2 = centerPoint.y + data.outerRadius * Math.sin(stopAngle);

  // Determine if the arc should be drawn as a large arc (greater than 180 degrees)
  const largeArcFlag = (stopAngle - startAngle) <= Math.PI ? 0 : 1;

  // Construct the SVG path for the outer arc
  let path = `M ${x1} ${y1} `; // Move to start point of the outer arc
  path += `A ${data.outerRadius} ${data.outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} `;

  // If there's an inner radius, draw the inner arc
  if (data.innerRadius > 0) {
    const innerX1 = centerPoint.x + data.innerRadius * Math.cos(stopAngle);
    const innerY1 = centerPoint.y + data.innerRadius * Math.sin(stopAngle);
    const innerX2 = centerPoint.x + data.innerRadius * Math.cos(startAngle);
    const innerY2 = centerPoint.y + data.innerRadius * Math.sin(startAngle);

    // Draw a line to the start of the inner arc
    path += `L ${innerX1} ${innerY1} `;

    // Draw the inner arc
    path += `A ${data.innerRadius} ${data.innerRadius} 0 ${largeArcFlag} 0 ${innerX2} ${innerY2} `;
  }

  // Close the path if necessary
  path += 'Z';

  return path;
}

  
  
}
