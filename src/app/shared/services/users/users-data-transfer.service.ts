import { Injectable } from '@angular/core';
import { BehaviorSubject, map, take } from 'rxjs';
import { GetAllUsersResponse } from 'src/app/models/interfaces/user/GetAllUsersResponse copy';

@Injectable({
  providedIn: 'root'
})
export class UsersDataTransferService {
  public UsersDataEmitter$ =
    new BehaviorSubject<Array<GetAllUsersResponse> | null>(null);
  public usersDatas: Array<GetAllUsersResponse> = [];
  setUsersDatas(users: Array<GetAllUsersResponse>) {
    if(users) {
      this.UsersDataEmitter$.next(users);
      this.getUsersDatas();
    }
  }

  getUsersDatas() {
    this.UsersDataEmitter$.pipe(
      take(1)
    ).subscribe({
      next: (response) => {
        if(response) {
          this.usersDatas = response; // Agora, armazenamos todos os usuários
        }
      }
    });
    return this.usersDatas;
  }

}
