import React, { useState, useMemo } from 'react';
import {
    Target,
    TrendingUp,
    TrendingDown,
    BarChart3,
    PieChart,
    AlertTriangle,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Pencil,
    X,
    Check,
    Download,
    Upload,
    RefreshCw,
    Home,
    Heart,
    Wallet
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart as RechartsPie,
    Pie,
    Cell
} from 'recharts';
import { useFluxoCaixa } from '../hooks/useFluxoCaixa';
import {
    MetaGasto,
    CATEGORIAS_PADRAO,
    CLASSIFICACAO_CATEGORIAS_PADRAO,
    Classificacao5030,
    Transacao
} from '../types/fluxoCaixa';
import { formatarMoeda } from '../utils/calculos';
import { cn } from '../utils/cn';

const STORAGE_KEY_METAS = 'jurus_metas_gastos';

// Cores para 50/30/20
const CORES_5030 = {
    necessidades: '#ef4444', // vermelho
    desejos: '#8b5cf6',      // roxo
    poupanca: '#10b981'      // verde
};

const LABELS_5030 = {
    necessidades: 'Necessidades',
    desejos: 'Desejos',
    poupanca: 'Poupança'
};

// Carregar/Salvar Metas
const carregarMetas = (): MetaGasto[] => {
    try {
        const dados = localStorage.getItem(STORAGE_KEY_METAS);
        if (dados) return JSON.parse(dados);
    } catch (e) { }
    return [];
};

const salvarMetas = (metas: MetaGasto[]) => {
    localStorage.setItem(STORAGE_KEY_METAS, JSON.stringify(metas));
};

interface AnalisesFluxoProps {
    transacoes: Transacao[];
    estatisticas: any;
}

