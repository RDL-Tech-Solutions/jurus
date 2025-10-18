import { useCallback, useMemo } from 'react';
import { useMetas } from '../store/useAppStore';
import { MetaFinanceira, ProgressoMeta, NotificacaoMeta, AnaliseViabilidadeMeta } from '../types/metas';
import { useToast } from './useToast';

export const useMetasFinanceiras = () => {
  const { success: toast } = useToast();
  const {
    metas,
    notificacoesMetas,
    adicionarMeta,
    atualizarMeta,
    removerMeta,
    adicionarContribuicaoMeta,
    calcularProgressoMeta,
    adicionarNotificacaoMeta,
    marcarNotificacaoLida,
    limparNotificacoesMetas
  } = useMetas();

  // Calcular estatísticas das metas
  const estatisticas = useMemo(() => {
    const total = metas.length;
    const concluidas = metas.filter(meta => meta.status === 'concluida').length;
    const emAndamento = metas.filter(meta => meta.status === 'ativa' || meta.status === 'em_andamento').length;
    const pausadas = metas.filter(meta => meta.status === 'pausada').length;
    const atrasadas = metas.filter(meta => {
      const hoje = new Date();
      return (meta.status === 'ativa' || meta.status === 'em_andamento') && 
             meta.dataLimite && 
             new Date(meta.dataLimite) < hoje &&
             meta.valorAtual < meta.valorMeta;
    }).length;

    const valorTotalMetas = metas.reduce((acc, meta) => acc + meta.valorMeta, 0);
    const valorTotalAtual = metas.reduce((acc, meta) => acc + meta.valorAtual, 0);
    const progressoGeral = valorTotalMetas > 0 ? (valorTotalAtual / valorTotalMetas) * 100 : 0;

    return {
      total,
      concluidas,
      emAndamento,
      pausadas,
      atrasadas,
      valorTotalMetas,
      valorTotalAtual,
      progressoGeral
    };
  }, [metas]);

  // Metas por categoria
  const metasPorCategoria = useMemo(() => {
    return metas.reduce((acc, meta) => {
      if (!acc[meta.categoria]) {
        acc[meta.categoria] = [];
      }
      acc[meta.categoria].push(meta);
      return acc;
    }, {} as Record<string, MetaFinanceira[]>);
  }, [metas]);

  // Metas próximas do vencimento
  const metasProximasVencimento = useMemo(() => {
    const hoje = new Date();
    const proximoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, hoje.getDate());
    
    return metas.filter(meta => {
      if (!meta.dataLimite || meta.status === 'concluida') return false;
      const dataLimite = new Date(meta.dataLimite);
      return dataLimite <= proximoMes && dataLimite >= hoje;
    });
  }, [metas]);

  // Criar nova meta
  const criarMeta = useCallback((dadosMeta: Omit<MetaFinanceira, 'id' | 'valorAtual' | 'status' | 'historico'>) => {
    const novaMeta: MetaFinanceira = {
      ...dadosMeta,
      id: crypto.randomUUID(),
      valorAtual: 0,
      status: 'em_andamento',
      historico: []
    };

    adicionarMeta(novaMeta);
    toast(`Meta "${novaMeta.nome}" criada com sucesso!`);
    
    return novaMeta;
  }, [adicionarMeta, toast]);

  // Atualizar meta existente
  const editarMeta = useCallback((id: string, dadosAtualizados: Partial<MetaFinanceira>) => {
    atualizarMeta(id, dadosAtualizados);
    toast('Meta atualizada com sucesso!');
  }, [atualizarMeta, toast]);

  // Excluir meta
  const excluirMeta = useCallback((id: string) => {
    const meta = metas.find(m => m.id === id);
    if (meta) {
      removerMeta(id);
      toast(`Meta "${meta.nome}" removida com sucesso!`);
    }
  }, [metas, removerMeta, toast]);

  // Adicionar contribuição
  const adicionarContribuicao = useCallback((id: string, valor: number, descricao?: string) => {
    const meta = metas.find(m => m.id === id);
    if (!meta) return;

    adicionarContribuicaoMeta(id, valor, descricao);
    
    const novoValorAtual = meta.valorAtual + valor;
    const progresso = (novoValorAtual / meta.valorMeta) * 100;
    
    toast(`Contribuição de R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} adicionada!`);
    
    // Verificar se a meta foi concluída
    if (novoValorAtual >= meta.valorMeta && meta.status !== 'concluida') {
      atualizarMeta(id, { status: 'concluida' });
      toast(`🎉 Parabéns! Meta "${meta.nome}" foi concluída!`);
      
      // Adicionar notificação de conclusão
      const notificacao: NotificacaoMeta = {
        id: crypto.randomUUID(),
        metaId: id,
        tipo: 'meta_concluida',
        titulo: 'Meta Concluída!',
        mensagem: `Parabéns! Você atingiu a meta "${meta.nome}"`,
        data: new Date(),
        lida: false,
        prioridade: 'alta'
      };
      adicionarNotificacaoMeta(notificacao);
    }
    // Verificar marcos importantes
    else if (progresso >= 25 && progresso < 50 && meta.valorAtual < meta.valorMeta * 0.25) {
      const notificacao: NotificacaoMeta = {
        id: crypto.randomUUID(),
        metaId: id,
        tipo: 'marco_atingido',
        titulo: 'Marco Atingido!',
        mensagem: `Você atingiu 25% da meta "${meta.nome}"`,
        data: new Date(),
        lida: false,
        prioridade: 'baixa'
      };
      adicionarNotificacaoMeta(notificacao);
    }
    else if (progresso >= 50 && progresso < 75 && meta.valorAtual < meta.valorMeta * 0.5) {
      const notificacao: NotificacaoMeta = {
        id: crypto.randomUUID(),
        metaId: id,
        tipo: 'marco_atingido',
        titulo: 'Marco Atingido!',
        mensagem: `Você atingiu 50% da meta "${meta.nome}"`,
        data: new Date(),
        lida: false,
        prioridade: 'media'
      };
      adicionarNotificacaoMeta(notificacao);
    }
    else if (progresso >= 75 && progresso < 100 && meta.valorAtual < meta.valorMeta * 0.75) {
      const notificacao: NotificacaoMeta = {
        id: crypto.randomUUID(),
        metaId: id,
        tipo: 'marco_atingido',
        titulo: 'Marco Atingido!',
        mensagem: `Você atingiu 75% da meta "${meta.nome}"`,
        data: new Date(),
        lida: false,
        prioridade: 'media'
      };
      adicionarNotificacaoMeta(notificacao);
    }
  }, [metas, adicionarContribuicaoMeta, atualizarMeta, adicionarNotificacaoMeta, toast]);

  // Pausar/retomar meta
  const alternarStatusMeta = useCallback((id: string) => {
    const meta = metas.find(m => m.id === id);
    if (!meta) return;

    const novoStatus = meta.status === 'pausada' ? 'em_andamento' : 'pausada';
    atualizarMeta(id, { status: novoStatus });
    
    const acao = novoStatus === 'pausada' ? 'pausada' : 'retomada';
    toast(`Meta "${meta.nome}" ${acao} com sucesso!`);
  }, [metas, atualizarMeta, toast]);

  // Calcular tempo restante para meta
  const calcularTempoRestante = useCallback((meta: MetaFinanceira) => {
    if (!meta.dataLimite) return null;
    
    const hoje = new Date();
    const dataLimite = new Date(meta.dataLimite);
    const diferenca = dataLimite.getTime() - hoje.getTime();
    
    if (diferenca <= 0) return { dias: 0, meses: 0, anos: 0, vencida: true };
    
    const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
    const meses = Math.floor(dias / 30);
    const anos = Math.floor(meses / 12);
    
    return { dias, meses, anos, vencida: false };
  }, []);

  // Calcular valor necessário por mês
  const calcularValorMensalNecessario = useCallback((meta: MetaFinanceira) => {
    if (!meta.dataLimite || meta.status === 'concluida') return 0;
    
    const hoje = new Date();
    const dataLimite = new Date(meta.dataLimite);
    const mesesRestantes = Math.max(1, Math.ceil((dataLimite.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24 * 30)));
    const valorRestante = meta.valorMeta - meta.valorAtual;
    
    return valorRestante / mesesRestantes;
  }, []);

  // Análise de viabilidade da meta
  const analisarViabilidadeMeta = useCallback((meta: MetaFinanceira): AnaliseViabilidadeMeta => {
    const hoje = new Date();
    const dataLimite = new Date(meta.dataLimite);
    const mesesRestantes = Math.max(1, Math.ceil((dataLimite.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24 * 30)));
    const valorRestante = meta.valorMeta - meta.valorAtual;
    const valorMensalNecessario = valorRestante / mesesRestantes;

    // Calcular probabilidade de sucesso baseada no histórico
    const contribuicoesMensais = meta.historico
      .filter(h => h.tipo === 'deposito')
      .reduce((acc, h) => {
        const mes = `${h.data.getFullYear()}-${h.data.getMonth()}`;
        acc[mes] = (acc[mes] || 0) + h.valor;
        return acc;
      }, {} as Record<string, number>);

    const mediaContribuicaoMensal = Object.values(contribuicoesMensais).length > 0
      ? Object.values(contribuicoesMensais).reduce((a, b) => a + b, 0) / Object.values(contribuicoesMensais).length
      : meta.contribuicaoMensal || 0;

    const probabilidadeSucesso = Math.min(100, Math.max(0, (mediaContribuicaoMensal / valorMensalNecessario) * 100));
    const viavel = probabilidadeSucesso >= 70;

    const sugestoes: string[] = [];
    let motivoInviabilidade: string | undefined;

    if (!viavel) {
      motivoInviabilidade = `Valor mensal necessário (R$ ${valorMensalNecessario.toFixed(2)}) é muito alto comparado ao histórico`;
      sugestoes.push(`Considere estender o prazo da meta`);
      sugestoes.push(`Aumente a contribuição mensal para R$ ${valorMensalNecessario.toFixed(2)}`);
      sugestoes.push(`Reduza o valor objetivo da meta`);
    } else {
      sugestoes.push(`Continue com as contribuições regulares`);
      sugestoes.push(`Considere aumentar a contribuição quando possível`);
    }

    // Cenários
    const cenarios = {
      otimista: {
        dataPrevisao: new Date(hoje.getTime() + (mesesRestantes * 0.8 * 30 * 24 * 60 * 60 * 1000)),
        valorMensal: valorMensalNecessario * 1.2
      },
      realista: {
        dataPrevisao: new Date(hoje.getTime() + (mesesRestantes * 30 * 24 * 60 * 60 * 1000)),
        valorMensal: valorMensalNecessario
      },
      pessimista: {
        dataPrevisao: new Date(hoje.getTime() + (mesesRestantes * 1.3 * 30 * 24 * 60 * 60 * 1000)),
        valorMensal: valorMensalNecessario * 0.8
      }
    };

    return {
      viavel,
      motivoInviabilidade,
      sugestoes,
      valorMensalRecomendado: valorMensalNecessario,
      probabilidadeSucesso,
      cenarios
    };
  }, []);

  // Gerar sugestões de ajuste de contribuições
  const gerarSugestoesContribuicao = useCallback((meta: MetaFinanceira) => {
    const analise = analisarViabilidadeMeta(meta);
    const sugestoes: string[] = [];

    if (analise.probabilidadeSucesso < 50) {
      sugestoes.push(`🚨 Meta em risco! Aumente a contribuição para R$ ${analise.valorMensalRecomendado.toFixed(2)}/mês`);
    } else if (analise.probabilidadeSucesso < 80) {
      sugestoes.push(`⚠️ Meta desafiadora. Considere contribuir R$ ${(analise.valorMensalRecomendado * 1.1).toFixed(2)}/mês para maior segurança`);
    } else {
      sugestoes.push(`✅ Meta no caminho certo! Continue com as contribuições atuais`);
    }

    return sugestoes;
  }, [analisarViabilidadeMeta]);

  // Sistema de notificações inteligentes
  const verificarNotificacoesPendentes = useCallback(() => {
    const hoje = new Date();
    const notificacoesPendentes: NotificacaoMeta[] = [];

    metas.forEach(meta => {
      if (meta.status === 'concluida') return;

      // Verificar prazo próximo
      if (meta.dataLimite) {
        const diasRestantes = Math.ceil((new Date(meta.dataLimite).getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diasRestantes <= 30 && diasRestantes > 0) {
          const jaNotificado = notificacoesMetas.some(n => 
            n.metaId === meta.id && 
            n.tipo === 'prazo' && 
            !n.lida &&
            Math.abs(new Date(n.data).getTime() - hoje.getTime()) < (7 * 24 * 60 * 60 * 1000)
          );

          if (!jaNotificado) {
            notificacoesPendentes.push({
              id: crypto.randomUUID(),
              metaId: meta.id,
              tipo: 'prazo',
              titulo: 'Prazo Próximo!',
              mensagem: `A meta "${meta.nome}" vence em ${diasRestantes} dias`,
              data: hoje,
              lida: false,
              prioridade: diasRestantes <= 7 ? 'alta' : 'media'
            });
          }
        }
      }

      // Verificar necessidade de contribuição
      const ultimaContribuicao = meta.historico
        .filter(h => h.tipo === 'deposito')
        .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())[0];

      if (ultimaContribuicao) {
        const diasSemContribuicao = Math.ceil((hoje.getTime() - new Date(ultimaContribuicao.data).getTime()) / (1000 * 60 * 60 * 24));
        
        if (diasSemContribuicao >= 30) {
          const jaNotificado = notificacoesMetas.some(n => 
            n.metaId === meta.id && 
            n.tipo === 'contribuicao' && 
            !n.lida &&
            Math.abs(new Date(n.data).getTime() - hoje.getTime()) < (7 * 24 * 60 * 60 * 1000)
          );

          if (!jaNotificado) {
            notificacoesPendentes.push({
              id: crypto.randomUUID(),
              metaId: meta.id,
              tipo: 'contribuicao',
              titulo: 'Lembrete de Contribuição',
              mensagem: `Não há contribuições para "${meta.nome}" há ${diasSemContribuicao} dias`,
              data: hoje,
              lida: false,
              prioridade: 'media'
            });
          }
        }
      }
    });

    // Adicionar notificações pendentes
    notificacoesPendentes.forEach(notificacao => {
      adicionarNotificacaoMeta(notificacao);
    });

    return notificacoesPendentes.length;
  }, [metas, notificacoesMetas, adicionarNotificacaoMeta]);

  return {
    // Dados
    metas,
    notificacoesMetas,
    estatisticas,
    metasPorCategoria,
    metasProximasVencimento,
    
    // Ações
    criarMeta,
    editarMeta,
    excluirMeta,
    adicionarContribuicao,
    alternarStatusMeta,
    calcularProgressoMeta,
    marcarNotificacaoLida,
    limparNotificacoesMetas,
    
    // Utilitários
    calcularTempoRestante,
    calcularValorMensalNecessario,
    
    // Funcionalidades avançadas
    analisarViabilidadeMeta,
    gerarSugestoesContribuicao,
    verificarNotificacoesPendentes
  };
};