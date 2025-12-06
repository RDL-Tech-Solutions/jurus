import { useState } from 'react';
import { Target, PiggyBank, Wallet, Shield, Calculator, AlertCircle, Check, Info } from 'lucide-react';
import { Regra503020 } from '../components/Regra503020';
import { formatarMoeda } from '../utils/calculos';
import { cn } from '../utils/cn';

type FerramentaAtiva = 'orcamento' | 'emergencia' | 'aposentadoria' | 'metas';

// Taxa CDI atual
const CDI_ATUAL = 12.25;

export function Planejamento() {
  const [ferramentaAtiva, setFerramentaAtiva] = useState<FerramentaAtiva>('orcamento');

  // ========== FUNDO DE EMERGÊNCIA ==========
  const [fundoEmergencia, setFundoEmergencia] = useState({
    mesesAlvo: 6,
    rendaMensal: 5000,
    gastosEssenciais: 3000,
    valorAtual: 0
  });

  const valorAlvoEmergencia = fundoEmergencia.gastosEssenciais * fundoEmergencia.mesesAlvo;
  const progressoEmergencia = valorAlvoEmergencia > 0 ? Math.min((fundoEmergencia.valorAtual / valorAlvoEmergencia) * 100, 100) : 0;
  const mesesRestantesEmergencia = fundoEmergencia.gastosEssenciais > 0
    ? Math.max(0, fundoEmergencia.mesesAlvo - Math.floor(fundoEmergencia.valorAtual / fundoEmergencia.gastosEssenciais))
    : 0;
  const aporteNecessarioEmergencia = fundoEmergencia.rendaMensal > 0
    ? Math.ceil((valorAlvoEmergencia - fundoEmergencia.valorAtual) / 12)
    : 0;

  // ========== APOSENTADORIA ==========
  const [aposentadoria, setAposentadoria] = useState({
    idadeAtual: 30,
    idadeAposentadoria: 65,
    rendaAtual: 5000,
    aporteMensal: 800,
    taxaJuros: 10,
    tipoTaxa: 'manual' as 'manual' | 'cdi',
    percentualCDI: 100,
    expectativaVida: 85
  });

  const taxaEfetiva = aposentadoria.tipoTaxa === 'cdi'
    ? (CDI_ATUAL * aposentadoria.percentualCDI / 100)
    : aposentadoria.taxaJuros;

  const anosContribuicao = aposentadoria.idadeAposentadoria - aposentadoria.idadeAtual;
  const mesesContribuicao = anosContribuicao * 12;
  const taxaMensal = taxaEfetiva / 100 / 12;

  const calcularValorFuturo = (aporteMensal: number, taxaMensal: number, meses: number) => {
    if (taxaMensal === 0) return aporteMensal * meses;
    return aporteMensal * ((Math.pow(1 + taxaMensal, meses) - 1) / taxaMensal);
  };

  const valorAposentadoria = calcularValorFuturo(aposentadoria.aporteMensal, taxaMensal, mesesContribuicao);
  const rendaMensalAposentadoria = valorAposentadoria / ((aposentadoria.expectativaVida - aposentadoria.idadeAposentadoria) * 12);
  const totalAportado = aposentadoria.aporteMensal * mesesContribuicao;
  const jurosGanhos = valorAposentadoria - totalAportado;

  // ========== METAS ==========
  const [meta, setMeta] = useState({
    nome: 'Casa própria',
    valorMeta: 300000,
    valorAtual: 50000,
    prazoAnos: 10,
    aporteMensal: 1500,
    taxaJuros: 8
  });

  const mesesMeta = meta.prazoAnos * 12;
  const taxaMensalMeta = meta.taxaJuros / 100 / 12;
  const valorProjetadoMeta = meta.valorAtual * Math.pow(1 + taxaMensalMeta, mesesMeta) +
    calcularValorFuturo(meta.aporteMensal, taxaMensalMeta, mesesMeta);
  const progressoMeta = meta.valorMeta > 0 ? Math.min((valorProjetadoMeta / meta.valorMeta) * 100, 100) : 0;
  const atingiraMeta = valorProjetadoMeta >= meta.valorMeta;
  const faltaMeta = Math.max(0, meta.valorMeta - valorProjetadoMeta);

  const ferramentas = [
    { id: 'orcamento', nome: '50/30/20', icone: Wallet },
    { id: 'emergencia', nome: 'Emergência', icone: Shield },
    { id: 'aposentadoria', nome: 'Aposentadoria', icone: PiggyBank },
    { id: 'metas', nome: 'Metas', icone: Target }
  ];

  return (
    <div className="page-container space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <Calculator className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">Planejamento</h1>
          <p className="text-xs text-gray-500">Organize suas finanças</p>
        </div>
      </div>

      {/* Abas */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 snap-x hide-scrollbar">
        {ferramentas.map((f) => {
          const Icon = f.icone;
          const isActive = ferramentaAtiva === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFerramentaAtiva(f.id as FerramentaAtiva)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 text-sm font-medium whitespace-nowrap transition-all snap-start',
                isActive
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700'
                  : 'border-gray-200 dark:border-gray-700 text-gray-500'
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{f.nome}</span>
            </button>
          );
        })}
      </div>

      {/* ========== ORÇAMENTO 50/30/20 ========== */}
      {ferramentaAtiva === 'orcamento' && <Regra503020 />}

      {/* ========== FUNDO DE EMERGÊNCIA ========== */}
      {ferramentaAtiva === 'emergencia' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Shield className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white">Fundo de Emergência</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-[10px] text-gray-500 mb-1">Meses de proteção</label>
                <select
                  value={fundoEmergencia.mesesAlvo}
                  onChange={(e) => setFundoEmergencia(p => ({ ...p, mesesAlvo: Number(e.target.value) }))}
                  className="w-full px-2 py-2 border rounded-lg text-sm bg-gray-50 dark:bg-gray-700"
                >
                  <option value={3}>3 meses</option>
                  <option value={6}>6 meses (recomendado)</option>
                  <option value={9}>9 meses</option>
                  <option value={12}>12 meses</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 mb-1">Renda mensal</label>
                <input
                  type="number"
                  value={fundoEmergencia.rendaMensal || ''}
                  onChange={(e) => setFundoEmergencia(p => ({ ...p, rendaMensal: Number(e.target.value) }))}
                  className="w-full px-2 py-2 border rounded-lg text-sm bg-gray-50 dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 mb-1">Gastos essenciais/mês</label>
                <input
                  type="number"
                  value={fundoEmergencia.gastosEssenciais || ''}
                  onChange={(e) => setFundoEmergencia(p => ({ ...p, gastosEssenciais: Number(e.target.value) }))}
                  className="w-full px-2 py-2 border rounded-lg text-sm bg-gray-50 dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 mb-1">Valor atual do fundo</label>
                <input
                  type="number"
                  value={fundoEmergencia.valorAtual || ''}
                  onChange={(e) => setFundoEmergencia(p => ({ ...p, valorAtual: Number(e.target.value) }))}
                  className="w-full px-2 py-2 border rounded-lg text-sm bg-gray-50 dark:bg-gray-700"
                />
              </div>
            </div>

            {/* Resultado Emergência */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                <p className="text-[10px] text-blue-600">Meta</p>
                <p className="text-sm font-bold text-blue-700">{formatarMoeda(valorAlvoEmergencia)}</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                <p className="text-[10px] text-green-600">Atual</p>
                <p className="text-sm font-bold text-green-700">{formatarMoeda(fundoEmergencia.valorAtual)}</p>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-center">
                <p className="text-[10px] text-amber-600">Falta</p>
                <p className="text-sm font-bold text-amber-700">{formatarMoeda(Math.max(0, valorAlvoEmergencia - fundoEmergencia.valorAtual))}</p>
              </div>
            </div>

            {/* Barra de Progresso */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progresso</span>
                <span className="font-bold">{progressoEmergencia.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-white/30 rounded-full h-3 mb-3">
                <div
                  className="bg-white h-3 rounded-full transition-all"
                  style={{ width: `${progressoEmergencia}%` }}
                />
              </div>

              {progressoEmergencia >= 100 ? (
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4" />
                  <span>🎉 Parabéns! Seu fundo está completo!</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="bg-white/20 rounded-lg p-2">
                    <p className="opacity-80">Meses restantes</p>
                    <p className="font-bold">{mesesRestantesEmergencia}</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-2">
                    <p className="opacity-80">Aporte sugerido/mês</p>
                    <p className="font-bold">{formatarMoeda(aporteNecessarioEmergencia)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Dicas */}
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-700 dark:text-amber-300">
              <p className="font-medium mb-1">💡 Dicas para seu fundo:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Mantenha em investimentos de alta liquidez (CDB liquidez diária, Tesouro Selic)</li>
                <li>Nunca use para gastos não emergenciais</li>
                <li>Reponha imediatamente após uso</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ========== APOSENTADORIA ========== */}
      {ferramentaAtiva === 'aposentadoria' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <PiggyBank className="w-4 h-4 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white">Aposentadoria</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-[10px] text-gray-500 mb-1">Idade atual</label>
                <input
                  type="number"
                  value={aposentadoria.idadeAtual || ''}
                  onChange={(e) => setAposentadoria(p => ({ ...p, idadeAtual: Number(e.target.value) }))}
                  className="w-full px-2 py-2 border rounded-lg text-sm bg-gray-50 dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 mb-1">Aposentar aos</label>
                <input
                  type="number"
                  value={aposentadoria.idadeAposentadoria || ''}
                  onChange={(e) => setAposentadoria(p => ({ ...p, idadeAposentadoria: Number(e.target.value) }))}
                  className="w-full px-2 py-2 border rounded-lg text-sm bg-gray-50 dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 mb-1">Renda atual</label>
                <input
                  type="number"
                  value={aposentadoria.rendaAtual || ''}
                  onChange={(e) => setAposentadoria(p => ({ ...p, rendaAtual: Number(e.target.value) }))}
                  className="w-full px-2 py-2 border rounded-lg text-sm bg-gray-50 dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 mb-1">Aporte mensal</label>
                <input
                  type="number"
                  value={aposentadoria.aporteMensal || ''}
                  onChange={(e) => setAposentadoria(p => ({ ...p, aporteMensal: Number(e.target.value) }))}
                  className="w-full px-2 py-2 border rounded-lg text-sm bg-gray-50 dark:bg-gray-700"
                />
              </div>
            </div>

            {/* Tipo de Taxa */}
            <div className="mb-4">
              <label className="block text-[10px] text-gray-500 mb-2">Rentabilidade</label>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <button
                  onClick={() => setAposentadoria(p => ({ ...p, tipoTaxa: 'manual' }))}
                  className={cn(
                    'p-2 rounded-lg border-2 text-xs font-medium transition-all',
                    aposentadoria.tipoTaxa === 'manual'
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 text-gray-500'
                  )}
                >
                  Taxa Manual
                </button>
                <button
                  onClick={() => setAposentadoria(p => ({ ...p, tipoTaxa: 'cdi' }))}
                  className={cn(
                    'p-2 rounded-lg border-2 text-xs font-medium transition-all',
                    aposentadoria.tipoTaxa === 'cdi'
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 text-gray-500'
                  )}
                >
                  % do CDI ({CDI_ATUAL}%)
                </button>
              </div>

              {aposentadoria.tipoTaxa === 'manual' ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={aposentadoria.taxaJuros || ''}
                    onChange={(e) => setAposentadoria(p => ({ ...p, taxaJuros: Number(e.target.value) }))}
                    className="flex-1 px-2 py-2 border rounded-lg text-sm bg-gray-50 dark:bg-gray-700"
                  />
                  <span className="text-sm text-gray-500">% a.a.</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={aposentadoria.percentualCDI || ''}
                    onChange={(e) => setAposentadoria(p => ({ ...p, percentualCDI: Number(e.target.value) }))}
                    className="flex-1 px-2 py-2 border rounded-lg text-sm bg-gray-50 dark:bg-gray-700"
                  />
                  <span className="text-sm text-gray-500">% CDI = {taxaEfetiva.toFixed(2)}% a.a.</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-[10px] text-gray-500 mb-1">Expectativa de vida</label>
              <input
                type="number"
                value={aposentadoria.expectativaVida || ''}
                onChange={(e) => setAposentadoria(p => ({ ...p, expectativaVida: Number(e.target.value) }))}
                className="w-full px-2 py-2 border rounded-lg text-sm bg-gray-50 dark:bg-gray-700"
              />
            </div>
          </div>

          {/* Resultado Aposentadoria */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
            <p className="text-sm opacity-80 mb-1">Patrimônio aos {aposentadoria.idadeAposentadoria} anos</p>
            <p className="text-3xl font-bold mb-4">{formatarMoeda(valorAposentadoria)}</p>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-white/20 rounded-lg p-2 text-center">
                <p className="text-[10px] opacity-80">Anos contribuindo</p>
                <p className="font-bold">{anosContribuicao}</p>
              </div>
              <div className="bg-white/20 rounded-lg p-2 text-center">
                <p className="text-[10px] opacity-80">Total aportado</p>
                <p className="font-bold">{formatarMoeda(totalAportado)}</p>
              </div>
              <div className="bg-white/20 rounded-lg p-2 text-center">
                <p className="text-[10px] opacity-80">Juros ganhos</p>
                <p className="font-bold">{formatarMoeda(jurosGanhos)}</p>
              </div>
              <div className="bg-white/20 rounded-lg p-2 text-center">
                <p className="text-[10px] opacity-80">Renda mensal</p>
                <p className="font-bold">{formatarMoeda(rendaMensalAposentadoria)}</p>
              </div>
            </div>

            <div className="text-xs opacity-80">
              Durante {aposentadoria.expectativaVida - aposentadoria.idadeAposentadoria} anos de aposentadoria
            </div>
          </div>
        </div>
      )}

      {/* ========== METAS ========== */}
      {ferramentaAtiva === 'metas' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Target className="w-4 h-4 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white">Metas de Longo Prazo</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="col-span-2">
                <label className="block text-[10px] text-gray-500 mb-1">Nome da meta</label>
                <input
                  type="text"
                  value={meta.nome}
                  onChange={(e) => setMeta(p => ({ ...p, nome: e.target.value }))}
                  className="w-full px-2 py-2 border rounded-lg text-sm bg-gray-50 dark:bg-gray-700"
                  placeholder="Ex: Casa própria, Carro, Viagem..."
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 mb-1">Valor da meta</label>
                <input
                  type="number"
                  value={meta.valorMeta || ''}
                  onChange={(e) => setMeta(p => ({ ...p, valorMeta: Number(e.target.value) }))}
                  className="w-full px-2 py-2 border rounded-lg text-sm bg-gray-50 dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 mb-1">Já tenho</label>
                <input
                  type="number"
                  value={meta.valorAtual || ''}
                  onChange={(e) => setMeta(p => ({ ...p, valorAtual: Number(e.target.value) }))}
                  className="w-full px-2 py-2 border rounded-lg text-sm bg-gray-50 dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 mb-1">Prazo (anos)</label>
                <input
                  type="number"
                  value={meta.prazoAnos || ''}
                  onChange={(e) => setMeta(p => ({ ...p, prazoAnos: Number(e.target.value) }))}
                  className="w-full px-2 py-2 border rounded-lg text-sm bg-gray-50 dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 mb-1">Aporte mensal</label>
                <input
                  type="number"
                  value={meta.aporteMensal || ''}
                  onChange={(e) => setMeta(p => ({ ...p, aporteMensal: Number(e.target.value) }))}
                  className="w-full px-2 py-2 border rounded-lg text-sm bg-gray-50 dark:bg-gray-700"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] text-gray-500 mb-1">Taxa de rendimento (% a.a.)</label>
                <input
                  type="number"
                  value={meta.taxaJuros || ''}
                  onChange={(e) => setMeta(p => ({ ...p, taxaJuros: Number(e.target.value) }))}
                  className="w-full px-2 py-2 border rounded-lg text-sm bg-gray-50 dark:bg-gray-700"
                />
              </div>
            </div>

            {/* Resultado Metas */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                <p className="text-[10px] text-green-600">Meta</p>
                <p className="text-sm font-bold text-green-700">{formatarMoeda(meta.valorMeta)}</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                <p className="text-[10px] text-blue-600">Projetado</p>
                <p className="text-sm font-bold text-blue-700">{formatarMoeda(valorProjetadoMeta)}</p>
              </div>
              <div className={cn(
                "p-3 rounded-lg text-center",
                atingiraMeta ? "bg-green-50" : "bg-amber-50"
              )}>
                <p className={cn("text-[10px]", atingiraMeta ? "text-green-600" : "text-amber-600")}>
                  {atingiraMeta ? "Sobra" : "Falta"}
                </p>
                <p className={cn("text-sm font-bold", atingiraMeta ? "text-green-700" : "text-amber-700")}>
                  {atingiraMeta ? formatarMoeda(valorProjetadoMeta - meta.valorMeta) : formatarMoeda(faltaMeta)}
                </p>
              </div>
            </div>
          </div>

          {/* Barra de Progresso Meta */}
          <div className={cn(
            "rounded-xl p-4 text-white",
            atingiraMeta
              ? "bg-gradient-to-r from-green-500 to-emerald-600"
              : "bg-gradient-to-r from-amber-500 to-orange-600"
          )}>
            <p className="text-sm font-medium mb-1">{meta.nome}</p>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs opacity-80">{formatarMoeda(meta.valorAtual)} → {formatarMoeda(valorProjetadoMeta)}</span>
              <span className="font-bold">{Math.min(progressoMeta, 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-3 mb-3">
              <div
                className="bg-white h-3 rounded-full transition-all"
                style={{ width: `${Math.min(progressoMeta, 100)}%` }}
              />
            </div>

            {atingiraMeta ? (
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4" />
                <span>🎉 Você atingirá sua meta em {meta.prazoAnos} anos!</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Aumente seu aporte para atingir a meta</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
