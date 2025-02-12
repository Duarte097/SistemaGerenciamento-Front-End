import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { map, Observable } from 'rxjs';
import { enviroment } from 'src/app/environment/environment.prod';
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
}
