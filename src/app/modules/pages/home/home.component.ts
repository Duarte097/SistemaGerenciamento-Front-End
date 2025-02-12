import { SignupService } from './../../service/signup.service';
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { library } from '@fortawesome/fontawesome-svg-core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  /*loginForm = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  signupForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required]
  });*/

  constructor(
    //private formBuilder: FormBuilder,
    private signupService : SignupService,
    private cookieService: CookieService
    //private messageService: MessageService
  ) {}

  onSubmitLoginForm(): void {
    /*if(this.loginForm.value && this.loginForm.valid){
      this.signupService.authUser(this.loginForm.value).subscribe({
        next: (response) => {
          if(response) {
            this.cookieService.set('USER_INFO', response?.token);

            this.loginForm.reset();

            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Seja Bem Vindo ${response?.name}!',
              life: 2000,

            })
          }
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao fazer o login!',
            life: 2000,
          })
          console.log(err),
        }
      })
    }*/
  }
}
