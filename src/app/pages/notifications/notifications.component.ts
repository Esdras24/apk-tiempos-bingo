import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { UserEntity } from 'src/app/interfaces/user-model.module';
import { UserService } from '../user/user.service';
import { NotificacionsService } from './notificacions.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  public data: any;
  public user: UserEntity;
  constructor(
    private notificationsService: NotificacionsService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.user = this.userService.getUser();
    const date = new Date();

    const date2 = moment(date).format('YYYY-MM-DD');
    let date1 = moment(date).subtract(3, 'days');
    this.notificationsService
      .getList(moment(date1).format('YYYY-MM-DD'), date2)
      .subscribe(
        (result) => {
          this.data = result.filter((e) => {
            if (e) {
              return e;
            }
          });
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
