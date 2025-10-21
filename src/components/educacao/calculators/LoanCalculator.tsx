import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Home, Car, Calculator, TrendingDown, DollarSign, Calendar, Percent } from 'lucide-react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';

interface LoanData {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  downPayment: number;
  loanType: 'home' | 'car' | 'personal';
}

interface LoanResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  loanToValue: number;
  paymentSchedule: PaymentScheduleItem[];
}

interface PaymentScheduleItem {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

const loanTypes = {
  home: {
    icon: Home,
    label: 'Financiamento Imobiliário',
    color: 'blue',
    maxTerm: 420, // 35 anos
    typicalRate: 9.5
  },
  car: {
    icon: Car,
    label: 'Financiamento Veicular',
    color: 'green',
    maxTerm: 60, // 5 anos
    typicalRate: 12.5
  },
  personal: {
    icon: CreditCard,
    label: 'Crédito Pessoal',
    color: 'purple',
    maxTerm: 60, // 5 anos
    typicalRate: 18.0
  }
};

export function LoanCalculator() {
  const [data, setData] = useState<LoanData>({
    loanAmount: 300000,
    interestRate: 9.5,
    loanTerm: 360, // 30 anos
    downPayment: 60000,
    loanType: 'home'
  });

  const [result, setResult] = useState<LoanResult | null>(null);
  const [showSchedule, setShowSchedule] = useState(false);

  const calculateLoan = () => {
    const principal = data.loanAmount - data.downPayment;
    const monthlyRate = data.interestRate / 100 / 12;
    const numPayments = data.loanTerm;

    // Cálculo da prestação usando fórmula de amortização
    const monthlyPayment = principal * 
      (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
      (Math.pow(1 + monthlyRate, numPayments) - 1);

    const totalPayment = monthlyPayment * numPayments + data.downPayment;
    const totalInterest = totalPayment - data.loanAmount;
    const loanToValue = ((data.loanAmount - data.downPayment) / data.loanAmount) * 100;

    // Gerar cronograma de pagamentos (primeiros 12 meses)
    const paymentSchedule: PaymentScheduleItem[] = [];
    let remainingBalance = principal;

    for (let month = 1; month <= Math.min(12, numPayments); month++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      remainingBalance -= principalPayment;

      paymentSchedule.push({
        month,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: remainingBalance
      });
    }

    setResult({
      monthlyPayment,
      totalPayment,
      totalInterest,
      loanToValue,
      paymentSchedule
    });
  };

  useEffect(() => {
    if (data.loanAmount > data.downPayment) {
      calculateLoan();
    }
  }, [data]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleInputChange = (field: keyof LoanData, value: number | string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleLoanTypeChange = (type: 'home' | 'car' | 'personal') => {
    const typeConfig = loanTypes[type];
    setData(prev => ({
      ...prev,
      loanType: type,
      interestRate: typeConfig.typicalRate,
      loanTerm: type === 'home' ? 360 : 48,
      loanAmount: type === 'home' ? 300000 : type === 'car' ? 50000 : 20000,
      downPayment: type === 'home' ? 60000 : type === 'car' ? 10000 : 0
    }));
  };

  const currentLoanType = loanTypes[data.loanType];

  return (
    <div className="space-y-6">
      {/* Loan Type Selection */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Tipo de Financiamento</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(loanTypes).map(([key, type]) => {
            const IconComponent = type.icon;
            const isSelected = data.loanType === key;
            
            return (
              <button
                key={key}
                onClick={() => handleLoanTypeChange(key as 'home' | 'car' | 'personal')}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  isSelected
                    ? `border-${type.color}-500 bg-${type.color}-50 dark:bg-${type.color}-900/20`
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <IconComponent className={`w-8 h-8 mx-auto mb-2 ${
                  isSelected ? `text-${type.color}-600` : 'text-gray-400'
                }`} />
                <div className={`font-medium ${
                  isSelected ? `text-${type.color}-700 dark:text-${type.color}-300` : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {type.label}
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            Valores
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Valor do {data.loanType === 'home' ? 'Imóvel' : data.loanType === 'car' ? 'Veículo' : 'Empréstimo'} (R$)
              </label>
              <input
                type="number"
                value={data.loanAmount}
                onChange={(e) => handleInputChange('loanAmount', Number(e.target.value))}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1000"
                step="1000"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Entrada (R$)</label>
              <input
                type="number"
                value={data.downPayment}
                onChange={(e) => handleInputChange('downPayment', Number(e.target.value))}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                max={data.loanAmount * 0.9}
                step="1000"
              />
              <div className="text-xs text-gray-500 mt-1">
                {((data.downPayment / data.loanAmount) * 100).toFixed(1)}% do valor total
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Percent className="w-5 h-5 text-blue-500" />
            Condições
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Taxa de Juros (%/ano)</label>
              <input
                type="number"
                value={data.interestRate}
                onChange={(e) => handleInputChange('interestRate', Number(e.target.value))}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0.1"
                max="50"
                step="0.1"
              />
              <div className="text-xs text-gray-500 mt-1">
                Taxa típica para {currentLoanType.label.toLowerCase()}: {currentLoanType.typicalRate}%
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Prazo (meses)</label>
              <input
                type="number"
                value={data.loanTerm}
                onChange={(e) => handleInputChange('loanTerm', Number(e.target.value))}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                max={currentLoanType.maxTerm}
                step="1"
              />
              <div className="text-xs text-gray-500 mt-1">
                {(data.loanTerm / 12).toFixed(1)} anos
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Results */}
      {result && data.loanAmount > data.downPayment && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Calculator className="w-6 h-6 text-blue-500" />
                Resultado do Financiamento
              </h3>
              <Button
                variant="outline"
                onClick={() => setShowSchedule(!showSchedule)}
                className="flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                {showSchedule ? 'Ocultar' : 'Ver'} Cronograma
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                <DollarSign className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <div className="text-xl font-bold text-blue-700 dark:text-blue-400">
                  {formatCurrency(result.monthlyPayment)}
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-300">
                  Prestação Mensal
                </div>
              </div>

              <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                <TrendingDown className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <div className="text-xl font-bold text-green-700 dark:text-green-400">
                  {formatCurrency(data.loanAmount - data.downPayment)}
                </div>
                <div className="text-sm text-green-600 dark:text-green-300">
                  Valor Financiado
                </div>
              </div>

              <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                <Percent className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <div className="text-xl font-bold text-purple-700 dark:text-purple-400">
                  {formatCurrency(result.totalInterest)}
                </div>
                <div className="text-sm text-purple-600 dark:text-purple-300">
                  Total de Juros
                </div>
              </div>

              <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg">
                <Calculator className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                <div className="text-xl font-bold text-orange-700 dark:text-orange-400">
                  {formatCurrency(result.totalPayment)}
                </div>
                <div className="text-sm text-orange-600 dark:text-orange-300">
                  Total a Pagar
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm border-t pt-4">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Relação Financiamento/Valor:</span>
                <span className="float-right font-medium">{result.loanToValue.toFixed(1)}%</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Custo Efetivo Total:</span>
                <span className="float-right font-medium">
                  {((result.totalInterest / (data.loanAmount - data.downPayment)) * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Payment Schedule */}
            {showSchedule && result.paymentSchedule.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t pt-6 mt-6"
              >
                <h4 className="font-semibold mb-4">Cronograma de Pagamentos (Primeiros 12 meses)</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Mês</th>
                        <th className="text-right p-2">Prestação</th>
                        <th className="text-right p-2">Juros</th>
                        <th className="text-right p-2">Amortização</th>
                        <th className="text-right p-2">Saldo Devedor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.paymentSchedule.map((payment) => (
                        <tr key={payment.month} className="border-b">
                          <td className="p-2">{payment.month}</td>
                          <td className="text-right p-2">{formatCurrency(payment.payment)}</td>
                          <td className="text-right p-2 text-red-600">{formatCurrency(payment.interest)}</td>
                          <td className="text-right p-2 text-green-600">{formatCurrency(payment.principal)}</td>
                          <td className="text-right p-2">{formatCurrency(payment.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </Card>
        </motion.div>
      )}

      {/* Tips */}
      <Card className="p-4 bg-blue-50 dark:bg-blue-900/20">
        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">💡 Dicas Importantes</h4>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Quanto maior a entrada, menor será o valor financiado e os juros pagos</li>
          <li>• Compare taxas de diferentes instituições antes de decidir</li>
          <li>• Considere o Custo Efetivo Total (CET) na sua decisão</li>
          <li>• Certifique-se de que a prestação não comprometa mais de 30% da sua renda</li>
        </ul>
      </Card>
    </div>
  );
}