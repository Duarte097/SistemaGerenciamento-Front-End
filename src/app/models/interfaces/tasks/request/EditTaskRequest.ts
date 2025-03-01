export interface EditTaskRequest {
  idProjeto: number;
  nomeProjeto: string;
  descricao: string;
  dataInicio: Date;
  dataFim: Date;
  status: string;
  prioridade: string;
  amount: number;
}
