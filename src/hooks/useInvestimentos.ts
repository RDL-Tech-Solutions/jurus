import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDataManager } from './useDataManager';

export interface Investimento {
  id: string;
  nome: string;
  tipo: 'renda_fixa' | 'renda_variavel' | 'fundos' | 'criptomoedas' | 'outros';
  categoria: string;
  valorInvestido: number;
  valorAtual: number;
  dataInvestimento: string;
  dataVencimento?: string;
  rentabilidade: number;
  rentabilidadeAnual: number;
  corretora: string;
  observacoes?: string;
  tags: string[];
  ativo: boolean;
}

export interface Portfolio {
  id: string;
  nome: string;
  descricao?: string;
  investimentos: Investimento[];
  dataCriacao: string;
  dataAtualizacao: string;
  meta?: {
    valorObjetivo: number;
    prazo: string;
    descricao: string;
  };
}

export interface Transacao {
  id: string;
  investimentoId: string;
  tipo: 'compra' | 'venda' | 'dividendo' | 'juros' | 'taxa';
  valor: number;
  quantidade?: number;
  preco?: number;
  data: string;
  descricao?: string;
  corretora: string;
}

export interface ResumoInvestimentos {
  valorTotalInvestido: number;
  valorAtualTotal: number;
  rentabilidadeTotal: number;
  rentabilidadePercentual: number;
  distribuicaoPorTipo: Record<string, number>;
  distribuicaoPorCorretora: Record<string, number>;
  melhorInvestimento: Investimento | null;
  piorInvestimento: Investimento | null;
}

