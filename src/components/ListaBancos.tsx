import { useState } from 'react';
import { Building2, TrendingUp, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { bancosDigitais, getTipoLabel } from '../data/bancosDigitais';
import { formatarMoeda } from '../utils/calculos';

export function ListaBancos() {
  const [bancoExpandido, setBancoExpandido] = useState<string | null>(null);

  const toggleBanco = (bancoId: string) => {
    setBancoExpandido(bancoExpandido === bancoId ? null : bancoId);
  };

  const totalBancos = bancosDigitais.length;
  const totalModalidades = bancosDigitais.reduce((acc, banco) => acc + banco.modalidades.length, 0);

  return (
    <div className="card-mobile !p-3">
      {/* Header compacto */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-600" />
          <span className="font-medium text-sm text-gray-900 dark:text-white">Bancos Digitais</span>
        </div>
        <span className="text-xs text-gray-500">
          {totalBancos} bancos
        </span>
      </div>

      {/* Lista compacta */}
      <div className="space-y-2">
        {bancosDigitais.map((banco) => {
          const isExpanded = bancoExpandido === banco.id;

          return (
            <div
              key={banco.id}
              className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggleBanco(banco.id)}
                className="w-full p-2.5 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-sm text-gray-900 dark:text-white">{banco.nome}</p>
                  <p className="text-[10px] text-gray-500">{banco.modalidades.length} opções</p>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {/* Modalidades expandidas */}
              {isExpanded && (
                <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  {banco.modalidades.map((modalidade) => (
                    <div
                      key={modalidade.id}
                      className="p-2.5 border-b border-gray-100 dark:border-gray-700 last:border-0"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="font-medium text-sm text-gray-900 dark:text-white">
                          {modalidade.nome}
                        </p>
                        <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                          {getTipoLabel(modalidade.tipo)}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-center p-1.5 bg-white dark:bg-gray-700 rounded-lg">
                          <p className="text-[10px] text-gray-400">Taxa</p>
                          <p className="text-xs font-bold text-green-600">{modalidade.taxaAnual}%</p>
                        </div>
                        <div className="text-center p-1.5 bg-white dark:bg-gray-700 rounded-lg">
                          <p className="text-[10px] text-gray-400">Liquidez</p>
                          <p className="text-xs font-medium capitalize">{modalidade.liquidez}</p>
                        </div>
                        <div className="text-center p-1.5 bg-white dark:bg-gray-700 rounded-lg">
                          <p className="text-[10px] text-gray-400">Mínimo</p>
                          <p className="text-xs font-medium">{formatarMoeda(modalidade.valorMinimo)}</p>
                        </div>
                      </div>

                      {modalidade.descricao && (
                        <div className="mt-2 flex items-start gap-1 p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <Info className="w-3 h-3 text-blue-500 flex-shrink-0 mt-0.5" />
                          <p className="text-[10px] text-blue-700 dark:text-blue-300">
                            {modalidade.descricao}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
