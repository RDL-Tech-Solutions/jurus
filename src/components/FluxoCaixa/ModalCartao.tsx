/**
 * Modal de Adicionar/Editar Cartão de Crédito
 */

import React, { useState, useEffect } from 'react';
import { X, CreditCard, DollarSign, Calendar, Palette, AlertCircle } from 'lucide-react';
import { useModal } from '../../hooks/useModal';

interface ModalCartaoProps {
    aberto: boolean;
    onFechar: () => void;
    onSalvar: (dados: DadosCartao) => void;
    cartaoInicial?: DadosCartao;
}

export interface DadosCartao {
    nome: string;
    limite: number;
    diaFechamento: number;
    diaVencimento: number;
    bandeira: string;
    cor: string;
}

const BANDEIRAS = [
    { id: 'visa', nome: 'Visa', icon: '💳' },
    { id: 'mastercard', nome: 'Mastercard', icon: '💳' },
    { id: 'elo', nome: 'Elo', icon: '💳' },
    { id: 'amex', nome: 'American Express', icon: '💳' },
    { id: 'hipercard', nome: 'Hipercard', icon: '💳' },
    { id: 'outro', nome: 'Outro', icon: '💳' }
];

const CORES = [
    { nome: 'Azul', valor: '#3b82f6' },
    { nome: 'Roxo', valor: '#8b5cf6' },
    { nome: 'Rosa', valor: '#ec4899' },
    { nome: 'Verde', valor: '#10b981' },
    { nome: 'Laranja', valor: '#f97316' },
    { nome: 'Vermelho', valor: '#ef4444' },
    { nome: 'Amarelo', valor: '#eab308' },
    { nome: 'Cinza', valor: '#6b7280' },
    { nome: 'Preto', valor: '#1f2937' }
];

