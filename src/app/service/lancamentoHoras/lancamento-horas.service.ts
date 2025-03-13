import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { enviroment } from 'src/app/environment/environment.prod';
import { GetAllActivityResponse } from 'src/app/models/interfaces/atividades/GetAllActivityResponse';
import { CreateReleaseHoursRequest } from 'src/app/models/interfaces/lancamentoHoras/CreateReleaseHoursRequest';
import { CreateReleaseHoursResponse } from 'src/app/models/interfaces/lancamentoHoras/CreateReleaseHoursResponse';
import { EditReleaseHoursRequest } from 'src/app/models/interfaces/lancamentoHoras/EditReleaseHoursRequest';
import { GetAllReleaseHoursResponse } from 'src/app/models/interfaces/lancamentoHoras/GetAllReleaseHoursResponse';

@Injectable({
  providedIn: 'root'
})
export class LancamentoHorasService {
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

  getAllReleaseHours(): Observable<GetAllReleaseHoursResponse[]> {
    return this.http.get<GetAllReleaseHoursResponse[]>(
      `${this.API_URL}/lancamentoHoras`,
      this.getHeaders() // Atualizando os headers dinamicamente
    );
  }

  getReleaseHoursById(id_lancamento_horas: number): Observable<Array<GetAllReleaseHoursResponse>>{
    return this.http.get<Array<GetAllReleaseHoursResponse>>(`${this.API_URL}/lancamentoHoras/${id_lancamento_horas}`, this.getHeaders());
  }

  getReleaseHoursByName(nomeAtividade: string): Observable<GetAllReleaseHoursResponse[]> {
    let params = new HttpParams();
    if (nomeAtividade) {
        params = params.set('nomeAtividade', nomeAtividade);
    }
    return this.http.get<GetAllReleaseHoursResponse[]>(`${this.API_URL}/lancamentoHoras`, { ...this.getHeaders(), params });
  }

  getAtividadesDisponiveis(): Observable<GetAllActivityResponse[]> {
    return this.http.get<GetAllActivityResponse[]>(`${this.API_URL}/lancamentoHoras/atividadesDisponiveis`);
  }


  createReleaseHours(requestDatas: CreateReleaseHoursRequest): Observable<CreateReleaseHoursResponse>{
    return this.http.post<CreateReleaseHoursResponse>(`${this.API_URL}/lancamentoHoras`, requestDatas, this.httpOptions);
  }

  editReleaseHours(requestDatas: EditReleaseHoursRequest, id_lancamento_horas: number): Observable<void>{
    return this.http.put<void>(`${this.API_URL}/lancamentoHoras/${id_lancamento_horas}`, requestDatas, this.httpOptions);
  }
}
