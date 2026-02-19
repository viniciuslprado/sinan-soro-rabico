import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  ChevronRight, 
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Home,
  Activity,
  Stethoscope,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SinanRecord, SinanData } from './types';

const INITIAL_DATA: SinanData = {
  tipoNotificacao: 'INDIVIDUAL',
  agravoDoenca: 'ATENDIMENTO ANTIRRÁBICO HUMANO',
  dataNotificacao: new Date().toISOString().split('T')[0],
  ufNotificacao: '',
  municipioNotificacao: '',
  codigoIbgeNotificacao: '',
  unidadeSaude: '',
  codigoUnidade: '',
  dataAtendimento: new Date().toISOString().split('T')[0],
  nomePaciente: '',
  dataNascimento: '',
  idade: '',
  idadeTipo: '4',
  sexo: '',
  gestante: '6',
  racaCor: '',
  escolaridade: '',
  cartaoSus: '',
  nomeMae: '',
  residenciaUf: '',
  residenciaMunicipio: '',
  residenciaIbge: '',
  residenciaDistrito: '',
  residenciaBairro: '',
  residenciaLogradouro: '',
  residenciaLogradouroCodigo: '',
  residenciaNumero: '',
  residenciaComplemento: '',
  residenciaGeo1: '',
  residenciaGeo2: '',
  residenciaPontoReferencia: '',
  residenciaCep: '',
  residenciaTelefone: '',
  residenciaZona: '',
  residenciaPais: 'Brasil',
  ocupacao: '',
  exposicaoTipo: {
    contatoIndireto: false,
    arranhadura: false,
    lambedura: false,
    mordedura: false,
    outro: false,
  },
  localizacao: {
    mucosa: false,
    cabecaPescoco: false,
    maosPes: false,
    tronco: false,
    membrosSuperiores: false,
    membrosInferiores: false,
  },
  ferimento: '',
  ferimentoTipo: {
    profundo: false,
    superficial: false,
    dilacerante: false,
  },
  dataExposicao: '',
  antecedentesTratamento: '',
  antecedentesTipo: '',
  concluidoQuando: '',
  numeroDoses: '',
  especieAnimal: '',
  condicaoAnimal: '',
  animalObservavel: '',
  tratamentoIndicado: '',
  vacinaLaboratorio: '',
  vacinaLote: '',
  vacinaVencimento: '',
  vacinaDosesDatas: {
    dose1: '',
    dose2: '',
    dose3: '',
    dose4: '',
    dose5: '',
  },
  condicaoFinalAnimal: '',
  interrupcaoTratamento: '',
  motivoInterrupcao: '',
  unidadeProcurouPaciente: '',
  eventoAdversoVacina: '',
  indicacaoSoro: '2',
  pesoPaciente: '',
  quantidadeSoro: '',
  soroTipo: '',
  infiltracaoSoro: '',
  infiltracaoExtensao: '',
  soroLaboratorio: '',
  soroPartida: '',
  eventoAdversoSoro: '',
  dataEncerramento: '',
  observacoes: '',
  investigadorUnidade: '',
  investigadorCodigoUnidade: '',
  investigadorNome: '',
  investigadorFuncao: '',
};

