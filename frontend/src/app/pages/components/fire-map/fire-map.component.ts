import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fire-map',
  templateUrl: './fire-map.component.html',
  styleUrls: ['./fire-map.component.css']
})
export class FireMapComponent implements OnInit {

 
  private map: L.Map | undefined;

  constructor() { }

  ngOnInit() {
    // Inicializa el mapa con la vista centrada en los Estados Unidos
    this.map = L.map('map').setView([37.8, -96], 4);

    // Agrega las baldosas de OpenStreetMap al mapa
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    // Si tienes los datos de geometría como `statesData`, los puedes agregar de esta forma:
    // L.geoJson(statesData).addTo(this.map);
  }

  // Si necesitas destruir el mapa cuando se destruye el componente para liberar memoria
  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }
}
