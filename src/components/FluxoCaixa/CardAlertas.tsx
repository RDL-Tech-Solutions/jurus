import { Bell, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { Alerta } from '../../utils/analiseFinanceira';
import { cn } from '../../utils/cn';

interface CardAlertasProps {
    alertas: Alerta[];
}

export function CardAlertas({ alertas }: CardAlertasProps) {
    const alertasCriticos = alertas.filter(a => a.tipo === 'critico');
    const alertasAtencao = alertas.filter(a => a.tipo === 'atencao');
    const alertasInfo = alertas.filter(a => a.tipo === 'info');

    const getIconePorTipo = (tipo: Alerta['tipo']) => {
        if (tipo === 'critico') return <AlertCircle className="w-4 h-4 text-red-600" />;
        if (tipo === 'atencao') return <AlertTriangle className="w-4 h-4 text-orange-600" />;
        return <Info className="w-4 h-4 text-blue-600" />;
    };

    const getCorPorTipo = (tipo: Alerta['tipo']) => {
        if (tipo === 'critico') return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
        if (tipo === 'atencao') return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    };

    const getCorTextoPorTipo = (tipo: Alerta['tipo']) => {
        if (tipo === 'critico') return 'text-red-700 dark:text-red-300';
        if (tipo === 'atencao') return 'text-orange-700 dark:text-orange-300';
        return 'text-blue-700 dark:text-blue-300';
    };

    if (alertas.length === 0) {
        return (
            <div className="card-mobile bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        🚨 Alertas
                    </h3>
                    <Bell className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-center py-6">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <span className="text-3xl">✅</span>
                    </div>
                    <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                        Tudo certo!
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        Nenhum alerta ativo no momento
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="card-mobile">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    🚨 Alertas
                    {alertas.length > 0 && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 font-bold">
                            {alertas.length}
                        </span>
                    )}
                </h3>
                <Bell className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-2">
                {/* Alertas Críticos */}
                {alertasCriticos.map((alerta, index) => (
                    <div
                        key={`critico-${index}`}
                        className={cn('p-3 rounded-lg border', getCorPorTipo(alerta.tipo))}
                    >
                        <div className="flex items-start gap-2">
                            <span className="text-lg flex-shrink-0">{alerta.icone}</span>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    {getIconePorTipo(alerta.tipo)}
                                    <p className={cn('text-xs font-bold', getCorTextoPorTipo(alerta.tipo))}>
                                        {alerta.titulo}
                                    </p>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {alerta.mensagem}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Alertas de Atenção */}
                {alertasAtencao.map((alerta, index) => (
                    <div
                        key={`atencao-${index}`}
                        className={cn('p-3 rounded-lg border', getCorPorTipo(alerta.tipo))}
                    >
                        <div className="flex items-start gap-2">
                            <span className="text-lg flex-shrink-0">{alerta.icone}</span>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    {getIconePorTipo(alerta.tipo)}
                                    <p className={cn('text-xs font-bold', getCorTextoPorTipo(alerta.tipo))}>
                                        {alerta.titulo}
                                    </p>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {alerta.mensagem}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Alertas Informativos */}
                {alertasInfo.map((alerta, index) => (
                    <div
                        key={`info-${index}`}
                        className={cn('p-3 rounded-lg border', getCorPorTipo(alerta.tipo))}
                    >
                        <div className="flex items-start gap-2">
                            <span className="text-lg flex-shrink-0">{alerta.icone}</span>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    {getIconePorTipo(alerta.tipo)}
                                    <p className={cn('text-xs font-bold', getCorTextoPorTipo(alerta.tipo))}>
                                        {alerta.titulo}
                                    </p>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {alerta.mensagem}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Resumo */}
            <div className="mt-3 p-2 rounded-lg bg-gray-100 dark:bg-gray-700/50">
                <div className="flex items-center justify-center gap-4 text-xs">
                    {alertasCriticos.length > 0 && (
                        <span className="text-red-600 dark:text-red-400 font-semibold">
                            🔴 {alertasCriticos.length} Crítico{alertasCriticos.length > 1 ? 's' : ''}
                        </span>
                    )}
                    {alertasAtencao.length > 0 && (
                        <span className="text-orange-600 dark:text-orange-400 font-semibold">
                            ⚠️ {alertasAtencao.length} Atenção
                        </span>
                    )}
                    {alertasInfo.length > 0 && (
                        <span className="text-blue-600 dark:text-blue-400 font-semibold">
                            💡 {alertasInfo.length} Info
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
