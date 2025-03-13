export interface GetAllReleaseHoursResponse {
  amount: number;
  id_lancamentos_horas: number;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  dataLancamento: string;
  id_atividade: string;
  idProjetos: string;
  totalHoras?: number;
  atividade: {
    id_atividade: string;
    nomeAtividade: string;
  };
}
