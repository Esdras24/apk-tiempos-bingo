import { Component, OnInit } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { UserEntity } from 'src/app/interfaces/user-model.module';
import { FolderService } from '../folder/folder.service';
import { UserService } from '../user/user.service';

@Component({
  selector: 'bingo',
  templateUrl: './bingo.page.html',
  styleUrls: ['./bingo.page.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class BingoPage implements OnInit{
  public user: UserEntity;
  constructor(
    private folderService: FolderService,
    private toastController: ToastController,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.user = this.userService.getUser();
    this.getUserInfo();
  }

  getUserInfo = async () => {
    (await this.folderService.getUserInfo()).subscribe(
      async (result) => {
        this.user.saldo = parseInt(result.monedero).toLocaleString('es-MX');
        this.user.bonus = parseInt(result.bonus).toLocaleString('es-MX');

        await this.folderService.setUser(this.user);
      },
      async (error) => {
        console.log(error);
        const toast = await this.toastController.create({
          message: 'Error cargando la informacaion de usuario',
          duration: 2000,
        });
        toast.present();
      }
    );
  };
}
