import { TasksEvent } from './../../../../models/enums/tasks/TasksEvent';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GetAllTasksResponse } from 'src/app/models/interfaces/tasks/response/GetAllTasksResponse';
import {  EventAction } from 'src/app/models/interfaces/tasks/event/EventAction';

@Component({
  selector: 'app-tasks-table',
  templateUrl: './tasks-table.component.html',
  styleUrls: ['./tasks-table.component.css']
})
export class TasksTableComponent {
  @Input() tasksDatas: Array<GetAllTasksResponse> = [];
  @Output() tasksEvent = new EventEmitter<EventAction>();

  public selectedTasks!: GetAllTasksResponse;
  public addTasksEvent = TasksEvent.ADD_TASKS_EVENT;

  handleTasksEvent(action: string, id?: string): void {
    if(action && action !== ''){
      const tasksEventData = id && id !== '' ? {action, id} : {action};
      this.tasksEvent.emit(tasksEventData);
    }
  }
}
