export interface CreateTaskRequest {
  nome: string;
  descricao: string;
  dataInicio: Date;
  dataFim: Date;
  status: string;
  idUsuario: string;
}
