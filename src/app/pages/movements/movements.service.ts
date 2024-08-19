import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class MovementsService {
  constructor(private http: HttpClient) {}

  getUser(): any {
    return JSON.parse(localStorage.getItem('user') ?? '');
  }

  getList = (date: string) => {
    const userName = this.getUser();
    const datas = new FormData();
    datas.append('lastUser', userName.userName);
    datas.append('ejecutar', 'movimientos');
    datas.append('fecha1', date);

    return this.http
      .post<any>(`${environment.url}/movil/facturasM.php`, datas)
      .pipe(
        catchError((error: Response): Observable<Response> => throwError(error))
      );
  };

  depositRequest = (amount: string) => {
    const userName = this.getUser();
    const datas = new FormData();
    datas.append('lastUser', userName.userName);
    datas.append('ejecutar', 'deposito');
    datas.append('monto', amount);

    return this.http
      .post<any>(`${environment.url}/movil/sistemaIngresoM.php`, datas)
      .pipe(
        catchError((error: Response): Observable<Response> => throwError(error))
      );
  };

  rechargeRequest = (amount: string) => {
    const userName = this.getUser();
    const datas = new FormData();
    datas.append('lastUser', userName.userName);
    datas.append('ejecutar', 'recarga');
    datas.append('monto', amount);
    datas.append('comprobante', '');

    return this.http
      .post<any>(`${environment.url}/movil/sistemaIngresoM.php`, datas)
      .pipe(
        catchError((error: Response): Observable<Response> => throwError(error))
      );
  };
}