export function AnalisesFluxo({ transacoes, estatisticas }: AnalisesFluxoProps) {
    const [abaAnalise, setAbaAnalise] = useState<'metas' | '5030' | 'comparativo' | 'backup'>('metas');
    const [metas, setMetas] = useState<MetaGasto[]>(carregarMetas());
    const [editandoMeta, setEditandoMeta] = useState<{ categoriaId: string; valor: number } | null>(null);

    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();

    // Calcular gastos por categoria no mês atual
    const gastosPorCategoria = useMemo(() => {
        const inicioMes = new Date(anoAtual, mesAtual, 1);
        const fimMes = new Date(anoAtual, mesAtual + 1, 0);

        const gastosMap: Record<string, number> = {};

        transacoes
            .filter(t => {
                const data = new Date(t.data);
                return t.tipo === 'saida' && data >= inicioMes && data <= fimMes;
            })
            .forEach(t => {
                gastosMap[t.categoriaId] = (gastosMap[t.categoriaId] || 0) + t.valor;
            });

        return gastosMap;
    }, [transacoes, mesAtual, anoAtual]);

    // Calcular dados para 50/30/20
    const dados5030 = useMemo(() => {
        const totalSaidas = Object.values(gastosPorCategoria).reduce((a, b) => a + b, 0);

        const totais: Record<Classificacao5030, number> = {
            necessidades: 0,
            desejos: 0,
            poupanca: 0
        };

        Object.entries(gastosPorCategoria).forEach(([catId, valor]) => {
            const config = CLASSIFICACAO_CATEGORIAS_PADRAO.find(c => c.categoriaId === catId);
            if (config) {
                totais[config.classificacao] += valor;
            } else {
                // Categorias não classificadas vão para desejos
                totais.desejos += valor;
            }
        });

        return {
            totalSaidas,
            ...totais,
            percentuais: {
                necessidades: totalSaidas > 0 ? (totais.necessidades / totalSaidas) * 100 : 0,
                desejos: totalSaidas > 0 ? (totais.desejos / totalSaidas) * 100 : 0,
                poupanca: totalSaidas > 0 ? (totais.poupanca / totalSaidas) * 100 : 0
            }
        };
    }, [gastosPorCategoria]);

    // Calcular comparativo mensal
    const comparativo = useMemo(() => {
        const mesAnterior = mesAtual === 0 ? 11 : mesAtual - 1;
        const anoAnterior = mesAtual === 0 ? anoAtual - 1 : anoAtual;

        const inicioMesAtual = new Date(anoAtual, mesAtual, 1);
        const fimMesAtual = new Date(anoAtual, mesAtual + 1, 0);
        const inicioMesAnterior = new Date(anoAnterior, mesAnterior, 1);
        const fimMesAnterior = new Date(anoAnterior, mesAnterior + 1, 0);

        let entradasAtual = 0, saidasAtual = 0;
        let entradasAnterior = 0, saidasAnterior = 0;

        transacoes.forEach(t => {
            const data = new Date(t.data);
            if (data >= inicioMesAtual && data <= fimMesAtual) {
                if (t.tipo === 'entrada') entradasAtual += t.valor;
                else saidasAtual += t.valor;
            }
            if (data >= inicioMesAnterior && data <= fimMesAnterior) {
                if (t.tipo === 'entrada') entradasAnterior += t.valor;
                else saidasAnterior += t.valor;
            }
        });

        const calcVariacao = (atual: number, anterior: number) => {
            if (anterior === 0) return atual > 0 ? 100 : 0;
            return ((atual - anterior) / anterior) * 100;
        };

        return {
            mesAtual: { entradas: entradasAtual, saidas: saidasAtual, saldo: entradasAtual - saidasAtual },
            mesAnterior: { entradas: entradasAnterior, saidas: saidasAnterior, saldo: entradasAnterior - saidasAnterior },
            variacaoEntradas: calcVariacao(entradasAtual, entradasAnterior),
            variacaoSaidas: calcVariacao(saidasAtual, saidasAnterior),
            variacaoSaldo: calcVariacao(entradasAtual - saidasAtual, entradasAnterior - saidasAnterior)
        };
    }, [transacoes, mesAtual, anoAtual]);

    // Obter meta de uma categoria
    const obterMeta = (categoriaId: string): number => {
        const meta = metas.find(m => m.categoriaId === categoriaId && m.mes === mesAtual && m.ano === anoAtual);
        return meta?.limite || 0;
    };

    // Salvar meta
    const salvarMetaCategoria = (categoriaId: string, limite: number) => {
        const novasMetas = metas.filter(m => !(m.categoriaId === categoriaId && m.mes === mesAtual && m.ano === anoAtual));
        if (limite > 0) {
            novasMetas.push({
                id: `${categoriaId}-${mesAtual}-${anoAtual}`,
                categoriaId,
                limite,
                mes: mesAtual,
                ano: anoAtual
            });
        }
        setMetas(novasMetas);
        salvarMetas(novasMetas);
        setEditandoMeta(null);
    };

    // Exportar backup
    const exportarBackup = () => {
        const dados = {
            transacoes: localStorage.getItem('jurus_fluxo_caixa'),
            dividas: localStorage.getItem('jurus_dividas'),
            cartoes: localStorage.getItem('jurus_cartoes'),
            gastos_cartao: localStorage.getItem('jurus_gastos_cartao'),
            metas: localStorage.getItem('jurus_metas_gastos'),
            data_export: new Date().toISOString()
        };
        const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `jurus_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Importar backup
    const importarBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const dados = JSON.parse(event.target?.result as string);
                if (dados.transacoes) localStorage.setItem('jurus_fluxo_caixa', dados.transacoes);
                if (dados.dividas) localStorage.setItem('jurus_dividas', dados.dividas);
                if (dados.cartoes) localStorage.setItem('jurus_cartoes', dados.cartoes);
                if (dados.gastos_cartao) localStorage.setItem('jurus_gastos_cartao', dados.gastos_cartao);
                if (dados.metas) localStorage.setItem('jurus_metas_gastos', dados.metas);
                alert('Backup importado com sucesso! Recarregando...');
                window.location.reload();
            } catch (err) {
                alert('Erro ao importar backup. Arquivo inválido.');
            }
        };
        reader.readAsText(file);
    };

    // Exportar relatório CSV
    const exportarCSV = () => {
        const linhas = [
            'Data,Descrição,Tipo,Categoria,Valor,Observações',
            ...transacoes.map(t => {
                const cat = CATEGORIAS_PADRAO.find(c => c.id === t.categoriaId);
                return `"${t.data}","${t.descricao}","${t.tipo}","${cat?.nome || ''}",${t.valor},"${t.observacoes || ''}"`;
            })
        ];

        const csv = linhas.join('\n');
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `jurus_transacoes_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const nomesMeses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const categoriasSaida = CATEGORIAS_PADRAO.filter(c => c.tipo === 'saida');

    return (
        <div className="space-y-4">
            {/* Header com Abas */}
            <div className="flex items-center space-x-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-x-auto">
                {[
                    { id: 'metas', label: 'Metas', icon: Target },
                    { id: '5030', label: '50/30/20', icon: PieChart },
                    { id: 'comparativo', label: 'Comparativo', icon: BarChart3 },
                    { id: 'backup', label: 'Backup', icon: Download }
                ].map(aba => (
                    <button
                        key={aba.id}
                        onClick={() => setAbaAnalise(aba.id as any)}
                        className={cn(
                            'flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
                            abaAnalise === aba.id
                                ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                                : 'text-gray-600 dark:text-gray-400'
                        )}
                    >
                        <aba.icon className="w-4 h-4" />
                        <span>{aba.label}</span>
                    </button>
                ))}
            </div>

            {/* Conteúdo das Abas */}

            {/* METAS DE GASTOS */}
            {abaAnalise === 'metas' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900 dark:text-white">Metas de Gastos por Categoria</h4>
                        <span className="text-sm text-gray-500">{nomesMeses[mesAtual]} {anoAtual}</span>
                    </div>

                    <div className="space-y-3">
                        {categoriasSaida.map(cat => {
                            const gasto = gastosPorCategoria[cat.id] || 0;
                            const meta = obterMeta(cat.id);
                            const percentual = meta > 0 ? (gasto / meta) * 100 : 0;
                            const isEditando = editandoMeta?.categoriaId === cat.id;

                            return (
                                <div key={cat.id} className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center space-x-2">
                                            <span>{cat.icone}</span>
                                            <span className="font-medium text-gray-900 dark:text-white">{cat.nome}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {isEditando ? (
                                                <>
                                                    <input
                                                        type="number"
                                                        value={editandoMeta.valor}
                                                        onChange={(e) => setEditandoMeta({ ...editandoMeta, valor: Number(e.target.value) })}
                                                        className="w-24 px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                                                        placeholder="Limite"
                                                    />
                                                    <button
                                                        onClick={() => salvarMetaCategoria(cat.id, editandoMeta.valor)}
                                                        className="p-1 text-green-600 hover:bg-green-100 rounded"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setEditandoMeta(null)}
                                                        className="p-1 text-gray-500 hover:bg-gray-200 rounded"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <span className={cn(
                                                        "text-sm font-medium",
                                                        percentual > 100 ? "text-red-600" : percentual > 80 ? "text-orange-600" : "text-gray-600 dark:text-gray-400"
                                                    )}>
                                                        {formatarMoeda(gasto)} / {meta > 0 ? formatarMoeda(meta) : 'Sem meta'}
                                                    </span>
                                                    <button
                                                        onClick={() => setEditandoMeta({ categoriaId: cat.id, valor: meta })}
                                                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded"
                                                    >
                                                        <Pencil className="w-3 h-3" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    {meta > 0 && (
                                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className={cn(
                                                    "h-full rounded-full transition-all",
                                                    percentual > 100 ? "bg-red-500" : percentual > 80 ? "bg-orange-500" : "bg-green-500"
                                                )}
                                                style={{ width: `${Math.min(percentual, 100)}%` }}
                                            />
                                        </div>
                                    )}
                                    {percentual > 80 && meta > 0 && (
                                        <p className={cn(
                                            "text-xs mt-1 flex items-center",
                                            percentual > 100 ? "text-red-600" : "text-orange-600"
                                        )}>
                                            <AlertTriangle className="w-3 h-3 mr-1" />
                                            {percentual > 100 ? 'Meta ultrapassada!' : `${percentual.toFixed(0)}% do limite usado`}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* REGRA 50/30/20 */}
            {abaAnalise === '5030' && (
                <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Distribuição 50/30/20</h4>

                    {/* Cards de Resumo */}
                    <div className="grid grid-cols-3 gap-3">
                        {(['necessidades', 'desejos', 'poupanca'] as Classificacao5030[]).map(tipo => {
                            const ideal = tipo === 'necessidades' ? 50 : tipo === 'desejos' ? 30 : 20;
                            const atual = dados5030.percentuais[tipo];
                            const diferenca = atual - ideal;

                            return (
                                <div
                                    key={tipo}
                                    className="p-3 rounded-lg text-center"
                                    style={{ backgroundColor: `${CORES_5030[tipo]}15` }}
                                >
                                    <div className="w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center" style={{ backgroundColor: CORES_5030[tipo] }}>
                                        {tipo === 'necessidades' ? <Home className="w-4 h-4 text-white" /> :
                                            tipo === 'desejos' ? <Heart className="w-4 h-4 text-white" /> :
                                                <Wallet className="w-4 h-4 text-white" />}
                                    </div>
                                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">{LABELS_5030[tipo]}</p>
                                    <p className="text-lg font-bold" style={{ color: CORES_5030[tipo] }}>{atual.toFixed(0)}%</p>
                                    <p className="text-xs text-gray-500">Meta: {ideal}%</p>
                                    {Math.abs(diferenca) > 5 && (
                                        <p className={cn("text-xs mt-1", diferenca > 0 ? "text-red-500" : "text-green-500")}>
                                            {diferenca > 0 ? `+${diferenca.toFixed(0)}%` : `${diferenca.toFixed(0)}%`}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Gráfico de Pizza */}
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsPie>
                                <Pie
                                    data={[
                                        { name: 'Necessidades', value: dados5030.necessidades, fill: CORES_5030.necessidades },
                                        { name: 'Desejos', value: dados5030.desejos, fill: CORES_5030.desejos },
                                        { name: 'Poupança', value: dados5030.poupanca, fill: CORES_5030.poupanca }
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={70}
                                    dataKey="value"
                                    label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    labelLine={false}
                                >
                                    {[CORES_5030.necessidades, CORES_5030.desejos, CORES_5030.poupanca].map((color, i) => (
                                        <Cell key={i} fill={color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => formatarMoeda(value)} />
                            </RechartsPie>
                        </ResponsiveContainer>
                    </div>

                    {/* Recomendações */}
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">💡 Recomendações</p>
                        <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                            {dados5030.percentuais.necessidades > 55 && (
                                <li>• Seus gastos essenciais estão altos. Tente renegociar contas fixas.</li>
                            )}
                            {dados5030.percentuais.desejos > 35 && (
                                <li>• Reduza gastos com lazer e compras para equilibrar o orçamento.</li>
                            )}
                            {dados5030.percentuais.poupanca < 15 && (
                                <li>• Aumente seus investimentos para garantir segurança financeira.</li>
                            )}
                            {dados5030.percentuais.necessidades <= 50 && dados5030.percentuais.desejos <= 30 && dados5030.percentuais.poupanca >= 20 && (
                                <li>✅ Parabéns! Sua distribuição está dentro da regra 50/30/20!</li>
                            )}
                        </ul>
                    </div>
                </div>
            )}

            {/* COMPARATIVO MENSAL */}
            {abaAnalise === 'comparativo' && (
                <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                        Comparativo: {nomesMeses[mesAtual]} vs {nomesMeses[mesAtual === 0 ? 11 : mesAtual - 1]}
                    </h4>

                    {/* Cards de Variação */}
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { label: 'Entradas', atual: comparativo.mesAtual.entradas, anterior: comparativo.mesAnterior.entradas, variacao: comparativo.variacaoEntradas },
                            { label: 'Saídas', atual: comparativo.mesAtual.saidas, anterior: comparativo.mesAnterior.saidas, variacao: comparativo.variacaoSaidas },
                            { label: 'Saldo', atual: comparativo.mesAtual.saldo, anterior: comparativo.mesAnterior.saldo, variacao: comparativo.variacaoSaldo }
                        ].map(item => (
                            <div key={item.label} className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-center">
                                <p className="text-xs text-gray-500">{item.label}</p>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">{formatarMoeda(item.atual)}</p>
                                <div className={cn(
                                    "flex items-center justify-center text-xs mt-1",
                                    item.variacao > 0 ? "text-green-600" : item.variacao < 0 ? "text-red-600" : "text-gray-500"
                                )}>
                                    {item.variacao > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : item.variacao < 0 ? <TrendingDown className="w-3 h-3 mr-1" /> : null}
                                    {item.variacao > 0 ? '+' : ''}{item.variacao.toFixed(1)}%
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Gráfico de Barras */}
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={[
                                    { name: nomesMeses[mesAtual === 0 ? 11 : mesAtual - 1], Entradas: comparativo.mesAnterior.entradas, Saídas: comparativo.mesAnterior.saidas },
                                    { name: nomesMeses[mesAtual], Entradas: comparativo.mesAtual.entradas, Saídas: comparativo.mesAtual.saidas }
                                ]}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                                <Tooltip formatter={(value: number) => formatarMoeda(value)} />
                                <Legend />
                                <Bar dataKey="Entradas" fill="#10b981" />
                                <Bar dataKey="Saídas" fill="#ef4444" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* BACKUP */}
            {abaAnalise === 'backup' && (
                <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Backup e Exportação</h4>

                    <div className="grid grid-cols-1 gap-4">
                        <button
                            onClick={exportarBackup}
                            className="flex items-center justify-center space-x-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-dashed border-green-300 dark:border-green-700 hover:bg-green-100 transition-colors"
                        >
                            <Download className="w-5 h-5 text-green-600" />
                            <span className="font-medium text-green-700 dark:text-green-400">Exportar Backup (JSON)</span>
                        </button>

                        <button
                            onClick={exportarCSV}
                            className="flex items-center justify-center space-x-2 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-2 border-dashed border-purple-300 dark:border-purple-700 hover:bg-purple-100 transition-colors"
                        >
                            <Download className="w-5 h-5 text-purple-600" />
                            <span className="font-medium text-purple-700 dark:text-purple-400">Exportar Transações (CSV/Excel)</span>
                        </button>

                        <label className="flex items-center justify-center space-x-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-dashed border-blue-300 dark:border-blue-700 hover:bg-blue-100 transition-colors cursor-pointer">
                            <Upload className="w-5 h-5 text-blue-600" />
                            <span className="font-medium text-blue-700 dark:text-blue-400">Importar Backup</span>
                            <input type="file" accept=".json" onChange={importarBackup} className="hidden" />
                        </label>

                        <button
                            onClick={() => {
                                if (confirm('Tem certeza? Isso vai apagar TODOS os dados do Fluxo de Caixa!')) {
                                    ['jurus_fluxo_caixa', 'jurus_dividas', 'jurus_cartoes', 'jurus_gastos_cartao', 'jurus_metas_gastos', 'jurus_faturas_pagas'].forEach(key => localStorage.removeItem(key));
                                    alert('Dados resetados! Recarregando...');
                                    window.location.reload();
                                }
                            }}
                            className="flex items-center justify-center space-x-2 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-2 border-dashed border-red-300 dark:border-red-700 hover:bg-red-100 transition-colors"
                        >
                            <RefreshCw className="w-5 h-5 text-red-600" />
                            <span className="font-medium text-red-700 dark:text-red-400">Resetar Todos os Dados</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
