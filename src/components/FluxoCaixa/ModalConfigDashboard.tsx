import { X, Settings, Eye, EyeOff, RotateCcw } from 'lucide-react';
import { DashboardConfig } from '../../types/fluxoCaixa';
import { cn } from '../../utils/cn';
import { useModal } from '../../hooks/useModal';

interface ModalConfigDashboardProps {
    aberto: boolean;
    onFechar: () => void;
    config: DashboardConfig;
    onToggleInsight: (key: keyof DashboardConfig['insights']) => void;
    onToggleAnalytic: (key: keyof DashboardConfig['analytics']) => void;
    onToggleGrafico: (key: keyof DashboardConfig['graficos']) => void;
    onRestaurarPadrao: () => void;
    onMostrarTodos: () => void;
    onOcultarTodos: () => void;
}

const INSIGHTS_CONFIG = [
    { key: 'tendencia' as const, label: 'Tendência', icone: '📈', desc: 'Comparação com período anterior' },
    { key: 'mediaDiaria' as const, label: 'Média Diária', icone: '💰', desc: 'Média de gastos e receitas por dia' },
    { key: 'comparativo' as const, label: 'Comparativo', icone: '📊', desc: 'Tabela comparativa de períodos' }
];

const ANALYTICS_CONFIG = [
    { key: 'runway' as const, label: 'Runway', icone: '✈️', desc: 'Quantos meses o saldo aguenta' },
    { key: 'breakEven' as const, label: 'Break-Even', icone: '⚖️', desc: 'Ponto de equilíbrio financeiro' },
    { key: 'maiorGasto' as const, label: 'Maior Gasto', icone: '🔥', desc: 'Transação mais alta do período' },
    { key: 'alertas' as const, label: 'Alertas', icone: '🚨', desc: 'Sistema de avisos inteligentes' },
    { key: 'topCategorias' as const, label: 'Top Categorias', icone: '🏆', desc: 'Ranking de gastos por categoria' }
];

const GRAFICOS_CONFIG = [
    { key: 'barrasComparativo' as const, label: 'Barras Comparativo', icone: '📊', desc: 'Entradas vs Saídas mensal' },
    { key: 'pizza' as const, label: 'Pizza', icone: '🥧', desc: 'Distribuição por categoria' },
    { key: 'evolucao' as const, label: 'Evolução', icone: '📈', desc: 'Linha de evolução do saldo' }
];

export function ModalConfigDashboard({
    aberto,
    onFechar,
    config,
    onToggleInsight,
    onToggleAnalytic,
    onToggleGrafico,
    onRestaurarPadrao,
    onMostrarTodos,
    onOcultarTodos
}: ModalConfigDashboardProps) {
    const contarAtivos = () => {
        const insights = Object.values(config.insights).filter(Boolean).length;
        const analytics = Object.values(config.analytics).filter(Boolean).length;
        const graficos = Object.values(config.graficos).filter(Boolean).length;
        return { insights, analytics, graficos, total: insights + analytics + graficos };
    };

    const ativos = contarAtivos();

    // Oculta navbar quando modal abre
    useModal(aberto);

    if (!aberto) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <div className="fixed inset-0 bg-black/50" onClick={onFechar} />

            <div className="relative w-full sm:max-w-lg bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[85vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between z-10">
                    <div className="flex items-center gap-2">
                        <Settings className="w-5 h-5 text-blue-600" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Personalizar Dashboard
                        </h2>
                    </div>
                    <button onClick={onFechar} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Quick Actions */}
                <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex gap-2">
                        <button
                            onClick={onMostrarTodos}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium"
                        >
                            <Eye className="w-4 h-4" />
                            Mostrar Todos
                        </button>
                        <button
                            onClick={onOcultarTodos}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 text-sm font-medium"
                        >
                            <EyeOff className="w-4 h-4" />
                            Ocultar Todos
                        </button>
                        <button
                            onClick={onRestaurarPadrao}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-medium"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Padrão
                        </button>
                    </div>
                    <p className="text-center text-xs text-gray-500 mt-2">
                        {ativos.total} de 11 itens visíveis
                    </p>
                </div>

                {/* Content */}
                <div className="p-4 space-y-6">
                    {/* Insights */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            💡 Insights
                            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600">
                                {ativos.insights}/{INSIGHTS_CONFIG.length}
                            </span>
                        </h3>
                        <div className="space-y-2">
                            {INSIGHTS_CONFIG.map(item => (
                                <label
                                    key={item.key}
                                    className={cn(
                                        'flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all',
                                        config.insights[item.key]
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">{item.icone}</span>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                                            <p className="text-xs text-gray-500">{item.desc}</p>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={config.insights[item.key]}
                                        onChange={() => onToggleInsight(item.key)}
                                        className="w-5 h-5 rounded text-blue-600"
                                    />
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Analytics */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            🔬 Analytics
                            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600">
                                {ativos.analytics}/{ANALYTICS_CONFIG.length}
                            </span>
                        </h3>
                        <div className="space-y-2">
                            {ANALYTICS_CONFIG.map(item => (
                                <label
                                    key={item.key}
                                    className={cn(
                                        'flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all',
                                        config.analytics[item.key]
                                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">{item.icone}</span>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                                            <p className="text-xs text-gray-500">{item.desc}</p>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={config.analytics[item.key]}
                                        onChange={() => onToggleAnalytic(item.key)}
                                        className="w-5 h-5 rounded text-purple-600"
                                    />
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Gráficos */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            📊 Gráficos
                            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600">
                                {ativos.graficos}/{GRAFICOS_CONFIG.length}
                            </span>
                        </h3>
                        <div className="space-y-2">
                            {GRAFICOS_CONFIG.map(item => (
                                <label
                                    key={item.key}
                                    className={cn(
                                        'flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all',
                                        config.graficos[item.key]
                                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">{item.icone}</span>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                                            <p className="text-xs text-gray-500">{item.desc}</p>
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={config.graficos[item.key]}
                                        onChange={() => onToggleGrafico(item.key)}
                                        className="w-5 h-5 rounded text-green-600"
                                    />
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white dark:bg-gray-900 p-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={onFechar}
                        className="w-full px-4 py-3 rounded-xl bg-blue-600 text-white font-medium"
                    >
                        Concluído
                    </button>
                </div>
            </div>
        </div>
    );
}
