import { useState, useEffect } from 'react';
import { X, RefreshCw, AlertCircle, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { TransacaoRecorrente, NovaTransacaoRecorrente, CATEGORIAS_PADRAO, RecorrenciaTransacao, TipoTransacao } from '../../types/fluxoCaixa';
import { cn } from '../../utils/cn';
import { calcularProximaData, formatarData } from '../../utils/calculos';
import { useModal } from '../../hooks/useModal';

interface ModalRecorrenteProps {
    aberto: boolean;
    onFechar: () => void;
    onSalvar: (rec: NovaTransacaoRecorrente) => void;
    onExcluir?: (id: string) => void;
    onToggleAtiva?: (id: string) => void;
    recorrenteInicial?: TransacaoRecorrente;
}

const FREQUENCIAS: { valor: RecorrenciaTransacao; label: string; icone: string }[] = [
    { valor: 'diaria', label: 'Diária', icone: '📅' },
    { valor: 'semanal', label: 'Semanal', icone: '📆' },
    { valor: 'mensal', label: 'Mensal', icone: '🗓️' },
    { valor: 'anual', label: 'Anual', icone: '📅' }
];

const DIAS_SEMANA = [
    { valor: 0, label: 'Dom' },
    { valor: 1, label: 'Seg' },
    { valor: 2, label: 'Ter' },
    { valor: 3, label: 'Qua' },
    { valor: 4, label: 'Qui' },
    { valor: 5, label: 'Sex' },
    { valor: 6, label: 'Sáb' }
];

export function ModalRecorrente({ aberto, onFechar, onSalvar, onExcluir, onToggleAtiva, recorrenteInicial }: ModalRecorrenteProps) {
    const [tipo, setTipo] = useState<TipoTransacao>('saida');
    const [descricao, setDescricao] = useState('');
    const [valor, setValor] = useState('');
    const [categoriaId, setCategoriaId] = useState('');
    const [frequencia, setFrequencia] = useState<RecorrenciaTransacao>('mensal');
    const [diaDoMes, setDiaDoMes] = useState(1);
    const [diaDaSemana, setDiaDaSemana] = useState(1);
    const [dataInicio, setDataInicio] = useState(new Date().toISOString().split('T')[0]);
    const [dataFim, setDataFim] = useState('');
    const [observacoes, setObservacoes] = useState('');
    const [ativa, setAtiva] = useState(true);
    const [erro, setErro] = useState('');

    // Oculta navbar quando modal abre
    useModal(aberto);

    const categoriasFiltradas = CATEGORIAS_PADRAO.filter(c => c.tipo === tipo);

    useEffect(() => {
        if (recorrenteInicial) {
            setTipo(recorrenteInicial.tipo);
            setDescricao(recorrenteInicial.descricao);
            setValor(recorrenteInicial.valor.toString());
            setCategoriaId(recorrenteInicial.categoriaId);
            setFrequencia(recorrenteInicial.frequencia);
            setDiaDoMes(recorrenteInicial.diaDoMes || 1);
            setDiaDaSemana(recorrenteInicial.diaDaSemana || 1);
            setDataInicio(recorrenteInicial.dataInicio);
            setDataFim(recorrenteInicial.dataFim || '');
            setObservacoes(recorrenteInicial.observacoes || '');
            setAtiva(recorrenteInicial.ativa);
        } else {
            setTipo('saida');
            setDescricao('');
            setValor('');
            setCategoriaId('');
            setFrequencia('mensal');
            setDiaDoMes(new Date().getDate());
            setDiaDaSemana(new Date().getDay());
            setDataInicio(new Date().toISOString().split('T')[0]);
            setDataFim('');
            setObservacoes('');
            setAtiva(true);
        }
        setErro('');
    }, [aberto, recorrenteInicial]);

    // Atualizar categoria ao mudar tipo
    useEffect(() => {
        const categoriasDoTipo = CATEGORIAS_PADRAO.filter(c => c.tipo === tipo);
        if (!categoriasDoTipo.find(c => c.id === categoriaId)) {
            setCategoriaId(categoriasDoTipo[0]?.id || '');
        }
    }, [tipo]);

    const handleSalvar = () => {
        if (!descricao.trim()) {
            setErro('Digite uma descrição');
            return;
        }

        const valorNum = parseFloat(valor.replace(',', '.'));
        if (isNaN(valorNum) || valorNum <= 0) {
            setErro('Digite um valor válido');
            return;
        }

        if (!categoriaId) {
            setErro('Selecione uma categoria');
            return;
        }

        onSalvar({
            descricao: descricao.trim(),
            valor: valorNum,
            tipo,
            categoriaId,
            frequencia,
            diaDoMes: frequencia === 'mensal' ? diaDoMes : undefined,
            diaDaSemana: frequencia === 'semanal' ? diaDaSemana : undefined,
            dataInicio,
            dataFim: dataFim || undefined,
            observacoes: observacoes.trim() || undefined,
            ativa
        });
        onFechar();
    };

    if (!aberto) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <div className="fixed inset-0 bg-black/50" onClick={onFechar} />

            <div className="relative w-full sm:max-w-md bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between z-10">
                    <div className="flex items-center gap-2">
                        <RefreshCw className="w-5 h-5 text-green-600" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {recorrenteInicial ? 'Editar Recorrente' : 'Nova Recorrente'}
                        </h2>
                    </div>
                    <button onClick={onFechar} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                    {/* Erro */}
                    {erro && (
                        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex gap-2">
                            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-600 dark:text-red-400">{erro}</p>
                        </div>
                    )}

                    {/* Status Ativo/Inativo */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                            <div className={cn(
                                "w-2 h-2 rounded-full",
                                ativa ? "bg-green-500" : "bg-gray-400"
                            )} />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {ativa ? 'Recorrência Ativa' : 'Recorrência Pausada'}
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                if (recorrenteInicial && onToggleAtiva) {
                                    onToggleAtiva(recorrenteInicial.id);
                                }
                                setAtiva(!ativa);
                            }}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                                ativa
                                    ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                                    : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                            )}
                        >
                            {ativa ? 'Pausar' : 'Ativar'}
                        </button>
                    </div>

                    {/* Tipo */}
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setTipo('saida')}
                            className={cn(
                                'flex-1 p-3 rounded-xl border-2 flex items-center justify-center gap-2 transition-all',
                                tipo === 'saida'
                                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                    : 'border-gray-200 dark:border-gray-700'
                            )}
                        >
                            <TrendingDown className={cn('w-5 h-5', tipo === 'saida' ? 'text-red-600' : 'text-gray-400')} />
                            <span className={cn('font-medium', tipo === 'saida' ? 'text-red-600' : 'text-gray-500')}>Saída</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setTipo('entrada')}
                            className={cn(
                                'flex-1 p-3 rounded-xl border-2 flex items-center justify-center gap-2 transition-all',
                                tipo === 'entrada'
                                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                    : 'border-gray-200 dark:border-gray-700'
                            )}
                        >
                            <TrendingUp className={cn('w-5 h-5', tipo === 'entrada' ? 'text-green-600' : 'text-gray-400')} />
                            <span className={cn('font-medium', tipo === 'entrada' ? 'text-green-600' : 'text-gray-500')}>Entrada</span>
                        </button>
                    </div>

                    {/* Descrição */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Descrição
                        </label>
                        <input
                            type="text"
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            placeholder="Ex: Aluguel, Salário, Netflix..."
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                    </div>

                    {/* Valor */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Valor
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                            <input
                                type="text"
                                inputMode="decimal"
                                value={valor}
                                onChange={(e) => setValor(e.target.value)}
                                placeholder="0,00"
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-lg"
                            />
                        </div>
                    </div>

                    {/* Categoria */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Categoria
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {categoriasFiltradas.slice(0, 8).map(cat => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setCategoriaId(cat.id)}
                                    className={cn(
                                        'p-2 rounded-xl border-2 transition-all flex flex-col items-center gap-1',
                                        categoriaId === cat.id
                                            ? tipo === 'entrada'
                                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                                : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                    )}
                                >
                                    <span className="text-xl">{cat.icone}</span>
                                    <span className="text-[9px] text-gray-600 dark:text-gray-400 truncate w-full text-center">
                                        {cat.nome}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Frequência */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Frequência
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {FREQUENCIAS.map(f => (
                                <button
                                    key={f.valor}
                                    type="button"
                                    onClick={() => setFrequencia(f.valor)}
                                    className={cn(
                                        'p-2 rounded-xl border-2 transition-all flex flex-col items-center gap-1',
                                        frequencia === f.valor
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                            : 'border-gray-200 dark:border-gray-700'
                                    )}
                                >
                                    <span className="text-lg">{f.icone}</span>
                                    <span className="text-[10px] text-gray-600 dark:text-gray-400">{f.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Dia do Mês (para mensal) */}
                    {frequencia === 'mensal' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Dia do Mês
                            </label>
                            <select
                                value={diaDoMes}
                                onChange={(e) => setDiaDoMes(parseInt(e.target.value))}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            >
                                {Array.from({ length: 31 }, (_, i) => i + 1).map(dia => (
                                    <option key={dia} value={dia}>Dia {dia}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Dia da Semana (para semanal) */}
                    {frequencia === 'semanal' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Dia da Semana
                            </label>
                            <div className="flex gap-1">
                                {DIAS_SEMANA.map(d => (
                                    <button
                                        key={d.valor}
                                        type="button"
                                        onClick={() => setDiaDaSemana(d.valor)}
                                        className={cn(
                                            'flex-1 py-2 rounded-lg text-xs font-medium transition-colors',
                                            diaDaSemana === d.valor
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                        )}
                                    >
                                        {d.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Data Início */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Data de Início
                        </label>
                        <input
                            type="date"
                            value={dataInicio}
                            onChange={(e) => setDataInicio(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                    </div>

                    {/* Data Fim (opcional) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Data Final (opcional)
                        </label>
                        <input
                            type="date"
                            value={dataFim}
                            onChange={(e) => setDataFim(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                    </div>

                    {/* Previsão */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary-600" />
                            Previsão de Lançamentos
                        </h4>
                        <div className="space-y-2">
                            {(() => {
                                const prevs = [];
                                let data = dataInicio;
                                const limite = new Date();
                                limite.setFullYear(limite.getFullYear() + 1); // Max 1 ano

                                for (let i = 0; i < 5; i++) {
                                    prevs.push(data);
                                    data = calcularProximaData(
                                        data,
                                        frequencia,
                                        frequencia === 'mensal' ? diaDoMes : undefined,
                                        frequencia === 'semanal' ? diaDaSemana : undefined
                                    );
                                    if (dataFim && new Date(data) > new Date(dataFim)) break;
                                }

                                return prevs.map((data, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">
                                            {idx + 1}ª Ocorrência
                                        </span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {formatarData(data)}
                                        </span>
                                    </div>
                                ));
                            })()}
                        </div>
                        <p className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                            * As transações serão geradas automaticamente nestas datas.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white dark:bg-gray-900 p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
                    {recorrenteInicial && onExcluir && (
                        <button
                            onClick={() => {
                                if (confirm('Excluir esta recorrente?')) {
                                    onExcluir(recorrenteInicial.id);
                                    onFechar();
                                }
                            }}
                            className="px-4 py-3 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-medium"
                        >
                            Excluir
                        </button>
                    )}
                    <button
                        onClick={onFechar}
                        className="flex-1 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSalvar}
                        className="flex-1 px-4 py-3 rounded-xl bg-green-600 text-white font-medium"
                    >
                        Salvar
                    </button>
                </div>
            </div>
        </div>
    );
}
