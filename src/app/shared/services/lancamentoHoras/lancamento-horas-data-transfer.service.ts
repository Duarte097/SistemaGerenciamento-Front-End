import { Injectable } from '@angular/core';
import { BehaviorSubject, take } from 'rxjs';
import { GetAllReleaseHoursResponse } from 'src/app/models/interfaces/lancamentoHoras/GetAllReleaseHoursResponse';

@Injectable({
  providedIn: 'root'
})
export class LancamentoHorasDataTransferService {
public releaseHoursDataEmitter$ =
  new BehaviorSubject<Array<GetAllReleaseHoursResponse> | null>(null);
  public releaseHoursDatas: Array<GetAllReleaseHoursResponse> = [];
  setReleaseHoursDatas(releaseHours: Array<GetAllReleaseHoursResponse>) {
    if(releaseHours) {
      this.releaseHoursDataEmitter$.next(releaseHours);
      this.getReleaseHoursDatas();
    }
  }

  getReleaseHoursDatas(){
    this.releaseHoursDataEmitter$.pipe(
      take(1)
    )
    .subscribe({
      next: (response) => {
        if(response){
          this.releaseHoursDatas = response;
        }
      }
    });
    return this.releaseHoursDatas;
  }
}
