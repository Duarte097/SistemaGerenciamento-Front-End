import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { enviroment } from 'src/app/environment/environment.prod';
import { CreateActivityRequest } from 'src/app/models/interfaces/atividades/CreateActivityRequest';
import { CreateActivityResponse } from 'src/app/models/interfaces/atividades/CreateActivityResponse';
import { EditActivityRequest } from 'src/app/models/interfaces/atividades/EditActivityRequest';
import { GetAllActivityResponse } from 'src/app/models/interfaces/atividades/GetAllActivityResponse';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
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

  getAllActivity(): Observable<GetAllActivityResponse[]> {
    return this.http.get<GetAllActivityResponse[]>(
      `${this.API_URL}/atividades`,
      this.getHeaders() // Atualizando os headers dinamicamente
    );
  }


  getActivityById(id_atividade: number | string): Observable<Array<GetAllActivityResponse>>{
    return this.http.get<Array<GetAllActivityResponse>>(`${this.API_URL}/atividades/${id_atividade}`, this.getHeaders());
  }

  getActivityByName(nomeAtividade: string): Observable<Array<GetAllActivityResponse>> {
    const params = new HttpParams().set('nomeAtividade', nomeAtividade);
    return this.http.get<Array<GetAllActivityResponse>>(`${this.API_URL}/atividades`, { ...this.getHeaders(), params });
  }

  getActivitiesByNameAndUserId(searchTerm: string): Observable<GetAllActivityResponse[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const params = new HttpParams().set('nomeAtividade', searchTerm);
    return this.http.get<GetAllActivityResponse[]>(`${this.API_URL}/atividades/search/user`, { headers, params });
  }

  createActivity(requestDatas: CreateActivityRequest): Observable<CreateActivityResponse>{
    return this.http.post<CreateActivityResponse>(`${this.API_URL}/atividades`, requestDatas, this.httpOptions);
  }

  editActivity(requestDatas: EditActivityRequest, id_atividade: number): Observable<void>{
    return this.http.put<void>(`${this.API_URL}/atividades/${id_atividade}`, requestDatas, this.httpOptions);
  }

}
