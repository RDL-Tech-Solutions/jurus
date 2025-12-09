import React, { useState } from 'react';
import {
    Plus,
    X,
    Check,
    Pencil,
    Trash2,
    AlertCircle,
    Clock,
    CheckCircle2,
    Calendar,
    User,
    DollarSign,
    AlertTriangle
} from 'lucide-react';
import { useDividas } from '../hooks/useDividas';
import { useFluxoCaixa } from '../hooks/useFluxoCaixa';
import { useModal } from '../hooks/useModal';
import { NovaDivida } from '../types/fluxoCaixa';
import { formatarMoeda } from '../utils/calculos';
import { cn } from '../utils/cn';

// Modal de Adicionar/Editar Dívida
interface ModalDividaProps {
    aberto: boolean;
    onFechar: () => void;
    onSalvar: (dados: NovaDivida) => void;
    dividaInicial?: Partial<NovaDivida>;
    titulo: string;
}

function ModalDivida({ aberto, onFechar, onSalvar, dividaInicial, titulo }: ModalDividaProps) {
    const { categorias } = useFluxoCaixa();
    
    const [dados, setDados] = useState<Partial<NovaDivida>>({
        descricao: '',
        valor: 0,
        credor: '',
        categoriaId: '',
        dataVencimento: '',
        observacoes: '',
        ...dividaInicial
    });

    const [erros, setErros] = useState<Record<string, string>>({});

    React.useEffect(() => {
        if (dividaInicial) {
            setDados({
                descricao: '',
                valor: 0,
                credor: '',
                categoriaId: '',
                dataVencimento: '',
                observacoes: '',
                ...dividaInicial
            });
        }
    }, [dividaInicial]);
    
    // Categorias de saída
    const categoriasSaida = categorias.filter(c => c.tipo === 'saida');

    const validar = (): boolean => {
        const novosErros: Record<string, string> = {};

        if (!dados.descricao?.trim()) {
            novosErros.descricao = 'Descrição é obrigatória';
        }
        if (!dados.valor || dados.valor <= 0) {
            novosErros.valor = 'Valor deve ser maior que zero';
        }
        if (!dados.credor?.trim()) {
            novosErros.credor = 'Informe quem você deve';
        }

        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const handleSalvar = () => {
        if (validar()) {
            onSalvar(dados as NovaDivida);
            onFechar();
            setDados({
                descricao: '',
                valor: 0,
                credor: '',
                categoriaId: '',
                dataVencimento: '',
                observacoes: ''
            });
        }
    };

    // Hook para ocultar navbar
    useModal(aberto);

    if (!aberto) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={(e) => {
                if (e.target === e.currentTarget) onFechar();
            }}
        >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] sm:max-h-[90vh] overflow-y-auto animate-in zoom-in-95 fade-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{titulo}</h3>
                    <button
                        onClick={onFechar}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Conteúdo */}
                <div className="p-4 space-y-4">
                    {/* Descrição */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            O que você comprou/deve? *
                        </label>
                        <input
                            type="text"
                            value={dados.descricao || ''}
                            onChange={(e) => setDados(prev => ({ ...prev, descricao: e.target.value }))}
                            className={cn('input-mobile', erros.descricao && 'border-red-500')}
                            placeholder="Ex: Perfume, Almoço, Empréstimo..."
                        />
                        {erros.descricao && <p className="text-red-500 text-xs mt-1">{erros.descricao}</p>}
                    </div>

                    {/* Credor */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Para quem você deve? *
                        </label>
                        <input
                            type="text"
                            value={dados.credor || ''}
                            onChange={(e) => setDados(prev => ({ ...prev, credor: e.target.value }))}
                            className={cn('input-mobile', erros.credor && 'border-red-500')}
                            placeholder="Ex: João, Loja X, Maria..."
                        />
                        {erros.credor && <p className="text-red-500 text-xs mt-1">{erros.credor}</p>}
                    </div>

                    {/* Categoria */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Categoria
                        </label>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {categoriasSaida.map(cat => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setDados(prev => ({ ...prev, categoriaId: cat.id }))}
                                    className={cn(
                                        'flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all text-center',
                                        dados.categoriaId === cat.id
                                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                    )}
                                >
                                    <span className="text-xl mb-1">{cat.icone}</span>
                                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 line-clamp-1">
                                        {cat.nome}
                                    </span>
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Opcional - ajuda a organizar suas dívidas</p>
                    </div>

                    {/* Valor, Vencimento e Parcelas */}
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Valor (R$) *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={dados.valor || ''}
                                onChange={(e) => setDados(prev => ({ ...prev, valor: parseFloat(e.target.value) || 0 }))}
                                className={cn('input-mobile', erros.valor && 'border-red-500')}
                                placeholder="0,00"
                            />
                            {erros.valor && <p className="text-red-500 text-xs mt-1">{erros.valor}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Vencimento
                            </label>
                            <input
                                type="date"
                                value={dados.dataVencimento || ''}
                                onChange={(e) => setDados(prev => ({ ...prev, dataVencimento: e.target.value }))}
                                className="input-mobile"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Parcelas
                            </label>
                            <select
                                value={dados.numeroParcelas || 1}
                                onChange={(e) => setDados(prev => ({ ...prev, numeroParcelas: parseInt(e.target.value) }))}
                                className="input-mobile"
                                disabled={!!dividaInicial}
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 18, 24, 36, 48].map(n => (
                                    <option key={n} value={n}>{n}x</option>
                                ))}
                            </select>
                            {(dados.numeroParcelas || 1) > 1 && (
                                <p className="text-[10px] text-gray-500 mt-1">
                                    {(dados.numeroParcelas || 1)}x de {formatarMoeda((dados.valor || 0) / (dados.numeroParcelas || 1))}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Observações */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Observações
                        </label>
                        <textarea
                            value={dados.observacoes || ''}
                            onChange={(e) => setDados(prev => ({ ...prev, observacoes: e.target.value }))}
                            className="input-mobile"
                            rows={2}
                            placeholder="Notas adicionais (opcional)"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={onFechar}
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSalvar}
                        className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors flex items-center space-x-2"
                    >
                        <Check className="w-4 h-4" />
                        <span>Salvar</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

// Modal de Confirmação
interface ModalConfirmacaoProps {
    aberto: boolean;
    onFechar: () => void;
    onConfirmar: () => void;
    titulo: string;
    mensagem: string;
    tipo?: 'danger' | 'success';
}

function ModalConfirmacao({ aberto, onFechar, onConfirmar, titulo, mensagem, tipo = 'danger' }: ModalConfirmacaoProps) {
    // Hook para ocultar navbar
    useModal(aberto);

    if (!aberto) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={(e) => {
                if (e.target === e.currentTarget) onFechar();
            }}
        >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm animate-in zoom-in-95 fade-in duration-200">
                <div className="p-6 text-center">
                    <div className={cn(
                        "w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center",
                        tipo === 'danger' ? "bg-red-100 dark:bg-red-900/30" : "bg-green-100 dark:bg-green-900/30"
                    )}>
                        {tipo === 'danger' ? (
                            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                        ) : (
                            <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                        )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{titulo}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{mensagem}</p>
                    <div className="flex items-center justify-center space-x-3">
                        <button
                            onClick={onFechar}
                            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={() => {
                                onConfirmar();
                                onFechar();
                            }}
                            className={cn(
                                "px-4 py-2 rounded-lg text-white transition-colors",
                                tipo === 'danger' ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                            )}
                        >
                            {tipo === 'danger' ? 'Excluir' : 'Confirmar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Componente Principal
interface ListaDividasProps {
    onPagarDivida?: (valor: number, descricao: string) => void;
}

export function ListaDividas({ onPagarDivida }: ListaDividasProps) {
    const {
        dividas,
        dividasPendentes,
        dividasPagas,
        estatisticas,
        carregado,
        adicionarDivida,
        editarDivida,
        excluirDivida,
        marcarComoPago
    } = useDividas();
    
    const { categorias, obterCategoria } = useFluxoCaixa();

    const [modalAberto, setModalAberto] = useState(false);
    const [modalEdicao, setModalEdicao] = useState<{ aberto: boolean; id: string; dados?: Partial<NovaDivida> }>({
        aberto: false,
        id: ''
    });
    const [modalExclusao, setModalExclusao] = useState<{ aberto: boolean; id: string; descricao: string }>({
        aberto: false,
        id: '',
        descricao: ''
    });
    const [modalPagamento, setModalPagamento] = useState<{ aberto: boolean; id: string; descricao: string; valor: number }>({
        aberto: false,
        id: '',
        descricao: '',
        valor: 0
    });
    const [mostrarPagas, setMostrarPagas] = useState(false);

    const handleAdicionarDivida = (dados: NovaDivida) => {
        adicionarDivida(dados);
    };

    const handleEditarDivida = (dados: NovaDivida) => {
        if (modalEdicao.id) {
            editarDivida(modalEdicao.id, dados);
            setModalEdicao({ aberto: false, id: '' });
        }
    };

    const handleExcluirDivida = () => {
        if (modalExclusao.id) {
            excluirDivida(modalExclusao.id);
        }
    };

    const handlePagarDivida = () => {
        if (modalPagamento.id) {
            const valor = marcarComoPago(modalPagamento.id);
            if (onPagarDivida && valor > 0) {
                onPagarDivida(valor, `Pagamento: ${modalPagamento.descricao}`);
            }
        }
    };

    const formatarData = (data: string) => {
        return new Date(data).toLocaleDateString('pt-BR');
    };

    const isVencida = (dataVencimento?: string) => {
        if (!dataVencimento) return false;
        return new Date(dataVencimento) < new Date();
    };

    const isVenceEmBreve = (dataVencimento?: string) => {
        if (!dataVencimento) return false;
        const venc = new Date(dataVencimento);
        const hoje = new Date();
        const em7Dias = new Date(hoje);
        em7Dias.setDate(em7Dias.getDate() + 7);
        return venc >= hoje && venc <= em7Dias;
    };

    if (!carregado) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Lista de Dívidas</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Controle suas dívidas pessoais
                    </p>
                </div>
                <button
                    onClick={() => setModalAberto(true)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors text-sm"
                >
                    <Plus className="w-4 h-4" />
                    <span>Nova Dívida</span>
                </button>
            </div>

            {/* Resumo */}
            {estatisticas.totalPendente > 0 && (
                <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-red-700 dark:text-red-300">Total a Pagar</p>
                            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                                {formatarMoeda(estatisticas.totalPendente)}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-red-700 dark:text-red-300">
                                {estatisticas.quantidadePendente} dívida{estatisticas.quantidadePendente > 1 ? 's' : ''}
                            </p>
                            {estatisticas.vencidas.length > 0 && (
                                <p className="text-xs text-red-500 dark:text-red-400 flex items-center justify-end mt-1">
                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                    {estatisticas.vencidas.length} vencida{estatisticas.vencidas.length > 1 ? 's' : ''}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Lista de Pendentes */}
            <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span>A Pagar ({dividasPendentes.length})</span>
                </div>

                {dividasPendentes.length === 0 ? (
                    <div className="p-6 text-center bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <CheckCircle2 className="w-10 h-10 mx-auto text-green-500 mb-2" />
                        <p className="text-gray-600 dark:text-gray-400">Nenhuma dívida pendente!</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {dividasPendentes.map(divida => (
                            <div
                                key={divida.id}
                                className={cn(
                                    "p-3 rounded-lg border transition-colors",
                                    isVencida(divida.dataVencimento)
                                        ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                                        : isVenceEmBreve(divida.dataVencimento)
                                            ? "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800"
                                            : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                                )}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2">
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {divida.descricao}
                                            </span>
                                            {isVencida(divida.dataVencimento) && (
                                                <span className="px-1.5 py-0.5 text-xs bg-red-500 text-white rounded">
                                                    Vencida
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center space-x-3 mt-1 text-sm text-gray-600 dark:text-gray-400">
                                            <span className="flex items-center">
                                                <User className="w-3 h-3 mr-1" />
                                                {divida.credor}
                                            </span>
                                            {divida.categoriaId && (() => {
                                                const cat = obterCategoria(divida.categoriaId);
                                                return cat ? (
                                                    <span className="flex items-center">
                                                        <span className="mr-1">{cat.icone}</span>
                                                        {cat.nome}
                                                    </span>
                                                ) : null;
                                            })()}
                                            {divida.dataVencimento && (
                                                <span className="flex items-center">
                                                    <Calendar className="w-3 h-3 mr-1" />
                                                    {formatarData(divida.dataVencimento)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="font-bold text-red-600 dark:text-red-400">
                                            {formatarMoeda(divida.valor)}
                                        </span>
                                        <button
                                            onClick={() => setModalPagamento({
                                                aberto: true,
                                                id: divida.id,
                                                descricao: divida.descricao,
                                                valor: divida.valor
                                            })}
                                            className="px-2 py-1 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors text-xs font-medium"
                                        >
                                            PAGAR
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end space-x-1 mt-2">
                                    <button
                                        onClick={() => setModalEdicao({
                                            aberto: true,
                                            id: divida.id,
                                            dados: {
                                                descricao: divida.descricao,
                                                valor: divida.valor,
                                                credor: divida.credor,
                                                categoriaId: divida.categoriaId,
                                                dataVencimento: divida.dataVencimento?.split('T')[0],
                                                observacoes: divida.observacoes
                                            }
                                        })}
                                        className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <Pencil className="w-4 h-4 text-gray-500" />
                                    </button>
                                    <button
                                        onClick={() => setModalExclusao({
                                            aberto: true,
                                            id: divida.id,
                                            descricao: divida.descricao
                                        })}
                                        className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Lista de Pagas (colapsável) */}
            {dividasPagas.length > 0 && (
                <div className="space-y-2">
                    <button
                        onClick={() => setMostrarPagas(!mostrarPagas)}
                        className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                    >
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span>Pagas ({dividasPagas.length})</span>
                        <span className="text-xs">{mostrarPagas ? '▲' : '▼'}</span>
                    </button>

                    {mostrarPagas && (
                        <div className="space-y-2 opacity-75">
                            {dividasPagas.slice(0, 5).map(divida => (
                                <div
                                    key={divida.id}
                                    className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="font-medium text-gray-700 dark:text-gray-300 line-through">
                                                {divida.descricao}
                                            </span>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {divida.credor} • Pago em {divida.dataPagamento && formatarData(divida.dataPagamento)}
                                            </p>
                                        </div>
                                        <span className="font-medium text-green-600 dark:text-green-400">
                                            ✓ {formatarMoeda(divida.valor)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {dividasPagas.length > 5 && (
                                <p className="text-xs text-gray-500 text-center">
                                    +{dividasPagas.length - 5} dívidas pagas
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Modais */}
            <ModalDivida
                aberto={modalAberto}
                onFechar={() => setModalAberto(false)}
                onSalvar={handleAdicionarDivida}
                titulo="Nova Dívida"
            />

            <ModalDivida
                aberto={modalEdicao.aberto}
                onFechar={() => setModalEdicao({ aberto: false, id: '' })}
                onSalvar={handleEditarDivida}
                dividaInicial={modalEdicao.dados}
                titulo="Editar Dívida"
            />

            <ModalConfirmacao
                aberto={modalExclusao.aberto}
                onFechar={() => setModalExclusao({ aberto: false, id: '', descricao: '' })}
                onConfirmar={handleExcluirDivida}
                titulo="Excluir Dívida"
                mensagem={`Tem certeza que deseja excluir "${modalExclusao.descricao}"?`}
                tipo="danger"
            />

            <ModalConfirmacao
                aberto={modalPagamento.aberto}
                onFechar={() => setModalPagamento({ aberto: false, id: '', descricao: '', valor: 0 })}
                onConfirmar={handlePagarDivida}
                titulo="Confirmar Pagamento"
                mensagem={`Marcar "${modalPagamento.descricao}" (${formatarMoeda(modalPagamento.valor)}) como pago? O valor será debitado do seu caixa.`}
                tipo="success"
            />
        </div>
    );
}
