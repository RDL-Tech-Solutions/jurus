import React, { useState, useMemo } from 'react';
import {
    Plus,
    X,
    Check,
    Pencil,
    Trash2,
    CreditCard,
    Calendar,
    DollarSign,
    ChevronRight,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';
import { useCartaoCredito } from '../hooks/useCartaoCredito';
import { NovoCartao, NovoGastoCartao, CartaoCredito, CORES_CARTAO, BANDEIRAS_CARTAO, CATEGORIAS_PADRAO } from '../types/fluxoCaixa';
import { formatarMoeda } from '../utils/calculos';
import { cn } from '../utils/cn';

// Modal de Adicionar/Editar Cartão
interface ModalCartaoProps {
    aberto: boolean;
    onFechar: () => void;
    onSalvar: (dados: NovoCartao) => void;
    cartaoInicial?: Partial<NovoCartao>;
    titulo: string;
}

function ModalCartao({ aberto, onFechar, onSalvar, cartaoInicial, titulo }: ModalCartaoProps) {
    const [dados, setDados] = useState<Partial<NovoCartao>>({
        nome: '',
        bandeira: 'visa',
        limite: 0,
        diaFechamento: 1,
        diaVencimento: 10,
        cor: CORES_CARTAO[0].cor,
        ...cartaoInicial
    });

    const [erros, setErros] = useState<Record<string, string>>({});

    React.useEffect(() => {
        if (cartaoInicial) {
            setDados({
                nome: '',
                bandeira: 'visa',
                limite: 0,
                diaFechamento: 1,
                diaVencimento: 10,
                cor: CORES_CARTAO[0].cor,
                ...cartaoInicial
            });
        }
    }, [cartaoInicial]);

    const validar = (): boolean => {
        const novosErros: Record<string, string> = {};
        if (!dados.nome?.trim()) novosErros.nome = 'Nome é obrigatório';
        if (!dados.limite || dados.limite <= 0) novosErros.limite = 'Limite deve ser maior que zero';
        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const handleSalvar = () => {
        if (validar()) {
            onSalvar(dados as NovoCartao);
            onFechar();
            setDados({
                nome: '',
                bandeira: 'visa',
                limite: 0,
                diaFechamento: 1,
                diaVencimento: 10,
                cor: CORES_CARTAO[0].cor
            });
        }
    };

    if (!aberto) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{titulo}</h3>
                    <button onClick={onFechar} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-4 space-y-4">
                    {/* Nome */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nome do Cartão *</label>
                        <input
                            type="text"
                            value={dados.nome || ''}
                            onChange={(e) => setDados(prev => ({ ...prev, nome: e.target.value }))}
                            className={cn('input-mobile', erros.nome && 'border-red-500')}
                            placeholder="Ex: Nubank, Inter, C6..."
                        />
                        {erros.nome && <p className="text-red-500 text-xs mt-1">{erros.nome}</p>}
                    </div>

                    {/* Bandeira */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bandeira</label>
                        <div className="grid grid-cols-3 gap-2">
                            {BANDEIRAS_CARTAO.map(b => (
                                <button
                                    key={b.id}
                                    type="button"
                                    onClick={() => setDados(prev => ({ ...prev, bandeira: b.id as any }))}
                                    className={cn(
                                        'p-2 rounded-lg border-2 text-xs font-medium transition-all',
                                        dados.bandeira === b.id
                                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                            : 'border-gray-200 dark:border-gray-700'
                                    )}
                                >
                                    {b.nome}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Limite */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Limite (R$) *</label>
                        <input
                            type="number"
                            value={dados.limite || ''}
                            onChange={(e) => setDados(prev => ({ ...prev, limite: Number(e.target.value) || 0 }))}
                            className={cn('input-mobile', erros.limite && 'border-red-500')}
                            placeholder="5000"
                        />
                        {erros.limite && <p className="text-red-500 text-xs mt-1">{erros.limite}</p>}
                    </div>

                    {/* Dias */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Dia Fechamento</label>
                            <input
                                type="number"
                                min="1"
                                max="31"
                                value={dados.diaFechamento || ''}
                                onChange={(e) => setDados(prev => ({ ...prev, diaFechamento: Number(e.target.value) || 1 }))}
                                className="input-mobile"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Dia Vencimento</label>
                            <input
                                type="number"
                                min="1"
                                max="31"
                                value={dados.diaVencimento || ''}
                                onChange={(e) => setDados(prev => ({ ...prev, diaVencimento: Number(e.target.value) || 10 }))}
                                className="input-mobile"
                            />
                        </div>
                    </div>

                    {/* Cor */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cor</label>
                        <div className="flex flex-wrap gap-2">
                            {CORES_CARTAO.map(c => (
                                <button
                                    key={c.cor}
                                    type="button"
                                    onClick={() => setDados(prev => ({ ...prev, cor: c.cor }))}
                                    className={cn(
                                        'w-8 h-8 rounded-full border-2 transition-all',
                                        dados.cor === c.cor ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent'
                                    )}
                                    style={{ backgroundColor: c.cor }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 dark:border-gray-700">
                    <button onClick={onFechar} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                        Cancelar
                    </button>
                    <button onClick={handleSalvar} className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 flex items-center space-x-2">
                        <Check className="w-4 h-4" />
                        <span>Salvar</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

// Modal de Adicionar Gasto
interface ModalGastoProps {
    aberto: boolean;
    onFechar: () => void;
    onSalvar: (dados: NovoGastoCartao) => void;
    cartaoId: string;
}

function ModalGasto({ aberto, onFechar, onSalvar, cartaoId }: ModalGastoProps) {
    const [dados, setDados] = useState<Partial<NovoGastoCartao>>({
        cartaoId,
        descricao: '',
        valor: 0,
        parcelas: 1,
        data: new Date().toISOString().split('T')[0],
        categoriaId: CATEGORIAS_PADRAO.filter(c => c.tipo === 'saida')[0]?.id || ''
    });

    const [erros, setErros] = useState<Record<string, string>>({});
    const categoriasSaida = CATEGORIAS_PADRAO.filter(c => c.tipo === 'saida');

    React.useEffect(() => {
        setDados(prev => ({ ...prev, cartaoId }));
    }, [cartaoId]);

    const validar = (): boolean => {
        const novosErros: Record<string, string> = {};
        if (!dados.descricao?.trim()) novosErros.descricao = 'Descrição é obrigatória';
        if (!dados.valor || dados.valor <= 0) novosErros.valor = 'Valor deve ser maior que zero';
        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const handleSalvar = () => {
        if (validar()) {
            onSalvar({ ...dados, cartaoId } as NovoGastoCartao);
            onFechar();
            setDados({
                cartaoId,
                descricao: '',
                valor: 0,
                parcelas: 1,
                data: new Date().toISOString().split('T')[0],
                categoriaId: categoriasSaida[0]?.id || ''
            });
        }
    };

    if (!aberto) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Novo Gasto</h3>
                    <button onClick={onFechar} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descrição *</label>
                        <input
                            type="text"
                            value={dados.descricao || ''}
                            onChange={(e) => setDados(prev => ({ ...prev, descricao: e.target.value }))}
                            className={cn('input-mobile', erros.descricao && 'border-red-500')}
                            placeholder="Ex: iFood, Amazon, Netflix..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Valor (R$) *</label>
                            <input
                                type="number"
                                step="0.01"
                                value={dados.valor || ''}
                                onChange={(e) => setDados(prev => ({ ...prev, valor: Number(e.target.value) || 0 }))}
                                className={cn('input-mobile', erros.valor && 'border-red-500')}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Parcelas</label>
                            <select
                                value={dados.parcelas || 1}
                                onChange={(e) => setDados(prev => ({ ...prev, parcelas: Number(e.target.value) }))}
                                className="input-mobile"
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
                                    <option key={n} value={n}>{n}x</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {dados.parcelas && dados.parcelas > 1 && dados.valor && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            {dados.parcelas}x de {formatarMoeda(dados.valor / dados.parcelas)}
                        </p>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Data</label>
                        <input
                            type="date"
                            value={dados.data || ''}
                            onChange={(e) => setDados(prev => ({ ...prev, data: e.target.value }))}
                            className="input-mobile"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Categoria</label>
                        <div className="grid grid-cols-4 gap-2">
                            {categoriasSaida.slice(0, 8).map(cat => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setDados(prev => ({ ...prev, categoriaId: cat.id }))}
                                    className={cn(
                                        'flex flex-col items-center p-2 rounded-lg border-2 text-center transition-all',
                                        dados.categoriaId === cat.id
                                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                            : 'border-gray-200 dark:border-gray-700'
                                    )}
                                >
                                    <span className="text-lg">{cat.icone}</span>
                                    <span className="text-xs text-gray-700 dark:text-gray-300 mt-1 line-clamp-1">{cat.nome}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 dark:border-gray-700">
                    <button onClick={onFechar} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                        Cancelar
                    </button>
                    <button onClick={handleSalvar} className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 flex items-center space-x-2">
                        <Check className="w-4 h-4" />
                        <span>Adicionar</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

// Modal Confirmação
function ModalConfirmacao({ aberto, onFechar, onConfirmar, titulo, mensagem, tipo = 'danger' }: {
    aberto: boolean;
    onFechar: () => void;
    onConfirmar: () => void;
    titulo: string;
    mensagem: string;
    tipo?: 'danger' | 'success';
}) {
    if (!aberto) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
                <div className={cn(
                    "w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center",
                    tipo === 'danger' ? "bg-red-100 dark:bg-red-900/30" : "bg-green-100 dark:bg-green-900/30"
                )}>
                    {tipo === 'danger' ? (
                        <AlertCircle className="w-6 h-6 text-red-600" />
                    ) : (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                    )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{titulo}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{mensagem}</p>
                <div className="flex items-center justify-center space-x-3">
                    <button onClick={onFechar} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                        Cancelar
                    </button>
                    <button
                        onClick={() => { onConfirmar(); onFechar(); }}
                        className={cn("px-4 py-2 rounded-lg text-white", tipo === 'danger' ? "bg-red-600" : "bg-green-600")}
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
}

// Componente Principal
interface GerenciadorCartaoProps {
    onPagarFatura?: (valor: number, descricao: string) => void;
}

export function GerenciadorCartao({ onPagarFatura }: GerenciadorCartaoProps) {
    const {
        cartoes,
        estatisticas,
        carregado,
        adicionarCartao,
        editarCartao,
        excluirCartao,
        adicionarGasto,
        obterFaturaAtual,
        pagarFatura,
        calcularLimiteUsado
    } = useCartaoCredito();

    const [modalCartao, setModalCartao] = useState(false);
    const [modalGasto, setModalGasto] = useState<{ aberto: boolean; cartaoId: string }>({ aberto: false, cartaoId: '' });
    const [cartaoSelecionado, setCartaoSelecionado] = useState<string | null>(null);
    const [modalExclusao, setModalExclusao] = useState<{ aberto: boolean; id: string; nome: string }>({ aberto: false, id: '', nome: '' });
    const [modalPagamento, setModalPagamento] = useState<{ aberto: boolean; cartaoId: string; valor: number; nome: string }>({
        aberto: false, cartaoId: '', valor: 0, nome: ''
    });

    const cartaoAtivo = useMemo(() => {
        if (!cartaoSelecionado) return null;
        return cartoes.find(c => c.id === cartaoSelecionado);
    }, [cartaoSelecionado, cartoes]);

    const faturaAtual = useMemo(() => {
        if (!cartaoSelecionado) return null;
        return obterFaturaAtual(cartaoSelecionado);
    }, [cartaoSelecionado, obterFaturaAtual]);

    const handlePagarFatura = () => {
        if (modalPagamento.cartaoId) {
            const hoje = new Date();
            const valor = pagarFatura(modalPagamento.cartaoId, hoje.getMonth(), hoje.getFullYear());
            if (onPagarFatura && valor > 0) {
                onPagarFatura(valor, `Fatura ${modalPagamento.nome}`);
            }
        }
    };

    const formatarData = (data: string) => new Date(data).toLocaleDateString('pt-BR');

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
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cartões de Crédito</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Gerencie seus cartões e faturas</p>
                </div>
                <button
                    onClick={() => setModalCartao(true)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 text-sm"
                >
                    <Plus className="w-4 h-4" />
                    <span>Novo Cartão</span>
                </button>
            </div>

            {/* Lista de Cartões */}
            {cartoes.length === 0 ? (
                <div className="p-8 text-center bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <CreditCard className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">Nenhum cartão cadastrado</p>
                    <p className="text-sm text-gray-500">Clique em "Novo Cartão" para começar</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {cartoes.map(cartao => {
                        const usado = calcularLimiteUsado(cartao.id);
                        const percentual = cartao.limite > 0 ? (usado / cartao.limite) * 100 : 0;
                        const isSelected = cartaoSelecionado === cartao.id;

                        return (
                            <button
                                key={cartao.id}
                                onClick={() => setCartaoSelecionado(isSelected ? null : cartao.id)}
                                className={cn(
                                    "p-4 rounded-xl border-2 text-left transition-all",
                                    isSelected
                                        ? "border-primary-500 shadow-lg"
                                        : "border-gray-200 dark:border-gray-700 hover:border-primary-300"
                                )}
                                style={{ borderLeftColor: cartao.cor, borderLeftWidth: '4px' }}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold text-gray-900 dark:text-white">{cartao.nome}</span>
                                    <ChevronRight className={cn("w-4 h-4 text-gray-400 transition-transform", isSelected && "rotate-90")} />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Limite</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{formatarMoeda(cartao.limite)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Usado</span>
                                        <span className={cn("font-medium", usado > 0 ? "text-red-600 dark:text-red-400" : "text-green-600")}>
                                            {formatarMoeda(usado)}
                                        </span>
                                    </div>
                                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className={cn("h-full rounded-full transition-all", percentual > 80 ? "bg-red-500" : "bg-primary-500")}
                                            style={{ width: `${Math.min(percentual, 100)}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>Fecha dia {cartao.diaFechamento}</span>
                                        <span>Vence dia {cartao.diaVencimento}</span>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Detalhes do Cartão Selecionado */}
            {cartaoAtivo && faturaAtual && (
                <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">Fatura Atual - {cartaoAtivo.nome}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Fecha: {formatarData(faturaAtual.dataFechamento)} | Vence: {formatarData(faturaAtual.dataVencimento)}
                            </p>
                        </div>
                        <button
                            onClick={() => setModalGasto({ aberto: true, cartaoId: cartaoAtivo.id })}
                            className="px-3 py-1.5 rounded-lg bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 text-sm font-medium"
                        >
                            + Gasto
                        </button>
                    </div>

                    {/* Lista de Gastos da Fatura */}
                    {faturaAtual.gastos.length === 0 ? (
                        <p className="text-center text-sm text-gray-500 py-4">Nenhum gasto nesta fatura</p>
                    ) : (
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {faturaAtual.gastos.map(gasto => {
                                const cat = CATEGORIAS_PADRAO.find(c => c.id === gasto.categoriaId);
                                return (
                                    <div key={gasto.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <div className="flex items-center space-x-2">
                                            <span>{cat?.icone || '💳'}</span>
                                            <div>
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {gasto.descricao}
                                                    {gasto.parcelas > 1 && ` ${gasto.parcelaAtual}/${gasto.parcelas}`}
                                                </span>
                                                <p className="text-xs text-gray-500">{formatarData(gasto.data)}</p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-medium text-red-600 dark:text-red-400">
                                            {formatarMoeda(gasto.valorParcela)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Total e Pagamento */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total da Fatura</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{formatarMoeda(faturaAtual.total)}</p>
                        </div>
                        {faturaAtual.paga ? (
                            <span className="px-3 py-1.5 rounded-lg bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-sm font-medium">
                                ✓ Pago
                            </span>
                        ) : (
                            <button
                                onClick={() => setModalPagamento({
                                    aberto: true,
                                    cartaoId: cartaoAtivo.id,
                                    valor: faturaAtual.total,
                                    nome: cartaoAtivo.nome
                                })}
                                disabled={faturaAtual.total === 0}
                                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                            >
                                Pagar Fatura
                            </button>
                        )}
                    </div>

                    {/* Ações do Cartão */}
                    <div className="flex items-center justify-end space-x-2 pt-2">
                        <button
                            onClick={() => setModalExclusao({ aberto: true, id: cartaoAtivo.id, nome: cartaoAtivo.nome })}
                            className="px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm"
                        >
                            Excluir Cartão
                        </button>
                    </div>
                </div>
            )}

            {/* Modais */}
            <ModalCartao
                aberto={modalCartao}
                onFechar={() => setModalCartao(false)}
                onSalvar={(dados) => adicionarCartao(dados)}
                titulo="Novo Cartão"
            />

            <ModalGasto
                aberto={modalGasto.aberto}
                onFechar={() => setModalGasto({ aberto: false, cartaoId: '' })}
                onSalvar={(dados) => adicionarGasto(dados)}
                cartaoId={modalGasto.cartaoId}
            />

            <ModalConfirmacao
                aberto={modalExclusao.aberto}
                onFechar={() => setModalExclusao({ aberto: false, id: '', nome: '' })}
                onConfirmar={() => { excluirCartao(modalExclusao.id); setCartaoSelecionado(null); }}
                titulo="Excluir Cartão"
                mensagem={`Excluir "${modalExclusao.nome}" e todos os seus gastos?`}
                tipo="danger"
            />

            <ModalConfirmacao
                aberto={modalPagamento.aberto}
                onFechar={() => setModalPagamento({ aberto: false, cartaoId: '', valor: 0, nome: '' })}
                onConfirmar={handlePagarFatura}
                titulo="Pagar Fatura"
                mensagem={`Pagar fatura de ${formatarMoeda(modalPagamento.valor)} do ${modalPagamento.nome}? O valor será debitado do seu caixa.`}
                tipo="success"
            />
        </div>
    );
}
