import { Clock, CheckCircle, XCircle, Calendar, ArrowRight, AlertCircle } from 'lucide-react';
import { TransacaoPendente, CATEGORIAS_PADRAO } from '../../types/fluxoCaixa';
import { formatarMoeda } from '../../utils/calculos';
import { cn } from '../../utils/cn';

interface ListaTransacoesPendentesProps {
    pendentes: TransacaoPendente[];
    pendentesPorData: {
        vencidas: TransacaoPendente[];
        hoje: TransacaoPendente[];
        futuras: TransacaoPendente[];
        proximos7Dias: TransacaoPendente[];
    };
    onEfetivar: (id: string) => void;
    onAntecipar: (id: string, novaData: string) => void;
    onCancelar: (id: string) => void;
    onEditar: (pendente: TransacaoPendente) => void;
}

export function ListaTransacoesPendentes({
    pendentes,
    pendentesPorData,
    onEfetivar,
    onAntecipar,
    onCancelar,
    onEditar
}: ListaTransacoesPendentesProps) {
    const formatarData = (data: string) => {
        const d = new Date(data);
        return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const renderPendente = (pendente: TransacaoPendente, status: 'vencida' | 'hoje' | 'futura') => {
        const categoria = CATEGORIAS_PADRAO.find(c => c.id === pendente.categoriaId);
        const isVencida = status === 'vencida';
        const isHoje = status === 'hoje';

        return (
            <div
                key={pendente.id}
                className={cn(
                    'p-3 rounded-lg border transition-all',
                    isVencida && 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700',
                    isHoje && 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700',
                    !isVencida && !isHoje && pendente.tipo === 'entrada' && 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800',
                    !isVencida && !isHoje && pendente.tipo === 'saida' && 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                )}
            >
                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-1">
                        <span className="text-lg">{categoria?.icone || '📌'}</span>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <p className="font-medium text-gray-900 dark:text-white text-sm">
                                    {pendente.descricao}
                                </p>
                                {isVencida && (
                                    <span className="px-1.5 py-0.5 text-xs bg-red-500 text-white rounded">
                                        Atrasada
                                    </span>
                                )}
                                {isHoje && (
                                    <span className="px-1.5 py-0.5 text-xs bg-yellow-500 text-white rounded">
                                        Hoje
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-600 dark:text-gray-400">
                                <Calendar className="w-3 h-3" />
                                <span>{formatarData(pendente.dataAgendada)}</span>
                                {pendente.recorrenteId && (
                                    <span className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded">
                                        Recorrente
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className={cn(
                            'font-bold text-sm',
                            pendente.tipo === 'entrada' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        )}>
                            {pendente.tipo === 'entrada' ? '+' : '-'} {formatarMoeda(pendente.valor)}
                        </p>
                    </div>
                </div>

                {/* Ações */}
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => onEfetivar(pendente.id)}
                        className="flex items-center gap-1 px-2 py-1 text-xs rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
                        title="Efetivar agora"
                    >
                        <CheckCircle className="w-3 h-3" />
                        <span>Efetivar</span>
                    </button>
                    
                    {!isHoje && !isVencida && (
                        <button
                            onClick={() => {
                                const hoje = new Date().toISOString().split('T')[0];
                                onAntecipar(pendente.id, hoje);
                            }}
                            className="flex items-center gap-1 px-2 py-1 text-xs rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                            title="Antecipar para hoje"
                        >
                            <ArrowRight className="w-3 h-3" />
                            <span>Antecipar</span>
                        </button>
                    )}
                    
                    <button
                        onClick={() => onCancelar(pendente.id)}
                        className="flex items-center gap-1 px-2 py-1 text-xs rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        title="Cancelar"
                    >
                        <XCircle className="w-3 h-3" />
                        <span>Cancelar</span>
                    </button>
                </div>
            </div>
        );
    };

    if (pendentes.length === 0) {
        return (
            <div className="card-mobile">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5" />
                    Transações Pendentes
                </h3>
                <div className="text-center py-6">
                    <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Nenhuma transação pendente
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="card-mobile">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Transações Pendentes
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600">
                        {pendentes.length}
                    </span>
                </h3>
            </div>

            <div className="space-y-4">
                {/* Vencidas */}
                {pendentesPorData.vencidas.length > 0 && (
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="w-4 h-4 text-red-500" />
                            <h4 className="text-sm font-medium text-red-600 dark:text-red-400">
                                Atrasadas ({pendentesPorData.vencidas.length})
                            </h4>
                        </div>
                        <div className="space-y-2">
                            {pendentesPorData.vencidas.map(p => renderPendente(p, 'vencida'))}
                        </div>
                    </div>
                )}

                {/* Hoje */}
                {pendentesPorData.hoje.length > 0 && (
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-4 h-4 text-yellow-500" />
                            <h4 className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                                Hoje ({pendentesPorData.hoje.length})
                            </h4>
                        </div>
                        <div className="space-y-2">
                            {pendentesPorData.hoje.map(p => renderPendente(p, 'hoje'))}
                        </div>
                    </div>
                )}

                {/* Próximos 7 dias */}
                {pendentesPorData.proximos7Dias.length > 0 && (
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4 text-blue-500" />
                            <h4 className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                Próximos 7 dias ({pendentesPorData.proximos7Dias.length})
                            </h4>
                        </div>
                        <div className="space-y-2">
                            {pendentesPorData.proximos7Dias.map(p => renderPendente(p, 'futura'))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
