import { useState, useMemo, useEffect } from 'react';
import {
  TrendingUp,
  Building2,
  Layers,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Star,
  Info,
  Wallet
} from 'lucide-react';
import {
  BANCOS_DIGITAIS,
  MODALIDADES_INVESTIMENTO,
  calcularRendimentoBanco,
  calcularRendimentoModalidade,
  SimulacaoSalva
} from '../types/bancosDigitais';
import { formatarMoeda } from '../utils/calculos';
import { cn } from '../utils/cn';

type AbaComparacao = 'bancos' | 'modalidades';

// Carregar simulações salvas do histórico
const carregarSimulacoes = (): SimulacaoSalva[] => {
  try {
    const dados = localStorage.getItem('jurus_historico');
    if (dados) {
      const parsed = JSON.parse(dados);
      return parsed.map((item: any, index: number) => ({
        id: `sim-${index}`,
        nome: item.nome || `Simulação ${index + 1}`,
        valorInicial: item.input?.valorInicial || 1000,
        aporteMensal: item.input?.aporteMensal || 100,
        prazoMeses: item.input?.prazoMeses || 12,
        taxaAnual: item.input?.taxa || 12,
        dataCriacao: item.data || new Date().toISOString()
      }));
    }
  } catch (e) { }
  return [];
};

