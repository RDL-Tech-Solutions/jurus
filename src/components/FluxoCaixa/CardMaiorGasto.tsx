import { Flame, Calendar } from 'lucide-react';
import { MaiorGasto } from '../../utils/analiseFinanceira';
import { formatarMoeda } from '../../utils/calculos';
import { CATEGORIAS_PADRAO } from '../../types/fluxoCaixa';

interface CardMaiorGastoProps {
    maiorGasto: MaiorGasto | null;
}

export function CardMaiorGasto({ maiorGasto }: CardMaiorGastoProps) {
    if (!maiorGasto) {
        return (
            <div className="card-mobile">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        🔥 Maior Gasto
                    </h3>
                </div>
                <div className="text-center py-8">
                    <p className="text-sm text-gray-500">Nenhum gasto registrado</p>
                </div>
            </div>
        );
    }

    const categoria = CATEGORIAS_PADRAO.find(c => c.id === maiorGasto.transacao.categoriaId);
    const data = new Date(maiorGasto.transacao.data);

    return (
        <div className="card-mobile border-2 border-orange-200 dark:border-orange-800">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    🔥 Maior Gasto
                </h3>
                <Flame className="w-5 h-5 text-orange-500" />
            </div>

            <div className="space-y-3">
                {/* Categoria */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
                    <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                        style={{ backgroundColor: categoria?.cor + '20' }}
                    >
                        {categoria?.icone || '💸'}
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-gray-600 dark:text-gray-400">Categoria</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {categoria?.nome || 'Outros'}
                        </p>
                    </div>
                </div>

                {/* Descrição */}
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Descrição</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {maiorGasto.transacao.descricao}
                    </p>
                </div>

                {/* Valor */}
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800">
                    <p className="text-xs text-center text-red-600 dark:text-red-400 mb-1">Valor</p>
                    <p className="text-2xl font-bold text-center text-red-700 dark:text-red-300">
                        {formatarMoeda(maiorGasto.transacao.valor)}
                    </p>
                    <p className="text-[10px] text-center text-red-500 mt-1">
                        {maiorGasto.percentualDoTotal.toFixed(1)}% do total de saídas
                    </p>
                </div>

                {/* Data */}
                <div className="flex items-center justify-center gap-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                        {data.toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                        })}
                    </span>
                </div>
            </div>

            {/* Alerta */}
            {maiorGasto.percentualDoTotal > 30 && (
                <div className="mt-3 p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800">
                    <p className="text-xs text-center text-orange-700 dark:text-orange-300 font-semibold">
                        ⚠️ Representa mais de 30% dos gastos totais
                    </p>
                </div>
            )}
        </div>
    );
}
