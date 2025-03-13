export interface CreateActivityRequest {
  nomeAtividade: string;
  descricao_atividade: string;
  dataInicio: Date;
  dataFim: Date;
  status: string;
  idUsuario: string;
  idProjeto: string;
}
