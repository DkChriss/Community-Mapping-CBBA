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

  // Arreglo de datos para los marcadores
  private markerData = [
    { lat: -17.38218419453465, lng: -66.15171157880397, brightness: 0.7, dateTime: '2024-10-05 14:30' },
    { lat: -17.4, lng: -66.2, brightness: 0.5, dateTime: '2024-10-05 15:45' },
    { lat: -14.1, lng: -64.9, brightness: 0.9, dateTime: '2024-10-05 16:20' },
    { lat: -19.0, lng: -65.2, brightness: 0.6, dateTime: '2024-10-05 17:00' },
    { lat: -21.1, lng: -63.5, brightness: 0.4, dateTime: '2024-10-05 18:30' }
  ];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    // Inicializa el mapa con la vista centrada en Bolivia
    this.map = L.map('map').setView([-16.290154, -63.588653], 6);

    // Agrega las baldosas de OpenStreetMap al mapa
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    // Cargar y agregar el archivo GeoJSON al mapa
    this.loadGeoJson();

    // Agregar los marcadores manualmente
    this.addMarkers();
  }

  // Método para cargar el archivo JSON
  private loadGeoJson() {
    this.http.get('../../../../assets/geojson/gadm41_BOL_3.json').subscribe((geojsonData: any) => {
      // Agrega los datos al mapa usando L.geoJson
      L.geoJson(geojsonData).addTo(this.map!);
    }, error => {
      console.error('Error al cargar el archivo GeoJSON:', error);
    });
  }

  // Método para agregar los marcadores manualmente
  private addMarkers() {
    if (this.map) {
      this.markerData.forEach(data => {
        // Crea el ícono usando un archivo SVG
        const customIcon = L.divIcon({
          className: 'custom-icon',
          html: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                   <circle cx="12" cy="12" r="10" fill="rgba(255, 0, 0, ${data.brightness})" />
                 </svg>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        // Crea el marcador y lo coloca en la latitud y longitud especificada
        const marker = L.marker([data.lat, data.lng], { icon: customIcon }).addTo(this.map!);

        // Agrega un popup que muestra la fecha y la hora
        marker.bindPopup(`<b>Fecha y Hora:</b> ${data.dateTime}`).openPopup();
      });
    } else {
      console.error('El mapa no está inicializado');
    }
  }

  // Limpia el mapa cuando se destruye el componente
  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

}
