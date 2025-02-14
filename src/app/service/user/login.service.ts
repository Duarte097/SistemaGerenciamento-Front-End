import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiKey = 'fsef7sef6sf6se6f6s6efse';
  constructor(private http:HttpClient) {}

  getLoginDatas(nome: string): Observable<any> {
    return this.http.get(`https://localhost:8081/search?q=${nome}&api_key=${this.apiKey}`, {});
  }
}
