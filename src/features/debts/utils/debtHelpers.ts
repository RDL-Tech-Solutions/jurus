/**
 * Funções auxiliares para dívidas
 */

import { Divida } from '../../../types/fluxoCaixa';
import { DebtWithStatus, DebtAlert } from '../types';

/**
 * Calcula o status de uma dívida
 */
export function calculateDebtStatus(debt: Divida): DebtWithStatus['status'] {
  if (debt.pago) return 'paid';
  
  if (!debt.dataVencimento) return 'active';
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dueDate = new Date(debt.dataVencimento);
  dueDate.setHours(0, 0, 0, 0);
  
  if (dueDate < today) return 'overdue';
  
  const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 5) return 'upcoming';
  
  return 'active';
}

/**
 * Calcula dias até o vencimento
 */
export function calculateDaysUntilDue(dueDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  
  return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

// Alias para compatibilidade
export const getDaysUntilDue = calculateDaysUntilDue;

/**
 * Enriquece dívida com informações de status
 */
export function enrichDebtWithStatus(debt: Divida): DebtWithStatus {
  const status = calculateDebtStatus(debt);
  const daysUntilDue = debt.dataVencimento ? calculateDaysUntilDue(debt.dataVencimento) : undefined;
  const isOverdue = status === 'overdue';
  
  // Calcula progresso para parceladas
  let progressPercentage: number | undefined;
  if (debt.numeroParcelas && debt.parcelaAtual) {
    progressPercentage = (debt.parcelaAtual / debt.numeroParcelas) * 100;
  }
  
  return {
    ...debt,
    status,
    daysUntilDue,
    isOverdue,
    progressPercentage
  };
}

/**
 * Gera alertas para dívidas
 */
export function generateDebtAlerts(debts: DebtWithStatus[]): DebtAlert[] {
  const alerts: DebtAlert[] = [];
  
  debts.forEach(debt => {
    // Alerta de vencimento hoje
    if (debt.daysUntilDue === 0 && !debt.pago) {
      alerts.push({
        id: `due-today-${debt.id}`,
        type: 'due_today',
        title: 'Vence Hoje',
        message: `${debt.descricao} vence hoje!`,
        debtId: debt.id,
        severity: 'error'
      });
    }
    
    // Alerta de vencimento próximo (1-5 dias)
    if (debt.daysUntilDue && debt.daysUntilDue > 0 && debt.daysUntilDue <= 5 && !debt.pago) {
      alerts.push({
        id: `due-soon-${debt.id}`,
        type: 'due_soon',
        title: 'Vence em Breve',
        message: `${debt.descricao} vence em ${debt.daysUntilDue} dia${debt.daysUntilDue > 1 ? 's' : ''}`,
        debtId: debt.id,
        severity: 'warning'
      });
    }
    
    // Alerta de atraso
    if (debt.isOverdue) {
      const daysOverdue = Math.abs(debt.daysUntilDue || 0);
      alerts.push({
        id: `overdue-${debt.id}`,
        type: 'overdue',
        title: 'Em Atraso',
        message: `${debt.descricao} está ${daysOverdue} dia${daysOverdue > 1 ? 's' : ''} atrasada`,
        debtId: debt.id,
        severity: 'error'
      });
    }
    
    // Alerta de progresso (50%, 75%)
    if (debt.progressPercentage) {
      if (debt.progressPercentage >= 50 && debt.progressPercentage < 55) {
        alerts.push({
          id: `progress-50-${debt.id}`,
          type: 'progress',
          title: 'Metade Paga',
          message: `Você já pagou 50% de ${debt.descricao}!`,
          debtId: debt.id,
          severity: 'success'
        });
      }
      if (debt.progressPercentage >= 75 && debt.progressPercentage < 80) {
        alerts.push({
          id: `progress-75-${debt.id}`,
          type: 'progress',
          title: 'Quase Lá',
          message: `Você já pagou 75% de ${debt.descricao}!`,
          debtId: debt.id,
          severity: 'success'
        });
      }
    }
  });
  
  return alerts;
}

/**
 * Formata valor monetário
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

/**
 * Formata data para exibição
 */
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Formata data relativa (hoje, amanhã, etc)
 */
export function formatRelativeDate(date: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  
  const diffDays = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Hoje';
  if (diffDays === 1) return 'Amanhã';
  if (diffDays === -1) return 'Ontem';
  if (diffDays < 0) return `${Math.abs(diffDays)} dias atrás`;
  if (diffDays <= 7) return `Em ${diffDays} dias`;
  
  return formatDate(date);
}
