export interface GetAllTasksResponse {
  amount: number;
  idProjeto: number;
  nomeProjeto: string;
  descricao: string;
  dataInicio: Date;
  dataFim: Date;
  status: string;
  prioridade: string;
  idUsuarios: string;
}
