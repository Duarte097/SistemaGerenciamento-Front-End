export interface CreateTaskRequest {
  nomeProjeto: string;
  descricao: string;
  dataInicio: Date;
  dataFim: Date;
  status: string;
  prioridade: string;
  idUsuario: string;
}
