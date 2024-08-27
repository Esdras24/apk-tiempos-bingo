import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthInterface } from 'src/app/interfaces/bingo-interfaces.modules';
import { BancaInterface } from 'src/app/interfaces/local-interface.module';
import { UserEntity } from 'src/app/interfaces/user-model.module';
import { appConstants } from 'src/app/shared/constants';
import { bingoCredentials, environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  getUser(): any {
    return JSON.parse(localStorage.getItem('user') ?? '');
  }

  setUser(user: UserEntity): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  async cleanUser(): Promise<void> {
    localStorage.removeItem('user');
  }

  setBancaData(user: BancaInterface): void {
    localStorage.setItem('banca', JSON.stringify(user));
  }

  getBancaInfo(): BancaInterface {
    return JSON.parse(localStorage.getItem('banca') ?? '');
  }

  getAppInfo(): Observable<BancaInterface> {
    const datas = new FormData();
    datas.append('lastUser', appConstants.banca);
    datas.append('ejecutar', 'getInfo');

    return this.http
      .post<BancaInterface>(`${environment.url}/movil/app-info.php`, datas)
      .pipe(
        catchError((error: Response): Observable<BancaInterface> => throwError(error))
      );
  }
  
  login(user: any): Observable<UserEntity> {
    const datas = new FormData();
    datas.append('userID', user.userID);
    datas.append('password', user.password);
    datas.append('version', '8');

    return this.http
      .post<UserEntity>(`${environment.url}/movil/indexprueba.php`, datas)
      .pipe(
        catchError((error: Response): Observable<UserEntity> => throwError(error))
      );
  }

  registry(registryData: any): Observable<UserEntity> {
    const datas = new FormData();
    datas.append('name', registryData.name);
    datas.append('userId', registryData.userId);
    datas.append('telephone', registryData.telephone);
    datas.append('sinpe', registryData.sinpe);
    datas.append('password', registryData.password);
    datas.append('version', '8');

    return this.http
      .post<any>(`${environment.url}/movil/registry.php`, datas)
      .pipe(
        catchError((error: Response): Observable<UserEntity> => throwError(error))
      );
  }

  deleteUser(userId: number): Observable<UserEntity> {
    const datas = new FormData();
    datas.append('userId', `${userId}`);
    datas.append('version', '8');

    return this.http
      .post<any>(`${environment.url}/movil/delete-user.php`, datas)
      .pipe(
        catchError((error: Response): Observable<UserEntity> => throwError(error))
      );
  }

  registryBingoUser(registryData: any, adminToken: string): Observable<UserEntity> {
    const datas = new FormData();
    datas.append('name', 'usuario');
    datas.append('identification', registryData.userId);
    datas.append('password', registryData.password);
    datas.append('phone', registryData.telephone);

    return this.http
      .post<any>(`${bingoCredentials.url}/clients`, datas, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      })
      .pipe(
        catchError((error: Response): Observable<UserEntity> => throwError(error))
      );
  }

  bingoLogin(): Observable<AuthInterface> {
    const datas = new FormData();
    datas.append('email', bingoCredentials.email);
    datas.append('password', bingoCredentials.password);

    return this.http
      .post<any>(`${bingoCredentials.url}/login`, datas)
      .pipe(
        catchError((error: Response): Observable<AuthInterface> => throwError(error))
      );
  }
}
