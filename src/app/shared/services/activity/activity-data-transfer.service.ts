import { Injectable } from '@angular/core';
import { BehaviorSubject, take } from 'rxjs';
import { GetAllActivityResponse } from 'src/app/models/interfaces/atividades/GetAllActivityResponse';

@Injectable({
  providedIn: 'root'
})
export class ActivityDataTransferService {
  public activityDataEmitter$ =
    new BehaviorSubject<Array<GetAllActivityResponse> | null>(null);
  public activityDatas: Array<GetAllActivityResponse> = [];
  setActivityDatas(activity: Array<GetAllActivityResponse>) {
    if(activity) {
      this.activityDataEmitter$.next(activity);
      this.getActivityDatas();
    }
  }

  getActivityDatas(){
    this.activityDataEmitter$.pipe(
      take(1)
    )
    .subscribe({
      next: (response) => {
        if(response){
          this.activityDatas = response;
        }
      }
    });
    return this.activityDatas;
  }
}
