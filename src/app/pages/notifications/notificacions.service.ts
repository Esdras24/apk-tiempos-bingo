import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificacionsService {
  constructor(private http: HttpClient) {}

  getUser(): any {
    return JSON.parse(localStorage.getItem('user'));
  }

  getList = (date1: string, date2: string) => {
    const userName = this.getUser();
    const datas = new FormData();
    datas.append('lastUser', userName.userName);
    datas.append('ejecutar', 'cargarNotificaciones');
    datas.append('fecha1', date1);
    datas.append('fecha2', date2);

    return this.http
      .post<any>(`${environment.url}/movil/movilFunc.php`, datas)
      .pipe(
        catchError((error: Response): Observable<Response> => throwError(error))
      );
  };
}
