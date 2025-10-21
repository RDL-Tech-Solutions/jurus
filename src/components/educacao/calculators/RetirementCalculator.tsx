import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, DollarSign, Calendar, Target, Info } from 'lucide-react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';

interface RetirementData {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  monthlyContribution: number;
  expectedReturn: number;
  inflationRate: number;
  desiredMonthlyIncome: number;
}

interface RetirementResult {
  totalSavings: number;
  monthlyIncomeGenerated: number;
  shortfall: number;
  yearsToRetirement: number;
  totalContributions: number;
  investmentGains: number;
  recommendedMonthlyContribution: number;
}

export function RetirementCalculator() {
  const [data, setData] = useState<RetirementData>({
    currentAge: 30,
    retirementAge: 65,
    currentSavings: 50000,
    monthlyContribution: 1000,
    expectedReturn: 8,
    inflationRate: 4,
    desiredMonthlyIncome: 5000
  });

  const [result, setResult] = useState<RetirementResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const calculateRetirement = () => {
    const yearsToRetirement = data.retirementAge - data.currentAge;
    const monthsToRetirement = yearsToRetirement * 12;
    const monthlyReturn = data.expectedReturn / 100 / 12;
    const monthlyInflation = data.inflationRate / 100 / 12;

    // Valor futuro das economias atuais
    const futureValueCurrentSavings = data.currentSavings * Math.pow(1 + monthlyReturn, monthsToRetirement);

    // Valor futuro das contribuições mensais
    const futureValueContributions = data.monthlyContribution * 
      ((Math.pow(1 + monthlyReturn, monthsToRetirement) - 1) / monthlyReturn);

    const totalSavings = futureValueCurrentSavings + futureValueContributions;
    const totalContributions = data.currentSavings + (data.monthlyContribution * monthsToRetirement);
    const investmentGains = totalSavings - totalContributions;

    // Renda mensal que pode ser gerada (usando regra dos 4%)
    const monthlyIncomeGenerated = (totalSavings * 0.04) / 12;

    // Ajustar renda desejada pela inflação
    const adjustedDesiredIncome = data.desiredMonthlyIncome * 
      Math.pow(1 + data.inflationRate / 100, yearsToRetirement);

    const shortfall = adjustedDesiredIncome - monthlyIncomeGenerated;

    // Calcular contribuição recomendada se houver déficit
    let recommendedMonthlyContribution = data.monthlyContribution;
    if (shortfall > 0) {
      const requiredTotal = adjustedDesiredIncome * 12 / 0.04;
      const requiredFromContributions = requiredTotal - futureValueCurrentSavings;
      recommendedMonthlyContribution = requiredFromContributions / 
        ((Math.pow(1 + monthlyReturn, monthsToRetirement) - 1) / monthlyReturn);
    }

    setResult({
      totalSavings,
      monthlyIncomeGenerated,
      shortfall,
      yearsToRetirement,
      totalContributions,
      investmentGains,
      recommendedMonthlyContribution
    });
  };

  useEffect(() => {
    calculateRetirement();
  }, [data]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleInputChange = (field: keyof RetirementData, value: number) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            Dados Pessoais
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Idade Atual</label>
              <input
                type="number"
                value={data.currentAge}
                onChange={(e) => handleInputChange('currentAge', Number(e.target.value))}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="18"
                max="80"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Idade de Aposentadoria</label>
              <input
                type="number"
                value={data.retirementAge}
                onChange={(e) => handleInputChange('retirementAge', Number(e.target.value))}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min={data.currentAge + 1}
                max="85"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Renda Mensal Desejada</label>
              <input
                type="number"
                value={data.desiredMonthlyIncome}
                onChange={(e) => handleInputChange('desiredMonthlyIncome', Number(e.target.value))}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1000"
                step="500"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            Dados Financeiros
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Economias Atuais (R$)</label>
              <input
                type="number"
                value={data.currentSavings}
                onChange={(e) => handleInputChange('currentSavings', Number(e.target.value))}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="1000"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Contribuição Mensal (R$)</label>
              <input
                type="number"
                value={data.monthlyContribution}
                onChange={(e) => handleInputChange('monthlyContribution', Number(e.target.value))}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Retorno Esperado (%/ano)</label>
              <input
                type="number"
                value={data.expectedReturn}
                onChange={(e) => handleInputChange('expectedReturn', Number(e.target.value))}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                max="20"
                step="0.5"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Taxa de Inflação (%/ano)</label>
              <input
                type="number"
                value={data.inflationRate}
                onChange={(e) => handleInputChange('inflationRate', Number(e.target.value))}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                max="15"
                step="0.5"
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Target className="w-6 h-6 text-purple-500" />
                Projeção de Aposentadoria
              </h3>
              <Button
                variant="outline"
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-2"
              >
                <Info className="w-4 h-4" />
                {showDetails ? 'Ocultar' : 'Ver'} Detalhes
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                  {formatCurrency(result.totalSavings)}
                </div>
                <div className="text-sm text-green-600 dark:text-green-300">
                  Total Acumulado
                </div>
              </div>

              <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                <DollarSign className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                  {formatCurrency(result.monthlyIncomeGenerated)}
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-300">
                  Renda Mensal Gerada
                </div>
              </div>

              <div className={`text-center p-4 rounded-lg ${
                result.shortfall > 0 
                  ? 'bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20'
                  : 'bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20'
              }`}>
                <Target className={`w-8 h-8 mx-auto mb-2 ${
                  result.shortfall > 0 ? 'text-red-600' : 'text-green-600'
                }`} />
                <div className={`text-2xl font-bold ${
                  result.shortfall > 0 
                    ? 'text-red-700 dark:text-red-400' 
                    : 'text-green-700 dark:text-green-400'
                }`}>
                  {result.shortfall > 0 ? '-' : '+'}{formatCurrency(Math.abs(result.shortfall))}
                </div>
                <div className={`text-sm ${
                  result.shortfall > 0 
                    ? 'text-red-600 dark:text-red-300' 
                    : 'text-green-600 dark:text-green-300'
                }`}>
                  {result.shortfall > 0 ? 'Déficit' : 'Superávit'}
                </div>
              </div>
            </div>

            {result.shortfall > 0 && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                  💡 Recomendação
                </h4>
                <p className="text-yellow-700 dark:text-yellow-300">
                  Para atingir sua meta, você deveria contribuir{' '}
                  <strong>{formatCurrency(result.recommendedMonthlyContribution)}</strong> por mês.
                  Isso representa um aumento de{' '}
                  <strong>{formatCurrency(result.recommendedMonthlyContribution - data.monthlyContribution)}</strong> na sua contribuição atual.
                </p>
              </div>
            )}

            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t pt-6"
              >
                <h4 className="font-semibold mb-4">Detalhes da Projeção</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Anos até aposentadoria:</span>
                    <span className="float-right font-medium">{result.yearsToRetirement} anos</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Total de contribuições:</span>
                    <span className="float-right font-medium">{formatCurrency(result.totalContributions)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Ganhos com investimentos:</span>
                    <span className="float-right font-medium text-green-600">{formatCurrency(result.investmentGains)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Retorno sobre investimento:</span>
                    <span className="float-right font-medium">
                      {((result.investmentGains / result.totalContributions) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </Card>
        </motion.div>
      )}

      {/* Disclaimer */}
      <Card className="p-4 bg-gray-50 dark:bg-gray-800/50">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          <strong>Aviso:</strong> Esta calculadora fornece estimativas baseadas nos dados inseridos e não constitui aconselhamento financeiro. 
          Os resultados são projeções e podem variar conforme as condições de mercado. Consulte um consultor financeiro para orientação personalizada.
        </p>
      </Card>
    </div>
  );
}