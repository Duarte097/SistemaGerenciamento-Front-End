import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { map, Observable } from 'rxjs';
import { enviroment } from 'src/app/environment/environment.prod';
import { CreateTaskRequest } from 'src/app/models/interfaces/tasks/request/CreateTaskRequest';
import { EditTaskRequest } from 'src/app/models/interfaces/tasks/request/EditTaskRequest';
import { CreateTaskResponse } from 'src/app/models/interfaces/tasks/response/CreateTaskResponse';
import { GetAllTasksResponse } from 'src/app/models/interfaces/tasks/response/GetAllTasksResponse';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private API_URL = enviroment.API_URL;
  private JWT_TOKEN = this.cookie.get('USER_INFO');
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.JWT_TOKEN}`
    })
  }
  constructor(private http: HttpClient, private cookie: CookieService) { }

  getAllTasks(): Observable<Array<GetAllTasksResponse>>{
    return this.http.get<Array<GetAllTasksResponse>>(
      `${this.API_URL}/tasks`,
      this.httpOptions
    )
    .pipe(
      map((task) => task.filter((data) => data?.amount > 0))
    );
  }

  createTask(requestDatas: CreateTaskRequest): Observable<CreateTaskResponse>{
    return this.http.post<CreateTaskResponse>(`${this.API_URL}/tasks/create`, requestDatas, this.httpOptions);
  }

  editTask(requestDatas: EditTaskRequest): Observable<void>{
    return this.http.put<void>(`${this.API_URL}/tasks/edit`, requestDatas, this.httpOptions);
  }
}
