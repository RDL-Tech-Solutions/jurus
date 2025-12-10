/**
 * Modal de Adicionar/Editar Dívida
 */

import React, { useState, useEffect } from 'react';
import { X, DollarSign, Calendar, FileText, CreditCard, Hash, AlertCircle } from 'lucide-react';
import { useModal } from '../../hooks/useModal';

interface ModalDividaProps {
    aberto: boolean;
    onFechar: () => void;
    onSalvar: (dados: DadosDivida) => void;
    dividaInicial?: DadosDivida;
}

export interface DadosDivida {
    descricao: string;
    valor: number;
    dataVencimento: string;
    parcelas?: number;
    parcelaAtual?: number;
    categoriaId?: string;
    observacoes?: string;
}

export function ModalDivida({ aberto, onFechar, onSalvar, dividaInicial }: ModalDividaProps) {
    useModal(aberto);

    const [dados, setDados] = useState<DadosDivida>({
        descricao: '',
        valor: 0,
        dataVencimento: new Date().toISOString().split('T')[0],
        parcelas: 1,
        parcelaAtual: 1,
        categoriaId: '',
        observacoes: ''
    });

    const [erros, setErros] = useState<Record<string, string>>({});

    useEffect(() => {
        if (dividaInicial) {
            setDados(dividaInicial);
        } else {
            setDados({
                descricao: '',
                valor: 0,
                dataVencimento: new Date().toISOString().split('T')[0],
                parcelas: 1,
                parcelaAtual: 1,
                categoriaId: '',
                observacoes: ''
            });
        }
        setErros({});
    }, [aberto, dividaInicial]);

    const validar = (): boolean => {
        const novosErros: Record<string, string> = {};

        if (!dados.descricao.trim()) {
            novosErros.descricao = 'Descrição é obrigatória';
        }

        if (dados.valor <= 0) {
            novosErros.valor = 'Valor deve ser maior que zero';
        }

        if (!dados.dataVencimento) {
            novosErros.dataVencimento = 'Data de vencimento é obrigatória';
        }

        if (dados.parcelas && dados.parcelas < 1) {
            novosErros.parcelas = 'Número de parcelas inválido';
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
                        <CreditCard className="w-6 h-6 text-red-600" />
                        {dividaInicial ? 'Editar Dívida' : 'Nova Dívida'}
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
                        {/* Descrição */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <FileText className="w-4 h-4 inline mr-1" />
                                Descrição *
                            </label>
                            <input
                                type="text"
                                value={dados.descricao}
                                onChange={(e) => setDados({ ...dados, descricao: e.target.value })}
                                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                                    erros.descricao ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                }`}
                                placeholder="Ex: Empréstimo pessoal"
                            />
                            {erros.descricao && (
                                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {erros.descricao}
                                </p>
                            )}
                        </div>

                        {/* Valor */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <DollarSign className="w-4 h-4 inline mr-1" />
                                Valor Total *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={dados.valor || ''}
                                onChange={(e) => setDados({ ...dados, valor: parseFloat(e.target.value) || 0 })}
                                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                                    erros.valor ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                }`}
                                placeholder="0.00"
                            />
                            {erros.valor && (
                                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {erros.valor}
                                </p>
                            )}
                        </div>

                        {/* Data de Vencimento */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <Calendar className="w-4 h-4 inline mr-1" />
                                Data de Vencimento *
                            </label>
                            <input
                                type="date"
                                value={dados.dataVencimento}
                                onChange={(e) => setDados({ ...dados, dataVencimento: e.target.value })}
                                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                                    erros.dataVencimento ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                }`}
                            />
                            {erros.dataVencimento && (
                                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {erros.dataVencimento}
                                </p>
                            )}
                        </div>

                        {/* Parcelas */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    <Hash className="w-4 h-4 inline mr-1" />
                                    Total de Parcelas
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={dados.parcelas || 1}
                                    onChange={(e) => setDados({ ...dados, parcelas: parseInt(e.target.value) || 1 })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    <Hash className="w-4 h-4 inline mr-1" />
                                    Parcela Atual
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max={dados.parcelas || 1}
                                    value={dados.parcelaAtual || 1}
                                    onChange={(e) => setDados({ ...dados, parcelaAtual: parseInt(e.target.value) || 1 })}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Valor da Parcela (calculado) */}
                        {dados.parcelas && dados.parcelas > 1 && (
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                <p className="text-sm text-blue-900 dark:text-blue-100">
                                    <strong>Valor por parcela:</strong> R$ {(dados.valor / dados.parcelas).toFixed(2)}
                                </p>
                            </div>
                        )}

                        {/* Observações */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Observações
                            </label>
                            <textarea
                                value={dados.observacoes || ''}
                                onChange={(e) => setDados({ ...dados, observacoes: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                                placeholder="Informações adicionais..."
                            />
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
                        className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-medium"
                    >
                        {dividaInicial ? 'Atualizar' : 'Adicionar'}
                    </button>
                </div>
            </div>
        </div>
    );
}
