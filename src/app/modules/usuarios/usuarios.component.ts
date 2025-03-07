import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { UserService } from 'src/app/service/user/User.service';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { Subject, takeUntil } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { EditUserRequest } from 'src/app/models/interfaces/user/EditUserRequest';
import { GetAllUsersResponse } from 'src/app/models/interfaces/user/GetAllUsersResponse copy';
import { UsersDataTransferService } from 'src/app/shared/services/users/users-data-transfer.service';
import { MessageService } from 'primeng/api';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    ReactiveFormsModule,
    ToastModule,
    InputTextModule
  ],
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {
  private readonly destroy$: Subject<void> = new Subject();
  public userList: Array<GetAllUsersResponse> = [];
  @Output() closeModalEdit = new EventEmitter<void>();
  @Input() userId: number | null = null;
  public projectData: any = {
    usuarioResponsavel: {
      id_usuarios: null,
      nome: null
    }
  };
  public userData: any = {};
  editUserForm : FormGroup;
  selectedStatus: any;
  selectedUsuarios: any;
  selectedPrioridade: any;
  perfil: any[] = [];
  usuarios: any[] = [];


  constructor(
    private formBuilder: FormBuilder,
    private usersDtService: UsersDataTransferService,
    private userServices : UserService,
    private messageService: MessageService,
  ) {
    this.editUserForm = this.formBuilder.group({
      nome: ['', Validators.required],
      email: ['', Validators.required],
      senha: ['', Validators.required],
      perfil: ['', Validators.required],
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
    if (this.userId) {
        this.loadProjectData();
    } else {
        console.log('Nenhum ID de projeto fornecido.');
    }
    console.log("ID do usuário:", this.projectData.usuarioResponsavel.id_usuarios);
  }


  close() {
    this.closeModalEdit.emit();  // Emite um evento para o componente pai fechar o modal
  }

  openModalCreate() {
    this.isModalCreateOpen = true;  // Abre o modal
  }


  onSubmit(): void {
    console.log('Formulário enviado', this.editUserForm .value);
    if (this.editUserForm .valid && this.userId) {
      const usersData: EditUserRequest = {
        nome: this.editUserForm .value.nome,
        email: this.editUserForm .value.email,
        senha: this.editUserForm .value.senha,
        perfil: this.editUserForm .value.perfil
      };
      this.userServices.editUser(usersData, this.userId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.close();
            console.log('Chamando messageService.add() com sucesso...');
            console.log('Mensagem de sucesso:', {
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Projeto editado com sucesso!',
              life: 2000
            });
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Projeto editado com sucesso!',
              life: 2000
            });

          },
          error: (err) => {
            console.log('Chamando messageService.add() com erro...');
            console.log('Mensagem de erro:', {
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao editar o projeto!',
              life: 2000
            });
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao editar o projeto!',
              life: 2000
            });
          }
        }
      );
    }
  }

  loadProjectData() {
    console.log('Carregando projeto com ID:', this.userId);
    this.userServices.getUsersById(this.userId ?? 0).subscribe({
      next: (data) => {
        console.log('Dados do projeto recebidos:', data);
        this.userData = data;
      },
      error: (err) => {
        console.error('Erro ao carregar projeto:', err);
      }
    });
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
}
