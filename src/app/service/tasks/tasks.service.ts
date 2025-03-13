import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

  private getHeaders() {
    const token = this.cookie.get('USER_INFO');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : ''
      })
    };
  }

  getAllTasks(): Observable<GetAllTasksResponse[]> {
    return this.http.get<GetAllTasksResponse[]>(
      `${this.API_URL}/projetos`,
      this.getHeaders() // Atualizando os headers dinamicamente
    );
  }

  getProjetosEmAndamento(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/projetos/emAndamento`);
  }

  getProjectById(id_projeto: number): Observable<Array<GetAllTasksResponse>>{
    return this.http.get<Array<GetAllTasksResponse>>(`${this.API_URL}/projetos/${id_projeto}`, this.getHeaders());
  }

  getProjectByName(searchTerm: string): Observable<GetAllTasksResponse[]> {
    const params = new HttpParams().set('nomeProjeto', searchTerm);
    return this.http.get<GetAllTasksResponse[]>(`${this.API_URL}/projetos`, {
      params,
    });
  }

  getProjectsByNameAndUserId(
    searchTerm: string
  ): Observable<GetAllTasksResponse[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const params = new HttpParams().set('nomeProjeto', searchTerm);
    return this.http.get<GetAllTasksResponse[]>(
      `${this.API_URL}/projetos/search/user`,
      { headers, params }
    );
  }

  createTask(requestDatas: CreateTaskRequest): Observable<CreateTaskResponse>{
    return this.http.post<CreateTaskResponse>(`${this.API_URL}/projetos/search/user`, requestDatas, this.httpOptions);
  }

  editTask(requestDatas: EditTaskRequest, id_projeto: number): Observable<void>{
    return this.http.put<void>(`${this.API_URL}/projetos/${id_projeto}`, requestDatas, this.httpOptions);
  }
}
