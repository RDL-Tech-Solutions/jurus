import { RefreshCw, Plus, Pause, Play, Pencil, Trash2, Calendar } from 'lucide-react';
import { TransacaoRecorrente, CATEGORIAS_PADRAO } from '../../types/fluxoCaixa';
import { formatarMoeda } from '../../utils/calculos';
import { cn } from '../../utils/cn';

interface ListaRecorrentesProps {
    recorrentes: TransacaoRecorrente[];
    onNovaRecorrente: () => void;
    onEditarRecorrente: (rec: TransacaoRecorrente) => void;
    onToggleAtiva: (id: string) => void;
    onExcluirRecorrente: (id: string) => void;
}

const FREQUENCIA_LABELS: Record<string, string> = {
    diaria: 'Todo dia',
    semanal: 'Toda semana',
    mensal: 'Todo mês',
    anual: 'Todo ano'
};

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export function ListaRecorrentes({
    recorrentes,
    onNovaRecorrente,
    onEditarRecorrente,
    onToggleAtiva,
    onExcluirRecorrente
}: ListaRecorrentesProps) {
    const ativas = recorrentes.filter(r => r.ativa);
    const pausadas = recorrentes.filter(r => !r.ativa);

    const formatarFrequencia = (rec: TransacaoRecorrente) => {
        let texto = FREQUENCIA_LABELS[rec.frequencia] || rec.frequencia;

        if (rec.frequencia === 'mensal' && rec.diaDoMes) {
            texto = `Dia ${rec.diaDoMes}`;
        } else if (rec.frequencia === 'semanal' && rec.diaDaSemana !== undefined) {
            texto = `Toda ${DIAS_SEMANA[rec.diaDaSemana]}`;
        }

        return texto;
    };

    const formatarProximaData = (data: string) => {
        const d = new Date(data);
        return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    };

    return (
        <div className="card-mobile">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    🔄 Recorrentes
                    {ativas.length > 0 && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600">
                            {ativas.length} ativas
                        </span>
                    )}
                </h3>
                <button
                    onClick={onNovaRecorrente}
                    className="p-1.5 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>

            {recorrentes.length === 0 ? (
                <div className="text-center py-6">
                    <RefreshCw className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        Nenhuma transação recorrente
                    </p>
                    <button
                        onClick={onNovaRecorrente}
                        className="text-sm text-green-600 dark:text-green-400 font-medium hover:underline"
                    >
                        + Criar primeira recorrente
                    </button>
                </div>
            ) : (
                <div className="space-y-2">
                    {/* Ativas */}
                    {ativas.map(rec => {
                        const categoria = CATEGORIAS_PADRAO.find(c => c.id === rec.categoriaId);
                        return (
                            <div
                                key={rec.id}
                                className={cn(
                                    'p-3 rounded-lg border',
                                    rec.tipo === 'entrada'
                                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                                        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                                )}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">{categoria?.icone || '📌'}</span>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {rec.descricao}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {formatarFrequencia(rec)}
                                            </p>
                                        </div>
                                    </div>
                                    <p className={cn(
                                        'text-sm font-bold',
                                        rec.tipo === 'entrada'
                                            ? 'text-green-600 dark:text-green-400'
                                            : 'text-red-600 dark:text-red-400'
                                    )}>
                                        {rec.tipo === 'entrada' ? '+' : '-'}{formatarMoeda(rec.valor)}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <Calendar className="w-3 h-3" />
                                        <span>Próxima: {formatarProximaData(rec.proximaData)}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => onToggleAtiva(rec.id)}
                                            className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                                            title="Pausar"
                                        >
                                            <Pause className="w-3.5 h-3.5 text-orange-500" />
                                        </button>
                                        <button
                                            onClick={() => onEditarRecorrente(rec)}
                                            className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                                            title="Editar"
                                        >
                                            <Pencil className="w-3.5 h-3.5 text-blue-500" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (confirm('Excluir esta recorrente?')) {
                                                    onExcluirRecorrente(rec.id);
                                                }
                                            }}
                                            className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                                            title="Excluir"
                                        >
                                            <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Pausadas */}
                    {pausadas.length > 0 && (
                        <>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-4 mb-2">
                                ⏸️ Pausadas
                            </p>
                            {pausadas.map(rec => {
                                const categoria = CATEGORIAS_PADRAO.find(c => c.id === rec.categoriaId);
                                return (
                                    <div
                                        key={rec.id}
                                        className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 opacity-60"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg grayscale">{categoria?.icone || '📌'}</span>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                                        {rec.descricao}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {formatarMoeda(rec.valor)} • {formatarFrequencia(rec)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => onToggleAtiva(rec.id)}
                                                    className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                                                    title="Ativar"
                                                >
                                                    <Play className="w-3.5 h-3.5 text-green-500" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (confirm('Excluir?')) onExcluirRecorrente(rec.id);
                                                    }}
                                                    className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