export function Comparacao() {
  const [abaAtiva, setAbaAtiva] = useState<AbaComparacao>('bancos');
  const [simulacoes, setSimulacoes] = useState<SimulacaoSalva[]>([]);
  const [simulacaoSelecionada, setSimulacaoSelecionada] = useState<SimulacaoSalva | null>(null);
  const [itemExpandido, setItemExpandido] = useState<string | null>(null);

  // Dados de simulação
  const [valorInicial, setValorInicial] = useState(1000);
  const [aporteMensal, setAporteMensal] = useState(100);
  const [prazoMeses, setPrazoMeses] = useState(12);

  useEffect(() => {
    const sims = carregarSimulacoes();
    setSimulacoes(sims);
    if (sims.length > 0) {
      setSimulacaoSelecionada(sims[0]);
      setValorInicial(sims[0].valorInicial);
      setAporteMensal(sims[0].aporteMensal);
      setPrazoMeses(sims[0].prazoMeses);
    }
  }, []);

  // Comparações
  const comparacaoBancos = useMemo(() => {
    return BANCOS_DIGITAIS.map(banco =>
      calcularRendimentoBanco(banco, valorInicial, aporteMensal, prazoMeses)
    ).sort((a, b) => b.totalFinal - a.totalFinal);
  }, [valorInicial, aporteMensal, prazoMeses]);

  const comparacaoModalidades = useMemo(() => {
    return MODALIDADES_INVESTIMENTO.map(mod =>
      calcularRendimentoModalidade(mod, valorInicial, aporteMensal, prazoMeses)
    ).sort((a, b) => b.totalFinal - a.totalFinal);
  }, [valorInicial, aporteMensal, prazoMeses]);

  const melhorBanco = comparacaoBancos[0];
  const melhorModalidade = comparacaoModalidades[0];

  const selecionarSimulacao = (sim: SimulacaoSalva) => {
    setSimulacaoSelecionada(sim);
    setValorInicial(sim.valorInicial);
    setAporteMensal(sim.aporteMensal);
    setPrazoMeses(sim.prazoMeses);
  };

  const toggleExpand = (id: string) => {
    setItemExpandido(itemExpandido === id ? null : id);
  };

  const getMedal = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}º`;
  };

  return (
    <div className="page-container space-y-4">
      {/* Header compacto */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              Comparar
            </h1>
            <p className="text-xs text-gray-500">Escolha o melhor</p>
          </div>
        </div>
      </div>

      {/* Abas */}
      <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
        <button
          onClick={() => setAbaAtiva('bancos')}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-all',
            abaAtiva === 'bancos'
              ? 'bg-white dark:bg-gray-700 text-purple-600 shadow-sm'
              : 'text-gray-500'
          )}
        >
          <Building2 className="w-4 h-4" />
          <span>Bancos</span>
        </button>
        <button
          onClick={() => setAbaAtiva('modalidades')}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-all',
            abaAtiva === 'modalidades'
              ? 'bg-white dark:bg-gray-700 text-purple-600 shadow-sm'
              : 'text-gray-500'
          )}
        >
          <Layers className="w-4 h-4" />
          <span>Modalidades</span>
        </button>
      </div>

      {/* Simulação - Compacta */}
      <div className="card-mobile !p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Wallet className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Simulação</span>
          </div>
          {simulacoes.length > 0 && (
            <select
              value={simulacaoSelecionada?.id || ''}
              onChange={(e) => {
                const sim = simulacoes.find(s => s.id === e.target.value);
                if (sim) selecionarSimulacao(sim);
              }}
              className="text-xs border rounded-lg px-2 py-1 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
            >
              <option value="">Personalizada</option>
              {simulacoes.map(sim => (
                <option key={sim.id} value={sim.id}>{sim.nome}</option>
              ))}
            </select>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-[10px] text-gray-400 mb-0.5">Inicial</label>
            <input
              type="number"
              value={valorInicial || ''}
              onChange={(e) => setValorInicial(Number(e.target.value))}
              className="w-full px-2 py-1.5 text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-[10px] text-gray-400 mb-0.5">Mensal</label>
            <input
              type="number"
              value={aporteMensal || ''}
              onChange={(e) => setAporteMensal(Number(e.target.value))}
              className="w-full px-2 py-1.5 text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-[10px] text-gray-400 mb-0.5">Meses</label>
            <input
              type="number"
              value={prazoMeses || ''}
              onChange={(e) => setPrazoMeses(Number(e.target.value))}
              className="w-full px-2 py-1.5 text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600"
            />
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-gray-500">Total investido:</span>
          <span className="font-bold text-gray-900 dark:text-white">
            {formatarMoeda(valorInicial + (aporteMensal * prazoMeses))}
          </span>
        </div>
      </div>

      {/* Destaque - Melhor opção */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-4 text-white">
        <div className="flex items-center gap-1.5 mb-1">
          <Star className="w-4 h-4" />
          <span className="text-sm font-medium opacity-90">
            {abaAtiva === 'bancos' ? 'Melhor Banco' : 'Melhor Modalidade'}
          </span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xl font-bold">
              {abaAtiva === 'bancos'
                ? `${melhorBanco?.banco.logo} ${melhorBanco?.banco.nome}`
                : melhorModalidade?.modalidade.nome
              }
            </p>
            <p className="text-white/80 text-xs">
              +{formatarMoeda(abaAtiva === 'bancos' ? melhorBanco?.rendimentoLiquido || 0 : melhorModalidade?.rendimentoLiquido || 0)} de juros
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">
              {formatarMoeda(abaAtiva === 'bancos' ? melhorBanco?.totalFinal || 0 : melhorModalidade?.totalFinal || 0)}
            </p>
            <p className="text-[10px] text-white/70">Total Final</p>
          </div>
        </div>
      </div>

      {/* Lista - Bancos */}
      {abaAtiva === 'bancos' && (
        <div className="space-y-2">
          {comparacaoBancos.map((item, index) => (
            <div
              key={item.banco.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              <button
                onClick={() => toggleExpand(item.banco.id)}
                className="w-full p-3 flex items-center gap-3"
              >
                {/* Posição */}
                <div className="w-8 text-center font-bold text-lg">
                  {getMedal(index)}
                </div>

                {/* Logo */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ backgroundColor: item.banco.cor + '20' }}
                >
                  {item.banco.logo}
                </div>

                {/* Info */}
                <div className="flex-1 text-left">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    {item.banco.nome}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.banco.taxaCDB}% CDI
                  </p>
                </div>

                {/* Valor */}
                <div className="text-right">
                  <p className="font-bold text-green-600 text-sm">
                    {formatarMoeda(item.totalFinal)}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    +{formatarMoeda(item.rendimentoLiquido)}
                  </p>
                </div>

                {itemExpandido === item.banco.id
                  ? <ChevronUp className="w-4 h-4 text-gray-400" />
                  : <ChevronDown className="w-4 h-4 text-gray-400" />
                }
              </button>

              {/* Expandido */}
              {itemExpandido === item.banco.id && (
                <div className="px-3 pb-3 pt-0 border-t border-gray-100 dark:border-gray-700">
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <p className="text-[10px] font-medium text-green-600 mb-1 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Prós
                      </p>
                      <ul className="space-y-0.5">
                        {item.banco.pros.slice(0, 3).map((pro, i) => (
                          <li key={i} className="text-[11px] text-gray-600 dark:text-gray-400">
                            • {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-red-500 mb-1 flex items-center gap-1">
                        <X className="w-3 h-3" /> Contras
                      </p>
                      <ul className="space-y-0.5">
                        {item.banco.contras.slice(0, 3).map((contra, i) => (
                          <li key={i} className="text-[11px] text-gray-600 dark:text-gray-400">
                            • {contra}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.banco.categorias.map(cat => (
                      <span key={cat} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px] text-gray-500">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lista - Modalidades */}
      {abaAtiva === 'modalidades' && (
        <div className="space-y-2">
          {comparacaoModalidades.map((item, index) => (
            <div
              key={item.modalidade.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              <button
                onClick={() => toggleExpand(item.modalidade.id)}
                className="w-full p-3 flex items-center gap-3"
              >
                {/* Posição */}
                <div className="w-8 text-center font-bold text-lg">
                  {getMedal(index)}
                </div>

                {/* Ícone risco */}
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  item.modalidade.risco === 'baixo' && "bg-green-100 dark:bg-green-900/30",
                  item.modalidade.risco === 'medio' && "bg-yellow-100 dark:bg-yellow-900/30",
                  item.modalidade.risco === 'alto' && "bg-red-100 dark:bg-red-900/30"
                )}>
                  <span className={cn(
                    "text-sm font-bold",
                    item.modalidade.risco === 'baixo' && "text-green-600",
                    item.modalidade.risco === 'medio' && "text-yellow-600",
                    item.modalidade.risco === 'alto' && "text-red-600"
                  )}>
                    {item.modalidade.nome.substring(0, 3)}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 text-left">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    {item.modalidade.nome}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.modalidade.rentabilidadeMedia}% a.a. • {item.modalidade.risco}
                  </p>
                </div>

                {/* Valor */}
                <div className="text-right">
                  <p className="font-bold text-green-600 text-sm">
                    {formatarMoeda(item.totalFinal)}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    IR: {item.modalidade.tributacao}%
                  </p>
                </div>

                {itemExpandido === item.modalidade.id
                  ? <ChevronUp className="w-4 h-4 text-gray-400" />
                  : <ChevronDown className="w-4 h-4 text-gray-400" />
                }
              </button>

              {/* Expandido */}
              {itemExpandido === item.modalidade.id && (
                <div className="px-3 pb-3 pt-0 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500 mt-2 mb-2">
                    {item.modalidade.descricao}
                  </p>

                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <div className="text-center p-1.5 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-[10px] text-gray-400">Liquidez</p>
                      <p className="text-xs font-medium capitalize">{item.modalidade.liquidez}</p>
                    </div>
                    <div className="text-center p-1.5 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-[10px] text-gray-400">Mínimo</p>
                      <p className="text-xs font-medium">{formatarMoeda(item.modalidade.valorMinimo)}</p>
                    </div>
                    <div className="text-center p-1.5 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-[10px] text-gray-400">IR</p>
                      <p className="text-xs font-medium">{item.modalidade.tributacao}%</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] font-medium text-green-600 mb-1">✓ Prós</p>
                      <ul className="space-y-0.5">
                        {item.modalidade.pros.map((pro, i) => (
                          <li key={i} className="text-[11px] text-gray-600 dark:text-gray-400">• {pro}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-red-500 mb-1">✗ Contras</p>
                      <ul className="space-y-0.5">
                        {item.modalidade.contras.map((contra, i) => (
                          <li key={i} className="text-[11px] text-gray-600 dark:text-gray-400">• {contra}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Dica */}
      <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
        <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-amber-700 dark:text-amber-300">
          Valores estimados. Consulte cada instituição para taxas atualizadas.
        </p>
      </div>
    </div>
  );
}
