import { useState } from 'react';
import { Calculator, ChevronDown, ChevronUp } from 'lucide-react';
import { useSimulacao } from '../store/useAppStore';
import { calcularJurosCompostos } from '../utils/calculos';
import { bancosDigitais } from '../data/bancosDigitais';
import { useAppStore } from '../store/useAppStore';
import { cn } from '../utils/cn';

export function FormularioEntrada() {
  const { simulacao, setSimulacao, setResultado } = useSimulacao();
  const adicionarHistorico = useAppStore(state => state.adicionarHistorico);
  const [erros, setErros] = useState<Record<string, string>>({});
  const [expandido, setExpandido] = useState(false);

  const handleChange = (campo: string, valor: any) => {
    setSimulacao({ ...simulacao, [campo]: valor });
    if (erros[campo]) {
      setErros({ ...erros, [campo]: '' });
    }
  };

  const validar = () => {
    const novosErros: Record<string, string> = {};

    if (simulacao.valorInicial <= 0) {
      novosErros.valorInicial = 'Valor inicial deve ser maior que zero';
    }

    if (simulacao.valorMensal < 0) {
      novosErros.valorMensal = 'Valor mensal não pode ser negativo';
    }

    if (simulacao.periodo <= 0) {
      novosErros.periodo = 'Período deve ser maior que zero';
    }

    if (simulacao.taxaType === 'personalizada' && simulacao.taxaPersonalizada <= 0) {
      novosErros.taxaPersonalizada = 'Taxa deve ser maior que zero';
    }

    if (simulacao.taxaType === 'cdi' && simulacao.percentualCdi <= 0) {
      novosErros.percentualCdi = 'Percentual deve ser maior que zero';
    }

    if (simulacao.taxaType === 'banco_digital') {
      if (!simulacao.bancoDigitalId) {
        novosErros.bancoDigitalId = 'Selecione um banco';
      }
      if (!simulacao.modalidadeBancoId) {
        novosErros.modalidadeBancoId = 'Selecione uma modalidade';
      }
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validar()) {
      return;
    }

    try {
      const resultado = calcularJurosCompostos(simulacao);
      setResultado(resultado);
      adicionarHistorico(simulacao, resultado);
    } catch (error) {
      console.error('Erro ao calcular:', error);
      alert('Erro ao calcular. Verifique os valores informados.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-mobile space-y-4">
      {/* Header compacto */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Simulador
            </h2>
            <p className="text-xs text-gray-500">Calcule seu investimento</p>
          </div>
        </div>
      </div>

      {/* Campos principais - Sempre visíveis */}
      <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Valor Inicial (R$)
          </label>
          <input
            type="number"
            value={simulacao.valorInicial || ''}
            onChange={(e) => handleChange('valorInicial', e.target.value === '' ? 0 : Number(e.target.value))}
            className="input-mobile text-base font-medium"
            placeholder="10.000"
            min="0"
          />
          {erros.valorInicial && (
            <p className="text-xs text-red-500 mt-0.5">{erros.valorInicial}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Aporte Mensal (R$)
          </label>
          <input
            type="number"
            value={simulacao.valorMensal || ''}
            onChange={(e) => handleChange('valorMensal', e.target.value === '' ? 0 : Number(e.target.value))}
            className="input-mobile text-base font-medium"
            placeholder="500"
            min="0"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Período (meses)
          </label>
          <input
            type="number"
            value={simulacao.periodo || ''}
            onChange={(e) => handleChange('periodo', e.target.value === '' ? 0 : Number(e.target.value))}
            className="input-mobile text-base font-medium"
            placeholder="12"
            min="1"
          />
          {erros.periodo && (
            <p className="text-xs text-red-500 mt-0.5">{erros.periodo}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Tipo
          </label>
          <select
            value={simulacao.taxaType}
            onChange={(e) => handleChange('taxaType', e.target.value)}
            className="input-mobile text-sm"
          >
            <option value="banco_digital">Banco Digital</option>
            <option value="cdi">CDI %</option>
            <option value="personalizada">Taxa %</option>
          </select>
        </div>
      </div>

      {/* Campos avançados - Expansíveis no mobile */}
      <button
        type="button"
        onClick={() => setExpandido(!expandido)}
        className="w-full flex items-center justify-center space-x-1 text-sm text-gray-500 dark:text-gray-400 py-1 md:hidden"
      >
        <span>{expandido ? 'Menos opções' : 'Mais opções'}</span>
        {expandido ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      <div className={cn(
        'space-y-3',
        !expandido && 'hidden md:block'
      )}>
        {/* Taxa Personalizada */}
        {simulacao.taxaType === 'personalizada' && (
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              Taxa Anual (%)
            </label>
            <input
              type="number"
              value={simulacao.taxaPersonalizada || ''}
              onChange={(e) => handleChange('taxaPersonalizada', e.target.value === '' ? 0 : Number(e.target.value))}
              className="input-mobile"
              placeholder="10"
              step="0.1"
            />
            {erros.taxaPersonalizada && (
              <p className="text-xs text-red-500 mt-0.5">{erros.taxaPersonalizada}</p>
            )}
          </div>
        )}

        {/* Percentual CDI */}
        {simulacao.taxaType === 'cdi' && (
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
              % do CDI
            </label>
            <input
              type="number"
              value={simulacao.percentualCdi || ''}
              onChange={(e) => handleChange('percentualCdi', e.target.value === '' ? 0 : Number(e.target.value))}
              className="input-mobile"
              placeholder="100"
            />
            <p className="text-[10px] text-gray-400 mt-0.5">
              💰 CDI: 13,71% a.a. | 100% = 13,71% | 110% = 15,08%
            </p>
            {erros.percentualCdi && (
              <p className="text-xs text-red-500 mt-0.5">{erros.percentualCdi}</p>
            )}
          </div>
        )}

        {/* Banco Digital */}
        {simulacao.taxaType === 'banco_digital' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Banco
              </label>
              <select
                value={simulacao.bancoDigitalId}
                onChange={(e) => handleChange('bancoDigitalId', e.target.value)}
                className="input-mobile text-sm"
              >
                <option value="">Selecione</option>
                {bancosDigitais.map((banco) => (
                  <option key={banco.id} value={banco.id}>{banco.nome}</option>
                ))}
              </select>
              {erros.bancoDigitalId && (
                <p className="text-xs text-red-500 mt-0.5">{erros.bancoDigitalId}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Modalidade
              </label>
              <select
                value={simulacao.modalidadeBancoId}
                onChange={(e) => handleChange('modalidadeBancoId', e.target.value)}
                className="input-mobile text-sm"
                disabled={!simulacao.bancoDigitalId}
              >
                <option value="">Selecione</option>
                {simulacao.bancoDigitalId &&
                  bancosDigitais.find(b => b.id === simulacao.bancoDigitalId)?.modalidades.map((m) => (
                    <option key={m.id} value={m.id}>{m.nome}</option>
                  ))}
              </select>
              {erros.modalidadeBancoId && (
                <p className="text-xs text-red-500 mt-0.5">{erros.modalidadeBancoId}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Botão Calcular - Grande e destacado */}
      <button
        type="submit"
        className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center space-x-2"
      >
        <Calculator className="w-5 h-5" />
        <span>Calcular</span>
      </button>
    </form>
  );
}
