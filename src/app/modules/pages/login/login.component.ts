import { UserService } from './../../../service/user/User.service';
import { Component, Inject, OnDestroy, OnInit,  ViewEncapsulation} from '@angular/core';
import { LoginService } from '../../../service/user/login.service';
import { LoginDatas } from 'src/app/models/interfaces/Login';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthRequest } from 'src/app/models/interfaces/user/AuthRequest';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  loginDatas!: LoginDatas;
  constructor(
    private loginService: LoginService,
    private userService: UserService,
    private cookieService: CookieService,
    private messageService: MessageService,
    private router: Router,
    private formBuilder: FormBuilder,
    @Inject(DOCUMENT) private document: Document,
  ){}

  loginForm = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  /*getLoginDatas(nome: string): void {

    this.loginService.getLoginDatas(nome)
    .pipe(
      takeUntil(this.destroy$)
    ).subscribe({next:(response) => {
      response && (this.loginDatas = response);
      console.log(this.loginDatas.username);
    }, error:(error) => {
      console.log(error);
    }
    });
  }*/

  onSubmit(): void {
    console.log("onSubmit chamado", this.loginForm.value);
    if (this.loginForm.value && this.loginForm.valid) {
      this.userService
        .authUser(this.loginForm.value as AuthRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            console.log("Resposta da API:", response); // 🔹 Debugando a resposta

            const token = response?.accessToken; // 🔹 Pegue o token correto

            if (token) {
              this.cookieService.set('USER_INFO', token, { path: '/' });
              console.log("Token salvo:", this.cookieService.get('USER_INFO'));

              this.loginForm.reset();
              this.router.navigate(['/app/dashboard']);

              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: `Bem-vindo de volta!`,
                life: 2000,
              });
            } else {
              console.log("Erro: Token não encontrado na resposta da API");
            }
          },
          error: (err) => {
            console.log("Erro ao fazer login:", err); // 🔹 Mostra o erro no console
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: `Erro ao fazer o login!`,
              life: 2000,
            });
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
