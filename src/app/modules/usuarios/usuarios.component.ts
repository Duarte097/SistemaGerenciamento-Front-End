import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { UserService } from 'src/app/service/user/User.service';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    ReactiveFormsModule,
    ToastModule
  ],
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  @Input() userId: number | null = null;
  public userData: any = {};
  value: string | undefined = "Disabled"

  constructor(private userServices: UserService) {}
  ngOnInit(): void {
    if (this.userId) {
      this.loadUserData();
    }else {
      console.log('Nenhum ID de projeto fornecido.');
    }

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isModalCreateOpen = false;
  isModalViewOpen = false;
  isModalEditOpen = false;

  openModalCreate() {
    this.isModalCreateOpen = true;  // Abre o modal
  }

  /*closeModalCreate() {
    this.isModalCreateOpen = false;  // Fecha o modal
    this.getTasksDatas()
  }

  openModalView(projectId: number) {
    this.selectedProjectId = projectId;
    this.isModalViewOpen = true;
    console.log(projectId);
  }

  closeModalView() {
    this.isModalViewOpen = false;  // Fecha o modal
  }

  openModalEdit(projectId: number) {
    this.selectedProjectId = projectId;
    this.isModalEditOpen = true;
  }

  closeModalEdit() {
    this.isModalEditOpen = false;
    this.getTasksDatas();
  }*/

  loadUserData() {
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
}
