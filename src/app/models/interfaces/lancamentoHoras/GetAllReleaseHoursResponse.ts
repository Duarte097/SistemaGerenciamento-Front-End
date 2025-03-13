export interface GetAllReleaseHoursResponse {
  amount: number;
  id_lancamentos_horas: number;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  dataLancamento: string;
  idAtividade: string;
  idProjetos: string;
  totalHoras?: number;
  nomeAtividade: string;
}
