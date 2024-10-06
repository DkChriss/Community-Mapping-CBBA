import { Component, OnInit, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FireMapService } from '../../shared/services/fire-map.service';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { Daum, FireMapDate, Root } from '../../../interfaces/fire-map.interface'; // Asegúrate de que esta es la interfaz correcta

@Component({
  selector: 'app-fire-map',
  templateUrl: './fire-map.component.html',
  styleUrls: ['./fire-map.component.css']
})
export class FireMapComponent implements OnInit, OnDestroy {


  loading: boolean = false;
  lg!: FormGroup;
  private map: L.Map | undefined;

  constructor(private fireMapService: FireMapService,
              private fb: FormBuilder,
              private router: Router,
              private http: HttpClient) {
    this.lg = this.fb.group({
      dateInit: new FormControl('', [Validators.required]),
      dateEnd: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
    this.map = L.map('map-street').setView([-16.290154, -63.588653], 6);
    L.tileLayer('https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=d38a47705d6e4a5b98761d37eb661fe5', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.thunderforest.com/">Thunderforest</a> &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    const loadGeoJson = false;
    if (loadGeoJson) {
      this.loadGeoJson();
    }
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 3000);
  }

  private loadGeoJson() {

    const geoJsonUrl = `../../../../assets/geojson/gadm41_BOL_3.json?cacheBust=${new Date().getTime()}`;

    this.http.get(geoJsonUrl).subscribe((geojsonData: any) => {
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

  submitForm() {
    if (this.lg.valid) {
      const startDate = new Date(this.lg.value.dateInit);
      const endDate = new Date(this.lg.value.dateEnd);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        console.error('Las fechas son inválidas');
        return;
      }

      const formattedStartDate = this.formatDate(startDate);
      const formattedEndDate = this.formatDate(endDate);

      this.fireMapService.getLocationsByDate(formattedStartDate, formattedEndDate).subscribe(
        (response: Root) => {
          this.handleApiResponse(response);
        },
        error => {
          console.error('Error al obtener datos del servicio:', error);
        }
      );
    }
  }

  private formatDate(date: Date): string {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error('Fecha inválida');
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private handleApiResponse(response: Root) {
    const markerData = response.data;
    this.addMarkers(markerData);
  }

  private normalizeBrightness(brightness: number): number {
    const minBrightness = 200;
    const maxBrightness = 600;
    return ((brightness - minBrightness) / (maxBrightness - minBrightness)) * 1000;
  }

  private calculateAffectedKm(brightness: number): number {
    const baseArea = 0.1;
    return baseArea * Math.pow(brightness, 0.5);
  }

  private addMarkers(markerData: Daum[]) {
    if (this.map) {
      let index = 0;

      const addMarkerWithDelay = () => {
        if (index >= markerData.length) {
          return;
        }

        const data = markerData[index];

        const customIcon = L.divIcon({
          className: 'svg-icon-map',
          html: `
            <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
              width="2rem" height="2rem" viewBox="0 0 533.333 533.333"
                style="width: 2rem !important; height: 2rem !important; transform: none !important; enable-background:new 0 0 533.333 533.333;" xml:space="preserve">
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

        const marker = L.marker([parseFloat(data.latitude), parseFloat(data.longitude)], { icon: customIcon }).addTo(this.map!);

        const circle = L.circle([parseFloat(data.latitude), parseFloat(data.longitude)], {
          color: 'red',
          weight: 1,
          fillColor: '#f03',
          fillOpacity: 0.5,
          radius: affectedKm * 1000
        }).addTo(this.map!);

        marker.bindPopup(`<b>Fecha:</b> ${data.date}<br><b>Brillo:</b> ${data.brightness}<br><b>Kilómetros afectados:</b> ${affectedKm.toFixed(2)} km`).openPopup();

        index++;

        setTimeout(addMarkerWithDelay, 500);
      };

      addMarkerWithDelay();
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
