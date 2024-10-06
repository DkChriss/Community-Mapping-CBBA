import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { FireMapDate, Root  } from '../../../interfaces/fire-map.interface'; // Importa la interfaz adecuada

@Injectable({
  providedIn: 'root'
})
export class FireMapService {

  private path: string = environment.base_url; 

  constructor(private http: HttpClient) {}

  private getHttpOptions(): { headers: HttpHeaders } { 
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return { headers };
  }

  getLocationsByDate(startDate: string, endDate: string): Observable<Root> {
    const params = new HttpParams()
        .set('startDate', startDate)
        .set('endDate', endDate);

    return this.http.get<Root>(`${this.path}modis_nrt`, { headers: this.getHttpOptions().headers, params });
}

}