export const useInvestimentos = () => {
  const { getCurrentProfileData, saveCurrentProfileData } = useDataManager();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obter dados atuais
  const data = getCurrentProfileData();
  const portfolios = data?.portfolios || [];
  const transacoes = data?.transactions || [];

  // Criar novo portfólio
  const criarPortfolio = useCallback(async (
    nome: string,
    descricao?: string,
    meta?: Portfolio['meta']
  ): Promise<Portfolio> => {
    setLoading(true);
    setError(null);

    try {
      const novoPortfolio: Portfolio = {
        id: `portfolio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        nome,
        descricao,
        investimentos: [],
        dataCriacao: new Date().toISOString(),
        dataAtualizacao: new Date().toISOString(),
        meta
      };

      const currentData = getCurrentProfileData();
      if (currentData) {
        const updatedData = {
          ...currentData,
          portfolios: [...currentData.portfolios, novoPortfolio]
        };
        saveCurrentProfileData(updatedData);
      }

      return novoPortfolio;
    } catch (err) {
      setError('Erro ao criar portfólio');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getCurrentProfileData, saveCurrentProfileData]);

  // Atualizar portfólio
  const atualizarPortfolio = useCallback(async (
    portfolioId: string,
    updates: Partial<Omit<Portfolio, 'id' | 'dataCriacao'>>
  ): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const currentData = getCurrentProfileData();
      if (currentData) {
        const updatedPortfolios = currentData.portfolios.map(portfolio =>
          portfolio.id === portfolioId
            ? { ...portfolio, ...updates, dataAtualizacao: new Date().toISOString() }
            : portfolio
        );

        const updatedData = {
          ...currentData,
          portfolios: updatedPortfolios
        };
        saveCurrentProfileData(updatedData);
      }
    } catch (err) {
      setError('Erro ao atualizar portfólio');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getCurrentProfileData, saveCurrentProfileData]);

  // Excluir portfólio
  const excluirPortfolio = useCallback(async (portfolioId: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const currentData = getCurrentProfileData();
      if (currentData) {
        const updatedPortfolios = currentData.portfolios.filter(
          portfolio => portfolio.id !== portfolioId
        );

        // Remover transações relacionadas
        const updatedTransacoes = currentData.transactions.filter(
          transacao => !currentData.portfolios
            .find(p => p.id === portfolioId)?.investimentos
            .some(inv => inv.id === transacao.investimentoId)
        );

        const updatedData = {
          ...currentData,
          portfolios: updatedPortfolios,
          transactions: updatedTransacoes
        };
        saveCurrentProfileData(updatedData);
      }
    } catch (err) {
      setError('Erro ao excluir portfólio');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getCurrentProfileData, saveCurrentProfileData]);

  // Adicionar investimento
  const adicionarInvestimento = useCallback(async (
    portfolioId: string,
    investimento: Omit<Investimento, 'id'>
  ): Promise<Investimento> => {
    setLoading(true);
    setError(null);

    try {
      const novoInvestimento: Investimento = {
        ...investimento,
        id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      const currentData = getCurrentProfileData();
      if (currentData) {
        const updatedPortfolios = currentData.portfolios.map(portfolio =>
          portfolio.id === portfolioId
            ? {
                ...portfolio,
                investimentos: [...portfolio.investimentos, novoInvestimento],
                dataAtualizacao: new Date().toISOString()
              }
            : portfolio
        );

        const updatedData = {
          ...currentData,
          portfolios: updatedPortfolios
        };
        saveCurrentProfileData(updatedData);
      }

      return novoInvestimento;
    } catch (err) {
      setError('Erro ao adicionar investimento');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getCurrentProfileData, saveCurrentProfileData]);

  // Atualizar investimento
  const atualizarInvestimento = useCallback(async (
    portfolioId: string,
    investimentoId: string,
    updates: Partial<Omit<Investimento, 'id'>>
  ): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const currentData = getCurrentProfileData();
      if (currentData) {
        const updatedPortfolios = currentData.portfolios.map(portfolio =>
          portfolio.id === portfolioId
            ? {
                ...portfolio,
                investimentos: portfolio.investimentos.map(inv =>
                  inv.id === investimentoId ? { ...inv, ...updates } : inv
                ),
                dataAtualizacao: new Date().toISOString()
              }
            : portfolio
        );

        const updatedData = {
          ...currentData,
          portfolios: updatedPortfolios
        };
        saveCurrentProfileData(updatedData);
      }
    } catch (err) {
      setError('Erro ao atualizar investimento');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getCurrentProfileData, saveCurrentProfileData]);

  // Excluir investimento
  const excluirInvestimento = useCallback(async (
    portfolioId: string,
    investimentoId: string
  ): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const currentData = getCurrentProfileData();
      if (currentData) {
        const updatedPortfolios = currentData.portfolios.map(portfolio =>
          portfolio.id === portfolioId
            ? {
                ...portfolio,
                investimentos: portfolio.investimentos.filter(inv => inv.id !== investimentoId),
                dataAtualizacao: new Date().toISOString()
              }
            : portfolio
        );

        // Remover transações relacionadas
        const updatedTransacoes = currentData.transactions.filter(
          transacao => transacao.investimentoId !== investimentoId
        );

        const updatedData = {
          ...currentData,
          portfolios: updatedPortfolios,
          transactions: updatedTransacoes
        };
        saveCurrentProfileData(updatedData);
      }
    } catch (err) {
      setError('Erro ao excluir investimento');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getCurrentProfileData, saveCurrentProfileData]);

  // Adicionar transação
  const adicionarTransacao = useCallback(async (
    transacao: Omit<Transacao, 'id'>
  ): Promise<Transacao> => {
    setLoading(true);
    setError(null);

    try {
      const novaTransacao: Transacao = {
        ...transacao,
        id: `trans_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      const currentData = getCurrentProfileData();
      if (currentData) {
        const updatedData = {
          ...currentData,
          transactions: [...currentData.transactions, novaTransacao]
        };
        saveCurrentProfileData(updatedData);
      }

      return novaTransacao;
    } catch (err) {
      setError('Erro ao adicionar transação');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getCurrentProfileData, saveCurrentProfileData]);

  // Calcular resumo dos investimentos
  const resumoInvestimentos = useMemo((): ResumoInvestimentos => {
    const todosInvestimentos = portfolios.flatMap(p => p.investimentos);
    
    const valorTotalInvestido = todosInvestimentos.reduce(
      (total, inv) => total + inv.valorInvestido, 0
    );
    
    const valorAtualTotal = todosInvestimentos.reduce(
      (total, inv) => total + inv.valorAtual, 0
    );
    
    const rentabilidadeTotal = valorAtualTotal - valorTotalInvestido;
    const rentabilidadePercentual = valorTotalInvestido > 0 
      ? (rentabilidadeTotal / valorTotalInvestido) * 100 
      : 0;

    // Distribuição por tipo
    const distribuicaoPorTipo = todosInvestimentos.reduce((acc, inv) => {
      acc[inv.tipo] = (acc[inv.tipo] || 0) + inv.valorAtual;
      return acc;
    }, {} as Record<string, number>);

    // Distribuição por corretora
    const distribuicaoPorCorretora = todosInvestimentos.reduce((acc, inv) => {
      acc[inv.corretora] = (acc[inv.corretora] || 0) + inv.valorAtual;
      return acc;
    }, {} as Record<string, number>);

    // Melhor e pior investimento
    const investimentosAtivos = todosInvestimentos.filter(inv => inv.ativo);
    const melhorInvestimento = investimentosAtivos.length > 0
      ? investimentosAtivos.reduce((melhor, atual) => 
          atual.rentabilidadeAnual > melhor.rentabilidadeAnual ? atual : melhor
        )
      : null;
    
    const piorInvestimento = investimentosAtivos.length > 0
      ? investimentosAtivos.reduce((pior, atual) => 
          atual.rentabilidadeAnual < pior.rentabilidadeAnual ? atual : pior
        )
      : null;

    return {
      valorTotalInvestido,
      valorAtualTotal,
      rentabilidadeTotal,
      rentabilidadePercentual,
      distribuicaoPorTipo,
      distribuicaoPorCorretora,
      melhorInvestimento,
      piorInvestimento
    };
  }, [portfolios]);

  return {
    // Estado
    portfolios,
    transacoes,
    resumoInvestimentos,
    loading,
    error,

    // Ações - Portfólios
    criarPortfolio,
    atualizarPortfolio,
    excluirPortfolio,

    // Ações - Investimentos
    adicionarInvestimento,
    atualizarInvestimento,
    excluirInvestimento,

    // Ações - Transações
    adicionarTransacao
  };
};