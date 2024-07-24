import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUser(): any {
    return JSON.parse(localStorage.getItem('user'));
  }

  getUserInfo(user: any) {
    const datas = new FormData();
    datas.append('lastUser', user);
    datas.append('ejecutar', 'inicioUser');

    return this.http
      .post<any>(`${environment.url}/movil/sistemaIngresoM.php`, datas)
      .pipe(
        catchError((error: Response): Observable<Response> => throwError(error))
      );
  }
}
