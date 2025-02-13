import { Component, Input } from '@angular/core';
import { GetAllTasksResponse } from 'src/app/models/interfaces/tasks/response/GetAllTasksResponse';

@Component({
  selector: 'app-tasks-table',
  templateUrl: './tasks-table.component.html',
  styleUrls: ['./tasks-table.component.css']
})
export class TasksTableComponent {
 @Input() tasksDatas: Array<GetAllTasksResponse> = [];
 public selectedTasks!: GetAllTasksResponse;
}
