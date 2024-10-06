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
    this.map = L.map('map').setView([-16.290154, -63.588653], 6);
    L.tileLayer('https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=d38a47705d6e4a5b98761d37eb661fe5', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.thunderforest.com/">Thunderforest</a> &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    this.loadGeoJson();

    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 3000);
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
    const markerData = response.data; // Asegúrate de que la respuesta tiene el formato esperado
    this.addMarkers(markerData);
  }

  private addMarkers(markerData: Daum[]) {
    if (this.map) {
      markerData.forEach(data => {
        const marker = L.marker([parseFloat(data.latitude), parseFloat(data.longitude)]).addTo(this.map!);
        marker.bindPopup(`<b>Fecha:</b> ${data.date}<br><b>Brillo:</b> ${data.brightness}<br>`).openPopup();
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