export default function App() {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [records, setRecords] = useState<SinanRecord[]>([]);
  const [currentRecord, setCurrentRecord] = useState<SinanRecord | null>(null);
  const [formData, setFormData] = useState<SinanData>(INITIAL_DATA);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      setRecords(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const method = currentRecord ? 'PUT' : 'POST';
      const url = currentRecord ? `/api/notifications/${currentRecord.id}` : '/api/notifications';
      
      const payload = {
        patient_name: formData.nomePaciente,
        notification_date: formData.dataNotificacao,
        attendance_date: formData.dataAtendimento,
        data: formData
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setView('list');
        fetchRecords();
        setFormData(INITIAL_DATA);
        setCurrentRecord(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta notificação?')) return;
    try {
      await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
      fetchRecords();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (record: SinanRecord) => {
    setCurrentRecord(record);
    setFormData(record.data);
    setView('form');
  };

  const filteredRecords = records.filter(r => 
    r.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.id.toString().includes(searchTerm)
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white p-6 flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
            <ShieldAlert className="text-white" size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">SINAN</h1>
            <p className="text-xs text-slate-400">Vigilância Epidemiológica</p>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          <button 
            onClick={() => { setView('list'); setCurrentRecord(null); setFormData(INITIAL_DATA); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'list' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <ClipboardList size={20} />
            <span className="font-medium">Notificações</span>
          </button>
          <button 
            onClick={() => { setView('form'); setCurrentRecord(null); setFormData(INITIAL_DATA); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'form' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <Plus size={20} />
            <span className="font-medium">Nova Ficha</span>
          </button>
        </nav>

        <div className="mt-auto p-4 bg-slate-800 rounded-2xl border border-slate-700">
          <p className="text-xs text-slate-400 mb-1">Unidade Atual</p>
          <p className="text-sm font-medium">UPA Central - Franca/SP</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8">
        <AnimatePresence mode="wait">
          {view === 'list' ? (
            <motion.div 
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Histórico de Notificações</h2>
                  <p className="text-slate-500">Gerencie os atendimentos antirrábicos registrados.</p>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Buscar paciente ou ID..."
                    className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl w-full md:w-80 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : filteredRecords.length > 0 ? (
                <div className="grid gap-4">
                  {filteredRecords.map((record) => (
                    <motion.div 
                      key={record.id}
                      layoutId={`record-${record.id}`}
                      className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                          <User size={24} />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900">{record.patient_name}</h3>
                          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                            <span className="flex items-center gap-1"><FileText size={14} /> ID: {record.id}</span>
                            <span className="flex items-center gap-1"><ClipboardList size={14} /> Notif: {new Date(record.notification_date).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1"><Activity size={14} /> Atend: {new Date(record.attendance_date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEdit(record)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Editar"
                        >
                          <Edit3 size={20} />
                        </button>
                        <button 
                          onClick={() => handleDelete(record.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Excluir"
                        >
                          <Trash2 size={20} />
                        </button>
                        <ChevronRight className="text-slate-300 ml-2" size={20} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <ClipboardList size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Nenhuma notificação encontrada</h3>
                  <p className="text-slate-500 max-w-xs mx-auto mt-2">Comece criando uma nova ficha de investigação para registrar um atendimento.</p>
                  <button 
                    onClick={() => setView('form')}
                    className="mt-6 btn-primary mx-auto"
                  >
                    <Plus size={20} /> Criar Primeira Ficha
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <button 
                  onClick={() => setView('list')}
                  className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-all"
                >
                  <ArrowLeft size={20} /> Voltar ao histórico
                </button>
                <div className="text-right">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {currentRecord ? 'Editar Notificação' : 'Nova Notificação'}
                  </h2>
                  <p className="text-sm text-slate-500">Ficha de Investigação de Atendimento Antirrábico</p>
                </div>
              </div>

              <form onSubmit={handleSave} className="pb-20">
                {/* 1. Dados Gerais */}
                <div className="form-section">
                  <div className="flex items-center gap-2 mb-6 text-blue-600">
                    <FileText size={20} />
                    <h3 className="font-bold uppercase tracking-widest text-sm">1. Dados Gerais</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="form-label">Número SINAN</label>
                      <input 
                        type="text" className="form-input" 
                        value={formData.numeroSinan}
                        onChange={e => setFormData({...formData, numeroSinan: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="form-label">Data da Notificação</label>
                      <input 
                        type="date" className="form-input" required
                        value={formData.dataNotificacao}
                        onChange={e => setFormData({...formData, dataNotificacao: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="form-label">Data do Atendimento</label>
                      <input 
                        type="date" className="form-input" required
                        value={formData.dataAtendimento}
                        onChange={e => setFormData({...formData, dataAtendimento: e.target.value})}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="form-label">Unidade de Saúde</label>
                      <input 
                        type="text" className="form-input" 
                        value={formData.unidadeSaude}
                        onChange={e => setFormData({...formData, unidadeSaude: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="form-label">Código da Unidade</label>
                      <input 
                        type="text" className="form-input" 
                        value={formData.codigoUnidade}
                        onChange={e => setFormData({...formData, codigoUnidade: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Notificação Individual */}
                <div className="form-section">
                  <div className="flex items-center gap-2 mb-6 text-blue-600">
                    <User size={20} />
                    <h3 className="font-bold uppercase tracking-widest text-sm">2. Notificação Individual</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-3">
                      <label className="form-label">Nome do Paciente</label>
                      <input 
                        type="text" className="form-input" required
                        value={formData.nomePaciente}
                        onChange={e => setFormData({...formData, nomePaciente: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="form-label">Data de Nascimento</label>
                      <input 
                        type="date" className="form-input" 
                        value={formData.dataNascimento}
                        onChange={e => setFormData({...formData, dataNascimento: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="form-label">Idade</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" className="form-input flex-1" 
                          value={formData.idade}
                          onChange={e => setFormData({...formData, idade: e.target.value})}
                        />
                        <select 
                          className="form-select w-24"
                          value={formData.idadeTipo}
                          onChange={e => setFormData({...formData, idadeTipo: e.target.value})}
                        >
                          <option value="1">Hora</option>
                          <option value="2">Dia</option>
                          <option value="3">Mês</option>
                          <option value="4">Ano</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="form-label">Sexo</label>
                      <select 
                        className="form-select"
                        value={formData.sexo}
                        onChange={e => setFormData({...formData, sexo: e.target.value})}
                      >
                        <option value="">Selecione</option>
                        <option value="M">Masculino</option>
                        <option value="F">Feminino</option>
                        <option value="I">Ignorado</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Gestante</label>
                      <select 
                        className="form-select"
                        value={formData.gestante}
                        onChange={e => setFormData({...formData, gestante: e.target.value})}
                      >
                        <option value="1">1º Trimestre</option>
                        <option value="2">2º Trimestre</option>
                        <option value="3">3º Trimestre</option>
                        <option value="4">Idade gestacional ignorada</option>
                        <option value="5">Não</option>
                        <option value="6">Não se aplica</option>
                        <option value="9">Ignorado</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Raça/Cor</label>
                      <select 
                        className="form-select"
                        value={formData.racaCor}
                        onChange={e => setFormData({...formData, racaCor: e.target.value})}
                      >
                        <option value="">Selecione</option>
                        <option value="1">Branca</option>
                        <option value="2">Preta</option>
                        <option value="3">Amarela</option>
                        <option value="4">Parda</option>
                        <option value="5">Indígena</option>
                        <option value="9">Ignorado</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="form-label">Escolaridade</label>
                      <select 
                        className="form-select"
                        value={formData.escolaridade}
                        onChange={e => setFormData({...formData, escolaridade: e.target.value})}
                      >
                        <option value="">Selecione</option>
                        <option value="0">Analfabeto</option>
                        <option value="1">1ª a 4ª série incompleta do EF</option>
                        <option value="2">4ª série completa do EF</option>
                        <option value="3">5ª à 8ª série incompleta do EF</option>
                        <option value="4">Ensino fundamental completo</option>
                        <option value="5">Ensino médio incompleto</option>
                        <option value="6">Ensino médio completo</option>
                        <option value="7">Educação superior incompleta</option>
                        <option value="8">Educação superior completa</option>
                        <option value="9">Ignorado</option>
                        <option value="10">Não se aplica</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="form-label">Nº Cartão SUS</label>
                      <input 
                        type="text" className="form-input" 
                        value={formData.cartaoSus}
                        onChange={e => setFormData({...formData, cartaoSus: e.target.value})}
                      />
                    </div>
                    <div className="md:col-span-4">
                      <label className="form-label">Nome da Mãe</label>
                      <input 
                        type="text" className="form-input" 
                        value={formData.nomeMae}
                        onChange={e => setFormData({...formData, nomeMae: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Dados de Residência */}
                <div className="form-section">
                  <div className="flex items-center gap-2 mb-6 text-blue-600">
                    <Home size={20} />
                    <h3 className="font-bold uppercase tracking-widest text-sm">3. Dados de Residência</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                      <label className="form-label">UF</label>
                      <input 
                        type="text" className="form-input" 
                        value={formData.residenciaUf}
                        onChange={e => setFormData({...formData, residenciaUf: e.target.value})}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="form-label">Município de Residência</label>
                      <input 
                        type="text" className="form-input" 
                        value={formData.residenciaMunicipio}
                        onChange={e => setFormData({...formData, residenciaMunicipio: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="form-label">Código IBGE</label>
                      <input 
                        type="text" className="form-input" 
                        value={formData.residenciaIbge}
                        onChange={e => setFormData({...formData, residenciaIbge: e.target.value})}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="form-label">Bairro</label>
                      <input 
                        type="text" className="form-input" 
                        value={formData.residenciaBairro}
                        onChange={e => setFormData({...formData, residenciaBairro: e.target.value})}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="form-label">Logradouro</label>
                      <input 
                        type="text" className="form-input" 
                        value={formData.residenciaLogradouro}
                        onChange={e => setFormData({...formData, residenciaLogradouro: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="form-label">Número</label>
                      <input 
                        type="text" className="form-input" 
                        value={formData.residenciaNumero}
                        onChange={e => setFormData({...formData, residenciaNumero: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="form-label">CEP</label>
                      <input 
                        type="text" className="form-input" 
                        value={formData.residenciaCep}
                        onChange={e => setFormData({...formData, residenciaCep: e.target.value})}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="form-label">Telefone</label>
                      <input 
                        type="text" className="form-input" 
                        value={formData.residenciaTelefone}
                        onChange={e => setFormData({...formData, residenciaTelefone: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="form-label">Zona</label>
                      <select 
                        className="form-select"
                        value={formData.residenciaZona}
                        onChange={e => setFormData({...formData, residenciaZona: e.target.value})}
                      >
                        <option value="">Selecione</option>
                        <option value="1">Urbana</option>
                        <option value="2">Rural</option>
                        <option value="3">Periurbana</option>
                        <option value="9">Ignorado</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 4. Antecedentes Epidemiológicos */}
                <div className="form-section">
                  <div className="flex items-center gap-2 mb-6 text-blue-600">
                    <Activity size={20} />
                    <h3 className="font-bold uppercase tracking-widest text-sm">4. Antecedentes Epidemiológicos</h3>
                  </div>
                  <div className="space-y-8">
                    <div>
                      <label className="form-label mb-3">Tipo de Exposição ao Vírus Rábico</label>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {Object.keys(formData.exposicaoTipo).map((key) => (
                          <label key={key} className="flex items-center gap-2 cursor-pointer group">
                            <input 
                              type="checkbox" 
                              className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                              checked={(formData.exposicaoTipo as any)[key]}
                              onChange={e => setFormData({
                                ...formData, 
                                exposicaoTipo: { ...formData.exposicaoTipo, [key]: e.target.checked }
                              })}
                            />
                            <span className="text-sm text-slate-600 group-hover:text-slate-900 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="form-label mb-3">Localização do Ferimento</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Object.keys(formData.localizacao).map((key) => (
                          <label key={key} className="flex items-center gap-2 cursor-pointer group">
                            <input 
                              type="checkbox" 
                              className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                              checked={(formData.localizacao as any)[key]}
                              onChange={e => setFormData({
                                ...formData, 
                                localizacao: { ...formData.localizacao, [key]: e.target.checked }
                              })}
                            />
                            <span className="text-sm text-slate-600 group-hover:text-slate-900 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="form-label">Ferimento</label>
                        <select 
                          className="form-select"
                          value={formData.ferimento}
                          onChange={e => setFormData({...formData, ferimento: e.target.value})}
                        >
                          <option value="">Selecione</option>
                          <option value="1">Único</option>
                          <option value="2">Múltiplo</option>
                          <option value="3">Sem ferimento</option>
                          <option value="9">Ignorado</option>
                        </select>
                      </div>
                      <div>
                        <label className="form-label">Data da Exposição</label>
                        <input 
                          type="date" className="form-input" 
                          value={formData.dataExposicao}
                          onChange={e => setFormData({...formData, dataExposicao: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="form-label">Espécie do Animal</label>
                        <select 
                          className="form-select"
                          value={formData.especieAnimal}
                          onChange={e => setFormData({...formData, especieAnimal: e.target.value})}
                        >
                          <option value="">Selecione</option>
                          <option value="1">Canina</option>
                          <option value="2">Felina</option>
                          <option value="3">Quiróptera (Morcego)</option>
                          <option value="4">Primata (Macaco)</option>
                          <option value="5">Raposa</option>
                          <option value="6">Herbívoro doméstico</option>
                          <option value="7">Outra</option>
                        </select>
                      </div>
                      <div>
                        <label className="form-label">Condição do Animal</label>
                        <select 
                          className="form-select"
                          value={formData.condicaoAnimal}
                          onChange={e => setFormData({...formData, condicaoAnimal: e.target.value})}
                        >
                          <option value="">Selecione</option>
                          <option value="1">Sadio</option>
                          <option value="2">Suspeito</option>
                          <option value="3">Raivoso</option>
                          <option value="4">Morto/Desaparecido</option>
                        </select>
                      </div>
                      <div>
                        <label className="form-label">Passível de Observação?</label>
                        <select 
                          className="form-select"
                          value={formData.animalObservavel}
                          onChange={e => setFormData({...formData, animalObservavel: e.target.value})}
                        >
                          <option value="">Selecione</option>
                          <option value="1">Sim</option>
                          <option value="2">Não</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. Tratamento Atual */}
                <div className="form-section">
                  <div className="flex items-center gap-2 mb-6 text-blue-600">
                    <Stethoscope size={20} />
                    <h3 className="font-bold uppercase tracking-widest text-sm">5. Tratamento Atual</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="form-label">Tratamento Indicado</label>
                      <select 
                        className="form-select"
                        value={formData.tratamentoIndicado}
                        onChange={e => setFormData({...formData, tratamentoIndicado: e.target.value})}
                      >
                        <option value="">Selecione</option>
                        <option value="1">Pré Exposição</option>
                        <option value="2">Dispensa de Tratamento</option>
                        <option value="3">Observação do animal (se cão ou gato)</option>
                        <option value="4">Observação + Vacina</option>
                        <option value="5">Vacina</option>
                        <option value="6">Soro + Vacina</option>
                        <option value="7">Esquema de Reexposição</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Laboratório Produtor</label>
                      <select 
                        className="form-select"
                        value={formData.vacinaLaboratorio}
                        onChange={e => setFormData({...formData, vacinaLaboratorio: e.target.value})}
                      >
                        <option value="">Selecione</option>
                        <option value="1">Instituto Butantan</option>
                        <option value="2">Instituto Vital Brasil</option>
                        <option value="3">Aventis Pasteur</option>
                        <option value="4">Outro</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Número do Lote</label>
                      <input 
                        type="text" className="form-input" 
                        value={formData.vacinaLote}
                        onChange={e => setFormData({...formData, vacinaLote: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="mt-8">
                    <label className="form-label mb-3">Datas das Aplicações (Dia/Mês)</label>
                    <div className="grid grid-cols-5 gap-4">
                      {['1ª', '2ª', '3ª', '4ª', '5ª'].map((dose, i) => (
                        <div key={dose}>
                          <label className="text-[10px] text-slate-400 uppercase font-bold mb-1 block">{dose} dose</label>
                          <input 
                            type="text" placeholder="DD/MM" className="form-input text-center" 
                            value={(formData.vacinaDosesDatas as any)[`dose${i+1}`]}
                            onChange={e => setFormData({
                              ...formData, 
                              vacinaDosesDatas: { ...formData.vacinaDosesDatas, [`dose${i+1}`]: e.target.value }
                            })}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 6. Soro Antirrábico (Conditional) */}
                <div className="form-section">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 text-blue-600">
                      <AlertCircle size={20} />
                      <h3 className="font-bold uppercase tracking-widest text-sm">6. Soro Antirrábico</h3>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-bold text-slate-400">INDICADO?</span>
                      <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button 
                          type="button"
                          onClick={() => setFormData({...formData, indicacaoSoro: '1'})}
                          className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${formData.indicacaoSoro === '1' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
                        >
                          SIM
                        </button>
                        <button 
                          type="button"
                          onClick={() => setFormData({...formData, indicacaoSoro: '2'})}
                          className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${formData.indicacaoSoro === '2' ? 'bg-white text-slate-600 shadow-sm' : 'text-slate-400'}`}
                        >
                          NÃO
                        </button>
                      </div>
                    </div>
                  </div>

                  {formData.indicacaoSoro === '1' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-6 pt-4 border-t border-slate-100"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="form-label">Peso do Paciente (Kg)</label>
                          <input 
                            type="text" className="form-input" 
                            value={formData.pesoPaciente}
                            onChange={e => setFormData({...formData, pesoPaciente: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="form-label">Quantidade Aplicada (ml)</label>
                          <input 
                            type="text" className="form-input" 
                            value={formData.quantidadeSoro}
                            onChange={e => setFormData({...formData, quantidadeSoro: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="form-label">Tipo de Soro</label>
                          <select 
                            className="form-select"
                            value={formData.soroTipo}
                            onChange={e => setFormData({...formData, soroTipo: e.target.value})}
                          >
                            <option value="">Selecione</option>
                            <option value="1">Heterólogo</option>
                            <option value="2">Homólogo</option>
                          </select>
                        </div>
                        <div>
                          <label className="form-label">Infiltração no Local?</label>
                          <select 
                            className="form-select"
                            value={formData.infiltracaoSoro}
                            onChange={e => setFormData({...formData, infiltracaoSoro: e.target.value})}
                          >
                            <option value="">Selecione</option>
                            <option value="1">Sim</option>
                            <option value="2">Não</option>
                          </select>
                        </div>
                        <div>
                          <label className="form-label">Extensão da Infiltração</label>
                          <select 
                            className="form-select"
                            value={formData.infiltracaoExtensao}
                            onChange={e => setFormData({...formData, infiltracaoExtensao: e.target.value})}
                          >
                            <option value="">Selecione</option>
                            <option value="Total">Total</option>
                            <option value="Parcial">Parcial</option>
                          </select>
                        </div>
                        <div>
                          <label className="form-label">Laboratório do Soro</label>
                          <input 
                            type="text" className="form-input" 
                            value={formData.soroLaboratorio}
                            onChange={e => setFormData({...formData, soroLaboratorio: e.target.value})}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* 7. Conclusão e Eventos */}
                <div className="form-section">
                  <div className="flex items-center gap-2 mb-6 text-blue-600">
                    <CheckCircle2 size={20} />
                    <h3 className="font-bold uppercase tracking-widest text-sm">7. Conclusão e Eventos</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="form-label">Condição Final do Animal</label>
                      <select 
                        className="form-select"
                        value={formData.condicaoFinalAnimal}
                        onChange={e => setFormData({...formData, condicaoFinalAnimal: e.target.value})}
                      >
                        <option value="">Selecione</option>
                        <option value="1">Negativo para Raiva (Clínica)</option>
                        <option value="2">Negativo para Raiva (Laboratório)</option>
                        <option value="3">Positivo para Raiva (Clínica)</option>
                        <option value="4">Positivo para Raiva (Laboratório)</option>
                        <option value="5">Morto/Sacrificado/Sem Diagnóstico</option>
                        <option value="9">Ignorado</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Houve Interrupção do Tratamento?</label>
                      <select 
                        className="form-select"
                        value={formData.interrupcaoTratamento}
                        onChange={e => setFormData({...formData, interrupcaoTratamento: e.target.value})}
                      >
                        <option value="">Selecione</option>
                        <option value="1">Sim</option>
                        <option value="2">Não</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="form-label">Observações Gerais</label>
                      <textarea 
                        className="form-input h-32 resize-none"
                        value={formData.observacoes}
                        onChange={e => setFormData({...formData, observacoes: e.target.value})}
                        placeholder="Descreva detalhes adicionais sobre o acidente, conduta médica ou eventos adversos..."
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* 8. Investigador */}
                <div className="form-section">
                  <div className="flex items-center gap-2 mb-6 text-blue-600">
                    <ShieldAlert size={20} />
                    <h3 className="font-bold uppercase tracking-widest text-sm">8. Investigador</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="form-label">Nome do Investigador</label>
                      <input 
                        type="text" className="form-input" 
                        value={formData.investigadorNome}
                        onChange={e => setFormData({...formData, investigadorNome: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="form-label">Função</label>
                      <input 
                        type="text" className="form-input" 
                        value={formData.investigadorFuncao}
                        onChange={e => setFormData({...formData, investigadorFuncao: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-white/80 backdrop-blur-md border-t border-slate-200 p-4 flex justify-end gap-4 z-50">
                  <button 
                    type="button"
                    onClick={() => setView('list')}
                    className="btn-secondary"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? 'Salvando...' : (
                      <>
                        <CheckCircle2 size={20} />
                        {currentRecord ? 'Atualizar Notificação' : 'Salvar Notificação'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