export function ModalCartao({ aberto, onFechar, onSalvar, cartaoInicial }: ModalCartaoProps) {
    useModal(aberto);

    const [dados, setDados] = useState<DadosCartao>({
        nome: '',
        limite: 0,
        diaFechamento: 1,
        diaVencimento: 10,
        bandeira: 'visa',
        cor: '#3b82f6'
    });

    const [erros, setErros] = useState<Record<string, string>>({});

    useEffect(() => {
        if (cartaoInicial) {
            setDados(cartaoInicial);
        } else {
            setDados({
                nome: '',
                limite: 0,
                diaFechamento: 1,
                diaVencimento: 10,
                bandeira: 'visa',
                cor: '#3b82f6'
            });
        }
        setErros({});
    }, [aberto, cartaoInicial]);

    const validar = (): boolean => {
        const novosErros: Record<string, string> = {};

        if (!dados.nome.trim()) {
            novosErros.nome = 'Nome do cartão é obrigatório';
        }

        if (dados.limite <= 0) {
            novosErros.limite = 'Limite deve ser maior que zero';
        }

        if (dados.diaFechamento < 1 || dados.diaFechamento > 31) {
            novosErros.diaFechamento = 'Dia deve estar entre 1 e 31';
        }

        if (dados.diaVencimento < 1 || dados.diaVencimento > 31) {
            novosErros.diaVencimento = 'Dia deve estar entre 1 e 31';
        }

        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const handleSalvar = () => {
        if (validar()) {
            onSalvar(dados);
            onFechar();
        }
    };

    if (!aberto) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={(e) => {
                if (e.target === e.currentTarget) onFechar();
            }}
        >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden animate-in zoom-in-95 fade-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <CreditCard className="w-6 h-6 text-blue-600" />
                        {cartaoInicial ? 'Editar Cartão' : 'Novo Cartão'}
                    </h2>
                    <button
                        onClick={onFechar}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    <div className="space-y-4">
                        {/* Preview do Cartão */}
                        <div
                            className="h-40 rounded-2xl p-6 text-white relative overflow-hidden"
                            style={{ background: `linear-gradient(135deg, ${dados.cor} 0%, ${dados.cor}dd 100%)` }}
                        >
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-white rounded-full -translate-y-24 translate-x-24" />
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-16 -translate-x-16" />
                            </div>
                            <div className="relative h-full flex flex-col justify-between">
                                <div>
                                    <p className="text-xs opacity-80">Cartão de Crédito</p>
                                    <h3 className="text-lg font-bold mt-1">{dados.nome || 'Meu Cartão'}</h3>
                                </div>
                                <div className="flex items-end justify-between">
                                    <div>
                                        <p className="text-xs opacity-70">Limite</p>
                                        <p className="text-sm font-semibold">
                                            R$ {dados.limite.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs opacity-70">{BANDEIRAS.find(b => b.id === dados.bandeira)?.nome}</p>
                                        <p className="text-xs">{dados.diaFechamento}/{dados.diaVencimento}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Nome do Cartão */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <CreditCard className="w-4 h-4 inline mr-1" />
                                Nome do Cartão *
                            </label>
                            <input
                                type="text"
                                value={dados.nome}
                                onChange={(e) => setDados({ ...dados, nome: e.target.value })}
                                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                                    erros.nome ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                }`}
                                placeholder="Ex: Nubank Platinum"
                            />
                            {erros.nome && (
                                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {erros.nome}
                                </p>
                            )}
                        </div>

                        {/* Limite */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <DollarSign className="w-4 h-4 inline mr-1" />
                                Limite Total *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={dados.limite || ''}
                                onChange={(e) => setDados({ ...dados, limite: parseFloat(e.target.value) || 0 })}
                                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                                    erros.limite ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                }`}
                                placeholder="0.00"
                            />
                            {erros.limite && (
                                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {erros.limite}
                                </p>
                            )}
                        </div>

                        {/* Bandeira */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Bandeira
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {BANDEIRAS.map((bandeira) => (
                                    <button
                                        key={bandeira.id}
                                        type="button"
                                        onClick={() => setDados({ ...dados, bandeira: bandeira.id })}
                                        className={`p-3 rounded-lg border-2 transition-all ${
                                            dados.bandeira === bandeira.id
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        <span className="text-2xl">{bandeira.icon}</span>
                                        <p className="text-xs mt-1">{bandeira.nome}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Datas */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    <Calendar className="w-4 h-4 inline mr-1" />
                                    Dia Fechamento *
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="31"
                                    value={dados.diaFechamento}
                                    onChange={(e) => setDados({ ...dados, diaFechamento: parseInt(e.target.value) || 1 })}
                                    className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                                        erros.diaFechamento ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                />
                                {erros.diaFechamento && (
                                    <p className="mt-1 text-xs text-red-600">{erros.diaFechamento}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    <Calendar className="w-4 h-4 inline mr-1" />
                                    Dia Vencimento *
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="31"
                                    value={dados.diaVencimento}
                                    onChange={(e) => setDados({ ...dados, diaVencimento: parseInt(e.target.value) || 10 })}
                                    className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                                        erros.diaVencimento ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                    }`}
                                />
                                {erros.diaVencimento && (
                                    <p className="mt-1 text-xs text-red-600">{erros.diaVencimento}</p>
                                )}
                            </div>
                        </div>

                        {/* Cor */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <Palette className="w-4 h-4 inline mr-1" />
                                Cor do Cartão
                            </label>
                            <div className="grid grid-cols-9 gap-2">
                                {CORES.map((cor) => (
                                    <button
                                        key={cor.valor}
                                        type="button"
                                        onClick={() => setDados({ ...dados, cor: cor.valor })}
                                        className={`w-10 h-10 rounded-lg border-2 transition-all ${
                                            dados.cor === cor.valor
                                                ? 'border-white ring-2 ring-blue-500 scale-110'
                                                : 'border-gray-300 dark:border-gray-600'
                                        }`}
                                        style={{ backgroundColor: cor.valor }}
                                        title={cor.nome}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                    <button
                        onClick={onFechar}
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSalvar}
                        className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
                    >
                        {cartaoInicial ? 'Atualizar' : 'Adicionar'}
                    </button>
                </div>
            </div>
        </div>
    );
}
