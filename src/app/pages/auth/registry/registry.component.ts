import { Component, OnInit } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { catchError, map } from 'rxjs/operators';
import { AuthInterface } from 'src/app/interfaces/bingo-interfaces.modules';
import { BINGO_API_RES_MESSAGE } from 'src/app/shared/constants';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { RegistryData } from 'src/app/interfaces/registry.module';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registry',
  templateUrl: './registry.component.html',
  styleUrls: ['./registry.component.css'],
  standalone: true,
  imports: [
    IonicModule,
    ReactiveFormsModule,
    FormsModule
  ],
})
export class RegistryComponent implements OnInit {
  registryFormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    userID: new FormControl(null, [Validators.required]),
    telephone: new FormControl(null, [Validators.required]),
    sinpe: new FormControl(null, [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  deleteUser = false;
  showPassword = false;
  
  constructor(
    private authService: AuthService,
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    
      const registryData: RegistryData = {
        name: this.registryFormGroup.controls.name.value ?? '',
        userId: this.registryFormGroup.controls.userID.value ?? 0,
        telephone: this.registryFormGroup.controls.telephone.value ?? 0,
        sinpe: this.registryFormGroup.controls.sinpe.value ?? 0,
        password: this.registryFormGroup.controls.password.value ?? '',
      };

      if (registryData.userId.toString().length < 9) {
        this.presentToast('La cédula debe tener al menos 9 dígitos.', 'danger');
      }else if (registryData.telephone.toString().length < 8) {
        this.presentToast('El teléfono debe tener al menos 8 dígitos.', 'danger');
      }else if (registryData.password.toString().length < 6) {
        this.presentToast('La contraseña debe tener al menos 6 dígitos.', 'danger');
      }else{
        this.authService.registry(registryData).pipe(
          map(
            async (res: any)=>{
              if(parseInt(res.code) === 1){
                this.deleteUser = true;
                //await this.bingoLogin(registryData);
                this.presentToast('Usuario creado correctamente.', 'success');
                this.router.navigate(['/login']);
              } else {
                this.presentToast(res.estado, 'danger');
              }
            }
          )
        ).subscribe();
      }

  }

  goBack(){
    this.router.navigate(['/login']);
  }

  async bingoLogin(registryData: RegistryData){
    this.authService.bingoLogin().subscribe(
      (res: AuthInterface)=>{
        if (res.authorisation.token) {
          this.createBingoUser(registryData, res.authorisation.token);
        }
      },
      () => {
        this.deleteSistemUser();
      }
    );
  }

  async createBingoUser(registryData: RegistryData, token:string){
    
    this.authService.registryBingoUser(registryData, token ).pipe(
      map(
        async (res: any)=>{
          if(res.success){
            this.presentToast('Usuario creado correctamente.', 'success');
            this.router.navigate(['/app/sell']);
          } 
        }
      ),
      catchError(
        async (error: HttpErrorResponse)=>{
          console.log(error);
            await this.deleteSistemUser();
            if (error.error.message.phone === BINGO_API_RES_MESSAGE.duplicatePhone) {
              this.presentToast('Este número de teléfono ya esta activo en nuestra plataforma, favor contacta a servicio al cliente.', 'danger');
            }else if (error.error.message.identification === BINGO_API_RES_MESSAGE.duplicateIdentification) {
              this.presentToast('Este número de cédula ya esta activo en nuestra plataforma, favor contacta a servicio al cliente.', 'danger');
            }else if(error.error.message.password[0] === BINGO_API_RES_MESSAGE.password){
              this.presentToast('La contraseña debe tener al menos 6 digitos.', 'danger');
            }
          
          return throwError(()=>error);
        }
      )
    ).subscribe();
  }

  async deleteSistemUser(){
    if (this.deleteUser) {
      this.deleteUser = false;
      this.authService.deleteUser(this.registryFormGroup.controls.userID.value ?? 0).pipe(
        map(
          async (res: any)=>{
            console.log(res);
          }
        ),
        catchError(
          async (error: HttpErrorResponse)=>{
            console.log(error);
            
            return throwError(()=>error);
          }
        )
      ).subscribe();
    }
  }

  async presentToast(message:string, color: string){
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      color
    });
    toast.present();
  }
}
