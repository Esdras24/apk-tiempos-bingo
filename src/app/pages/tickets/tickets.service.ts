import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TicketsService {
  constructor(private http: HttpClient) {}

  getUser(): any {
    return JSON.parse(localStorage.getItem('user'));
  }

  getList = (date: string) => {
    const userName = this.getUser();
    const datas = new FormData();
    datas.append('lastUser', userName.userName);
    datas.append('ejecutar', 'facturas');
    datas.append('fecha1', date);

    return this.http
      .post<any>(`${environment.url}/movil/facturasM.php`, datas)
      .pipe(
        catchError((error: Response): Observable<Response> => throwError(error))
      );
  };

  ticketDelete = (ticket: string) => {
    const userName = this.getUser();
    const datas = new FormData();
    datas.append('lastUser', userName.userName);
    datas.append('ejecutar', 'eliminar');
    datas.append('eliminar', ticket);

    return this.http
      .post<any>(`${environment.url}/movil/sistemaIngresoM.php`, datas)
      .pipe(
        catchError((error: Response): Observable<Response> => throwError(error))
      );
  };

  reviewTicket = (ticket: string) => {
    const userName = this.getUser();
    const datas = new FormData();
    datas.append('lastUser', userName.userName);
    datas.append('ejecutar', 'cargaTicket');
    datas.append('tickete', ticket);

    return this.http
      .post<any>(`${environment.url}/movil/movilFunc.php`, datas)
      .pipe(
        catchError((error: Response): Observable<Response> => throwError(error))
      );
  };
}
