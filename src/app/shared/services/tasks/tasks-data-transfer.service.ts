import { Injectable } from '@angular/core';
import { BehaviorSubject, map, take } from 'rxjs';
import { GetAllTasksResponse } from 'src/app/models/interfaces/tasks/response/GetAllTasksResponse';

@Injectable({
  providedIn: 'root'
})
export class TasksDataTransferService {
  public tasksDataEmitter$ =
    new BehaviorSubject<Array<GetAllTasksResponse> | null>(null);
  public tasksDatas: Array<GetAllTasksResponse> = [];
  setTasksDatas(tasks: Array<GetAllTasksResponse>) {
    if(tasks) {
      this.tasksDataEmitter$.next(tasks);
      this.getTasksDatas();
    }
  }

  getTasksDatas(){
    this.tasksDataEmitter$.pipe(
      take(1),
      map((data) => data?.filter((task) => task?.amount > 0))
    )
    .subscribe({
      next: (response) => {
        if(response){
          this.tasksDatas = response;
        }
      }
    });
    return this.tasksDatas;
  }
}
