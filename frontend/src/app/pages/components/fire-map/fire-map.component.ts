import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { Router } from '@angular/router';
import * as echarts from 'echarts';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-fire-map',
  templateUrl: './fire-map.component.html',
  styleUrls: ['./fire-map.component.css']
})
export class FireMapComponent implements OnInit {

  private map: L.Map | undefined;

  private markerData = [
    { lat: -17.38218419453465, lng: -66.15171157880397, brightness: 230, dateTime: '2024-10-05 14:30' },
    { lat: -17.4, lng: -66.2, brightness: 250, dateTime: '2024-10-05 15:45' },
    { lat: -14.1, lng: -64.9, brightness: 309, dateTime: '2024-10-05 16:20' },
    { lat: -19.0, lng: -65.2, brightness: 450, dateTime: '2024-10-05 17:00' },
    { lat: -21.1, lng: -63.5, brightness: 500, dateTime: '2024-10-05 18:30' }
  ];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    // Inicializa el mapa centrado en Bolivia
    this.map = L.map('map').setView([-16.290154, -63.588653], 6);

    // Cambiar a Tracestack Topo
    L.tileLayer('https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=d38a47705d6e4a5b98761d37eb661fe5', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.thunderforest.com/">Thunderforest</a> &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    this.loadGeoJson();
    this.addMarkers();
  }

  private loadGeoJson() {
    this.http.get('../../../../assets/geojson/gadm41_BOL_3.json').subscribe((geojsonData: any) => {
      const geoJsonStyle = {
        color: '#686868',
        weight: 1.5,
        opacity: 0.7,
        fillColor: '#2db9f0e7',
        fillOpacity: 0.2
      };
      L.geoJson(geojsonData, { style: geoJsonStyle }).addTo(this.map!);
    }, error => {
      console.error('Error al cargar el archivo GeoJSON:', error);
    });
  }

  private normalizeBrightness(brightness: number): number {
    const minBrightness = 200;
    const maxBrightness = 600;
    return ((brightness - minBrightness) / (maxBrightness - minBrightness)) * 1000;
  }

  // Calcula los kilómetros afectados basados en el brillo
  private calculateAffectedKm(brightness: number): number {
    const baseArea = 0.1; // Ajusta esta base a un valor más pequeño
    return baseArea * Math.pow(brightness, 0.5); // Relación cuadrática
}

private addMarkers() {
  if (this.map) {
    this.markerData.forEach(data => {
      const customIcon = L.divIcon({
        className: 'custom-icon',
        html: `
          <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
            width="1.2rem" height="1.2rem" viewBox="0 0 533.333 533.333" 
            style="enable-background:new 0 0 533.333 533.333;" xml:space="preserve">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" style="stop-color:rgba(131,20,3,1); stop-opacity:1" />
                <stop offset="100%" style="stop-color:rgba(247,210,106,1); stop-opacity:1" />
              </linearGradient>
            </defs>
            <g>
              <path fill="url(#grad1)" d="M165.494,533.333c-35.545-73.962-16.616-116.343,10.703-156.272
                c29.917-43.728,37.627-87.013,37.627-87.013s23.518,30.573,14.11,78.39c41.548-46.25,49.389-119.938,43.115-148.159
                c93.914,65.63,134.051,207.737,79.96,313.054c287.695-162.776,71.562-406.339,33.934-433.775
                c12.543,27.435,14.922,73.88-10.416,96.42C331.635,33.333,225.583,0,225.583,0c12.543,83.877-45.466,175.596-101.404,244.13
                c-1.965-33.446-4.053-56.525-21.641-88.531C98.59,216.357,52.157,265.884,39.583,326.76C22.551,409.2,52.341,469.562,165.494,533.333z"/>
            </g>
          </svg>`,
        iconSize: [5, 5],
        iconAnchor: [2, 2]
      });

      const normalizedBrightness = this.normalizeBrightness(data.brightness);
      const affectedKm = this.calculateAffectedKm(normalizedBrightness);

      // Crear el marcador
      const marker = L.marker([data.lat, data.lng], { icon: customIcon }).addTo(this.map!);

      // Crear la zona sombreada alrededor del marcador
      const circle = L.circle([data.lat, data.lng], {
        color: 'red',
        weight: 1,
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: affectedKm * 1000 // Asegúrate que el valor de 'affectedKm' sea razonable
      }).addTo(this.map!);

      // Agregar un popup que muestra la distancia afectada
      marker.bindPopup(`<b>Fecha y Hora:</b> ${data.dateTime}<br><b>Brillo:</b> ${data.brightness}<br><b>Kilómetros afectados:</b> ${affectedKm.toFixed(2)} km`).openPopup();
    });
  } else {
    console.error('El mapa no está inicializado');
  }
}

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

  
}
