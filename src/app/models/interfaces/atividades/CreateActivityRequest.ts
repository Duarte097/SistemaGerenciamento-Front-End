export interface CreateActivityRequest {
  nomeAtividade: string;
  descricao: string;
  dataInicio: Date;
  dataFim: Date;
  status: string;
  idUsuario: string;
  idProjeto: string;
}
