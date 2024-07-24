import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserEntity } from 'src/app/interfaces/user-model.module';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}

  getUser(): any {
    return JSON.parse(localStorage.getItem('user'));
  }

  setUser(user: UserEntity): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  async cleanUser(): Promise<void> {
    localStorage.removeItem('user');
  }

  login(user: any): Observable<UserEntity> {
    const datas = new FormData();
    datas.append('userID', user.userID);
    datas.append('password', user.password);
    datas.append('version', '8');

    return this.http
      .post<any>(`${environment.url}/movil/indexprueba.php`, datas)
      .pipe(
        catchError((error: Response): Observable<Response> => throwError(error))
      );
  }
}
