import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from 'rxjs';
import { environment } from 'src/app/environment/environment';
import { CookieService } from 'ngx-cookie-service';
import { GetAllUsersResponse } from 'src/app/models/interfaces/user/GetAllUsersResponse copy';
import { SignupUserRequest } from '../../models/interfaces/user/SignupUserRequest';
import { SignupUserResponse } from 'src/app/models/interfaces/user/SignupUserResponse';
import { AuthRequest } from 'src/app/models/interfaces/user/AuthRequest';
import { AuthResponse } from 'src/app/models/interfaces/user/AuthResponse';
import { CreateUserRequest } from "src/app/models/interfaces/user/CreateUserRequest";
import { CreateUserResponse } from "src/app/models/interfaces/user/CreateUserResponse";
import { enviroment } from "src/app/environment/environment.prod";
import { EditUserRequest } from "src/app/models/interfaces/user/EditUserRequest";

@Injectable({
  providedIn: 'root',
})
export class UserService {
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

  getAllUsers(): Observable<Array<GetAllUsersResponse>> {
    return this.http.get<Array<GetAllUsersResponse>>(
      `${this.API_URL}/users`,
      this.getHeaders() // Atualizando os headers dinamicamente
    );
  }

  getUsersById(id_usuarios: number): Observable<Array<GetAllUsersResponse>>{
    return this.http.get<Array<GetAllUsersResponse>>(`${this.API_URL}/users/${id_usuarios}`, this.getHeaders());
  }

  getUserByName(nome: string): Observable<Array<GetAllUsersResponse>> {
    const params = new HttpParams().set('nome', nome);
    return this.http.get<Array<GetAllUsersResponse>>(`${this.API_URL}/users`, { ...this.getHeaders(), params });
  }

  createUser(requestDatas: CreateUserRequest): Observable<CreateUserResponse>{
    return this.http.post<CreateUserResponse>(`${this.API_URL}/users`, requestDatas, this.httpOptions);
  }

  editUser(requestDatas: EditUserRequest, id_projeto: number): Observable<void>{
    return this.http.put<void>(`${this.API_URL}/users/${id_projeto}`, requestDatas, this.httpOptions);
  }

  signupUser(requestDatas: SignupUserRequest): Observable<SignupUserResponse> {
    return this.http.post<SignupUserResponse>(`${this.API_URL}/register`, requestDatas);
  }

  authUser(requestDatas: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, requestDatas);
  }

  isLoggedIn(): boolean {
    const token = this.cookie.get('USER_INFO');
    return !!token; // 🔹 Forma mais enxuta de verificar se o token existe
  }
}
