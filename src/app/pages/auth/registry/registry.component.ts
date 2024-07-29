import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-registry',
  templateUrl: './registry.component.html',
  styleUrls: ['./registry.component.css'],
})
export class RegistryComponent implements OnInit {
  registryFormGroup = new FormGroup({
    userID: new FormControl(null, [Validators.required]),
    telephone: new FormControl(null, [Validators.required]),
    sinpe: new FormControl(null, [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
  });
  constructor(
    private authService: AuthService,
    private toastController: ToastController
  ) {}

  ngOnInit(): void {}

  async onSubmit() {
    if (
      this.registryFormGroup.controls.password.value ===
      this.registryFormGroup.controls.confirmPassword.value
    ) {
      const registryData = {
        userID: this.registryFormGroup.controls.userID.value,
        telephone: this.registryFormGroup.controls.telephone.value,
        sinpe: this.registryFormGroup.controls.sinpe.value,
        password: this.registryFormGroup.controls.password.value,
      };
      this.authService.registry(registryData).subscribe();
    } else {
      const toast = await this.toastController.create({
        message: 'Las contraseñas deben ser iguales.',
        duration: 2000,
      });
      toast.present();
    }
  }
}
