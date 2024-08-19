import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserEntity } from 'src/app/interfaces/user-model.module';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FolderService {
  constructor(private http: HttpClient) {}

  getUser(): any {
    return JSON.parse(localStorage.getItem('user') ?? '');
  }

  async setUser(user: UserEntity): Promise<void> {
    localStorage.setItem('user', JSON.stringify(user));
  }

  async getRaffles() {
    const datas = new FormData();
    datas.append('lastUser', 'aplicacion11112222');
    datas.append('ejecutar', 'horariosCargaTicket');

    return this.http
      .post<any>(`${environment.url}/php/sistemaIngreso.php`, datas)
      .pipe(
        catchError((error: Response): Observable<Response> => throwError(error))
      );
  }

  async getUserInfo() {
    const user = this.getUser();
    const datas = new FormData();
    datas.append('lastUser', user.userName);
    datas.append('ejecutar', 'ejecutarInicio');

    return this.http
      .post<any>(`${environment.url}/movil/sistemaIngresoM.php`, datas)
      .pipe(
        catchError((error: Response): Observable<Response> => throwError(error))
      );
  }

  async save(data: any, user: any) {
    const datas = new FormData();
    datas.append('lastUser', user.userName);
    datas.append('ejecutar', 'saveTicketApp');
    datas.append('data', JSON.stringify(data));

    return this.http
      .post<any>(`${environment.url}/movil/sistemaIngresoM.php`, datas)
      .pipe(
        catchError((error: Response): Observable<Response> => throwError(error))
      );
  }
}
