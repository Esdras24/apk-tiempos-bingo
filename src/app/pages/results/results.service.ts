import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ResultsService {
  constructor(private http: HttpClient) {}

  getUser(): any {
    return JSON.parse(localStorage.getItem('user'));
  }

  getList = (date: string) => {
    let datas = new FormData();
    datas.append('ejecutar', 'ganadores');
    datas.append('date', date);

    return this.http
      .post<any>(`${environment.url}/php/pagina.php`, datas)
      .pipe(
        catchError((error: Response): Observable<Response> => throwError(error))
      );
  };
}
