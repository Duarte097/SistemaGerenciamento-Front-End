export interface CreateTaskResponse {
  id: string;
  nome: string;
  descricao: string;
  dataInicio: Date;
  dataFim: Date;
  status: string;
  idUsuario: string;
}
