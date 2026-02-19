export interface SinanData {
  // Dados Gerais
  numeroSinan?: string;
  tipoNotificacao: string;
  agravoDoenca: string;
  dataNotificacao: string;
  ufNotificacao: string;
  municipioNotificacao: string;
  codigoIbgeNotificacao: string;
  unidadeSaude: string;
  codigoUnidade: string;
  dataAtendimento: string;

  // Notificação Individual
  nomePaciente: string;
  dataNascimento: string;
  idade: string;
  idadeTipo: string; // 1-Hora, 2-Dia, 3-Mês, 4-Ano
  sexo: string;
  gestante: string;
  racaCor: string;
  escolaridade: string;
  cartaoSus: string;
  nomeMae: string;

  // Dados de Residência
  residenciaUf: string;
  residenciaMunicipio: string;
  residenciaIbge: string;
  residenciaDistrito: string;
  residenciaBairro: string;
  residenciaLogradouro: string;
  residenciaLogradouroCodigo: string;
  residenciaNumero: string;
  residenciaComplemento: string;
  residenciaGeo1: string;
  residenciaGeo2: string;
  residenciaPontoReferencia: string;
  residenciaCep: string;
  residenciaTelefone: string;
  residenciaZona: string;
  residenciaPais: string;

  // Antecedentes Epidemiológicos
  ocupacao: string;
  exposicaoTipo: {
    contatoIndireto: boolean;
    arranhadura: boolean;
    lambedura: boolean;
    mordedura: boolean;
    outro: boolean;
  };
  localizacao: {
    mucosa: boolean;
    cabecaPescoco: boolean;
    maosPes: boolean;
    tronco: boolean;
    membrosSuperiores: boolean;
    membrosInferiores: boolean;
  };
  ferimento: string; // 1-Único, 2-Múltiplo, 3-Sem ferimento
  ferimentoTipo: {
    profundo: boolean;
    superficial: boolean;
    dilacerante: boolean;
  };
  dataExposicao: string;
  antecedentesTratamento: string;
  antecedentesTipo: string; // Pré ou Pós
  concluidoQuando: string;
  numeroDoses: string;
  especieAnimal: string;
  especieAnimalOutro?: string;
  condicaoAnimal: string;
  animalObservavel: string;

  // Tratamento Atual
  tratamentoIndicado: string;
  vacinaLaboratorio: string;
  vacinaLaboratorioOutro?: string;
  vacinaLote: string;
  vacinaVencimento: string;
  vacinaDosesDatas: {
    dose1: string;
    dose2: string;
    dose3: string;
    dose4: string;
    dose5: string;
  };

  // Conclusão
  condicaoFinalAnimal: string;
  interrupcaoTratamento: string;
  motivoInterrupcao: string;
  unidadeProcurouPaciente: string;
  eventoAdversoVacina: string;

  // Soro
  indicacaoSoro: string;
  pesoPaciente: string;
  quantidadeSoro: string;
  soroTipo: string;
  infiltracaoSoro: string;
  infiltracaoExtensao: string;
  soroLaboratorio: string;
  soroLaboratorioOutro?: string;
  soroPartida: string;
  eventoAdversoSoro: string;
  dataEncerramento: string;
  observacoes: string;

  // Investigador
  investigadorUnidade: string;
  investigadorCodigoUnidade: string;
  investigadorNome: string;
  investigadorFuncao: string;
}

export interface SinanRecord {
  id: number;
  patient_name: string;
  notification_date: string;
  attendance_date: string;
  status: string;
  data: SinanData;
  created_at: string;
}
