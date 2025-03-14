import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { Subject, takeUntil } from 'rxjs';
import { CreateUserRequest } from 'src/app/models/interfaces/user/CreateUserRequest';
import { GetAllUsersResponse } from 'src/app/models/interfaces/user/GetAllUsersResponse copy';
import { UserService } from 'src/app/service/user/User.service';
import { UsersDataTransferService } from 'src/app/shared/services/users/users-data-transfer.service';

@Component({
  selector: 'app-criacao-usuarios',
  templateUrl: './criacao-usuarios.component.html',
    standalone: true,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [
      CommonModule,
      FormsModule,
      DropdownModule,
      ReactiveFormsModule,
      ToastModule
    ],
  styleUrls: ['./criacao-usuarios.component.css']
})
export class CriacaoUsuariosComponent implements OnInit, OnDestroy {
private readonly destroy$: Subject<void> = new Subject();
  public userList: Array<GetAllUsersResponse> = [];
  @Output() closeModalCreate = new EventEmitter<void>();
  @Input() userId: number | null = null;

  public userData: any = {};
  createUserForm : FormGroup;
  selectedStatus: any;
  selectedUsuarios: any;
  selectedPerfil: any;
  perfil: any[] = [];
  usuarios: any[] = [];


  constructor(
    private formBuilder: FormBuilder,
    private usersDtService: UsersDataTransferService,
    private userServices : UserService,
    private messageService: MessageService,
  ) {
    this.createUserForm = this.formBuilder.group({
      nome: ['', Validators.required],
      email: ['', Validators.required],
      senha: ['', Validators.required],
      perfil: ['', Validators.required]
    });
    this.userData ;
  }

  isModalCreateOpen = false;

  ngOnInit(): void {
    this.perfil = [
      { name: 'USUARIO', code: 'USUARIO' },
      { name: 'ADMIN', code: 'ADMIN' },
    ];
    this.getUserIdFromToken();
  }


  @Output() closeModal = new EventEmitter<void>();

  close() {
    this.closeModal.emit();
  }


  openModalCreate() {
    this.isModalCreateOpen = true;
  }


  onSubmit(): void {
    console.log('Formulário enviado', this.createUserForm.value);
    if (this.createUserForm.valid) {
      const usersData: CreateUserRequest = {
        nome: this.createUserForm.value.nome,
        email: this.createUserForm.value.email,
        senha: this.createUserForm.value.senha,
        perfil: this.createUserForm.value.perfil
      };
      this.close();
      this.userServices.createUser(usersData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            // Verifique o status da resposta
            if (response && typeof response === 'object') { // Se a resposta não for nula ou indefinida.
              this.close();
              console.log('Chamando messageService.add() com sucesso...');
              console.log('Mensagem de sucesso:', {
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Usuario criado com sucesso!',
                life: 2000
              });
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Usuario criado com sucesso!',
                life: 2000
              });
            } /*else {
              // Trate o caso em que a resposta é nula ou indefinida (possível erro inesperado)
              console.error('Resposta inesperada do servidor.');
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro inesperado ao criar Usuario!',
                life: 2000
              });
            }*/
          },
          /*error: (err: HttpErrorResponse) => { // Use HttpErrorResponse para acessar o status
            console.log('Chamando messageService.add() com erro...');
            console.log('Mensagem de erro:', {
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao criar Usuario!',
              life: 2000
            });
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao criar Usuario!',
              life: 2000
            });
            console.error('Erro ao criar usuário:', err); // Log do erro completo
          }*/
        }
      );
    }
  }

  getUserIdFromToken(): void {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const decodedToken: any = jwtDecode(token);
            this.userId = decodedToken.sub;
            console.log("ID do usuario extraido do token: ", this.userId);
        } catch (error) {
            console.error('Erro ao decodificar o token:', error);
            console.error('Token problemático:', token);
        }
    } else {
        console.error('Token não encontrado no localStorage.');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
