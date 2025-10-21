import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, DollarSign, Calendar, Plus, Trash2, Target, Info } from 'lucide-react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

interface Investment {
  id: string;
  name: string;
  initialAmount: number;
  monthlyContribution: number;
  annualReturn: number;
  riskLevel: 'low' | 'medium' | 'high';
  fees: number;
  taxRate: number;
  color: string;
}

interface InvestmentResult {
  investment: Investment;
  finalAmount: number;
  totalContributions: number;
  grossReturn: number;
  netReturn: number;
  fees: number;
  taxes: number;
  realReturn: number;
  yearlyData: YearlyData[];
}

interface YearlyData {
  year: number;
  amount: number;
  contributions: number;
  returns: number;
}

const predefinedInvestments = [
  {
    name: 'Poupança',
    annualReturn: 6.17,
    riskLevel: 'low' as const,
    fees: 0,
    taxRate: 0,
    color: '#10B981'
  },
  {
    name: 'CDB 100% CDI',
    annualReturn: 13.75,
    riskLevel: 'low' as const,
    fees: 0,
    taxRate: 15,
    color: '#3B82F6'
  },
  {
    name: 'Tesouro Selic',
    annualReturn: 13.75,
    riskLevel: 'low' as const,
    fees: 0.25,
    taxRate: 15,
    color: '#8B5CF6'
  },
  {
    name: 'Fundo DI',
    annualReturn: 12.5,
    riskLevel: 'low' as const,
    fees: 1.5,
    taxRate: 15,
    color: '#F59E0B'
  },
  {
    name: 'Fundo Multimercado',
    annualReturn: 15.0,
    riskLevel: 'medium' as const,
    fees: 2.0,
    taxRate: 15,
    color: '#EF4444'
  },
  {
    name: 'Fundo de Ações',
    annualReturn: 18.0,
    riskLevel: 'high' as const,
    fees: 2.5,
    taxRate: 15,
    color: '#EC4899'
  }
];

export function InvestmentComparator() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [results, setResults] = useState<InvestmentResult[]>([]);
  const [timeHorizon, setTimeHorizon] = useState(10);
  const [inflationRate, setInflationRate] = useState(4.0);
  const [showChart, setShowChart] = useState(true);
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

  useEffect(() => {
    // Inicializar com alguns investimentos padrão
    const defaultInvestments = predefinedInvestments.slice(0, 3).map((inv, index) => ({
      id: `inv-${index}`,
      name: inv.name,
      initialAmount: 10000,
      monthlyContribution: 500,
      annualReturn: inv.annualReturn,
      riskLevel: inv.riskLevel,
      fees: inv.fees,
      taxRate: inv.taxRate,
      color: inv.color
    }));
    setInvestments(defaultInvestments);
  }, []);

  useEffect(() => {
    calculateResults();
  }, [investments, timeHorizon, inflationRate]);

  const calculateResults = () => {
    const newResults = investments.map(investment => {
      const monthlyReturn = (investment.annualReturn - investment.fees) / 100 / 12;
      const months = timeHorizon * 12;
      
      let amount = investment.initialAmount;
      let totalContributions = investment.initialAmount;
      const yearlyData: YearlyData[] = [];
      
      // Calcular ano a ano
      for (let year = 1; year <= timeHorizon; year++) {
        let yearStartAmount = amount;
        let yearContributions = 0;
        
        // Calcular mês a mês para o ano
        for (let month = 1; month <= 12; month++) {
          amount += investment.monthlyContribution;
          yearContributions += investment.monthlyContribution;
          totalContributions += investment.monthlyContribution;
          amount *= (1 + monthlyReturn);
        }
        
        yearlyData.push({
          year,
          amount: amount,
          contributions: totalContributions,
          returns: amount - totalContributions
        });
      }

      const grossReturn = amount - totalContributions;
      const fees = (grossReturn * investment.fees / 100) * timeHorizon;
      const taxableReturn = Math.max(0, grossReturn - fees);
      const taxes = taxableReturn * (investment.taxRate / 100);
      const netReturn = grossReturn - fees - taxes;
      const finalAmount = totalContributions + netReturn;
      
      // Retorno real (descontando inflação)
      const realFinalAmount = finalAmount / Math.pow(1 + inflationRate / 100, timeHorizon);
      const realReturn = realFinalAmount - totalContributions;

      return {
        investment,
        finalAmount,
        totalContributions,
        grossReturn,
        netReturn,
        fees,
        taxes,
        realReturn,
        yearlyData
      };
    });

    setResults(newResults.sort((a, b) => b.finalAmount - a.finalAmount));
  };

  const addInvestment = () => {
    const newInvestment: Investment = {
      id: `inv-${Date.now()}`,
      name: 'Novo Investimento',
      initialAmount: 10000,
      monthlyContribution: 500,
      annualReturn: 10,
      riskLevel: 'medium',
      fees: 1,
      taxRate: 15,
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`
    };
    setInvestments([...investments, newInvestment]);
  };

  const removeInvestment = (id: string) => {
    setInvestments(investments.filter(inv => inv.id !== id));
  };

  const updateInvestment = (id: string, field: keyof Investment, value: any) => {
    setInvestments(investments.map(inv => 
      inv.id === id ? { ...inv, [field]: value } : inv
    ));
  };

  const addPredefinedInvestment = (predefined: typeof predefinedInvestments[0]) => {
    const newInvestment: Investment = {
      id: `inv-${Date.now()}`,
      ...predefined,
      initialAmount: 10000,
      monthlyContribution: 500
    };
    setInvestments([...investments, newInvestment]);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskLabel = (risk: string) => {
    switch (risk) {
      case 'low': return 'Baixo';
      case 'medium': return 'Médio';
      case 'high': return 'Alto';
      default: return 'N/A';
    }
  };

  // Preparar dados para o gráfico
  const chartData = Array.from({ length: timeHorizon }, (_, index) => {
    const year = index + 1;
    const data: any = { year };
    
    results.forEach(result => {
      const yearData = result.yearlyData.find(d => d.year === year);
      data[result.investment.name] = yearData?.amount || 0;
    });
    
    return data;
  });

  return (
    <div className="space-y-6">
      {/* Configuration */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-500" />
          Configurações da Comparação
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Horizonte de Tempo (anos)</label>
            <input
              type="number"
              value={timeHorizon}
              onChange={(e) => setTimeHorizon(Number(e.target.value))}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
              max="50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Taxa de Inflação (%/ano)</label>
            <input
              type="number"
              value={inflationRate}
              onChange={(e) => setInflationRate(Number(e.target.value))}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
              max="20"
              step="0.1"
            />
          </div>
        </div>
      </Card>

      {/* Add Investment Options */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Investimentos para Comparar</h3>
          <Button onClick={addInvestment} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Adicionar Personalizado
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-6">
          {predefinedInvestments.map((inv, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => addPredefinedInvestment(inv)}
              className="text-xs"
            >
              {inv.name}
            </Button>
          ))}
        </div>

        {/* Investment List */}
        <div className="space-y-4">
          {investments.map((investment) => (
            <Card key={investment.id} className="p-4 border-l-4" style={{ borderLeftColor: investment.color }}>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                <div>
                  <label className="block text-xs font-medium mb-1">Nome</label>
                  <input
                    type="text"
                    value={investment.name}
                    onChange={(e) => updateInvestment(investment.id, 'name', e.target.value)}
                    className="w-full p-2 text-sm border rounded focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium mb-1">Valor Inicial (R$)</label>
                  <input
                    type="number"
                    value={investment.initialAmount}
                    onChange={(e) => updateInvestment(investment.id, 'initialAmount', Number(e.target.value))}
                    className="w-full p-2 text-sm border rounded focus:ring-1 focus:ring-blue-500"
                    min="0"
                    step="1000"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium mb-1">Aporte Mensal (R$)</label>
                  <input
                    type="number"
                    value={investment.monthlyContribution}
                    onChange={(e) => updateInvestment(investment.id, 'monthlyContribution', Number(e.target.value))}
                    className="w-full p-2 text-sm border rounded focus:ring-1 focus:ring-blue-500"
                    min="0"
                    step="100"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium mb-1">Retorno (%/ano)</label>
                  <input
                    type="number"
                    value={investment.annualReturn}
                    onChange={(e) => updateInvestment(investment.id, 'annualReturn', Number(e.target.value))}
                    className="w-full p-2 text-sm border rounded focus:ring-1 focus:ring-blue-500"
                    min="0"
                    max="50"
                    step="0.1"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium mb-1">Taxa/IR (%)</label>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      value={investment.fees}
                      onChange={(e) => updateInvestment(investment.id, 'fees', Number(e.target.value))}
                      className="w-1/2 p-2 text-sm border rounded focus:ring-1 focus:ring-blue-500"
                      min="0"
                      max="10"
                      step="0.1"
                      placeholder="Taxa"
                    />
                    <input
                      type="number"
                      value={investment.taxRate}
                      onChange={(e) => updateInvestment(investment.id, 'taxRate', Number(e.target.value))}
                      className="w-1/2 p-2 text-sm border rounded focus:ring-1 focus:ring-blue-500"
                      min="0"
                      max="30"
                      step="1"
                      placeholder="IR"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <select
                    value={investment.riskLevel}
                    onChange={(e) => updateInvestment(investment.id, 'riskLevel', e.target.value)}
                    className="flex-1 p-2 text-sm border rounded focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="low">Baixo</option>
                    <option value="medium">Médio</option>
                    <option value="high">Alto</option>
                  </select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeInvestment(investment.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-purple-500" />
                Comparação de Resultados ({timeHorizon} anos)
              </h3>
              <div className="flex gap-2">
                <Button
                  variant={showChart ? "default" : "outline"}
                  onClick={() => setShowChart(!showChart)}
                  size="sm"
                >
                  {showChart ? 'Ocultar' : 'Mostrar'} Gráfico
                </Button>
                {showChart && (
                  <Button
                    variant="outline"
                    onClick={() => setChartType(chartType === 'bar' ? 'line' : 'bar')}
                    size="sm"
                  >
                    {chartType === 'bar' ? 'Linha' : 'Barras'}
                  </Button>
                )}
              </div>
            </div>

            {/* Chart */}
            {showChart && (
              <div className="mb-8 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'bar' ? (
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Legend />
                      {results.map((result) => (
                        <Bar
                          key={result.investment.id}
                          dataKey={result.investment.name}
                          fill={result.investment.color}
                        />
                      ))}
                    </BarChart>
                  ) : (
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Legend />
                      {results.map((result) => (
                        <Line
                          key={result.investment.id}
                          type="monotone"
                          dataKey={result.investment.name}
                          stroke={result.investment.color}
                          strokeWidth={2}
                        />
                      ))}
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
            )}

            {/* Results Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Investimento</th>
                    <th className="text-right p-3">Valor Final</th>
                    <th className="text-right p-3">Total Investido</th>
                    <th className="text-right p-3">Retorno Líquido</th>
                    <th className="text-right p-3">Retorno Real*</th>
                    <th className="text-center p-3">Risco</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={result.investment.id} className={`border-b ${index === 0 ? 'bg-green-50 dark:bg-green-900/20' : ''}`}>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: result.investment.color }}
                          />
                          <span className="font-medium">{result.investment.name}</span>
                          {index === 0 && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Melhor</span>}
                        </div>
                      </td>
                      <td className="text-right p-3 font-bold">
                        {formatCurrency(result.finalAmount)}
                      </td>
                      <td className="text-right p-3">
                        {formatCurrency(result.totalContributions)}
                      </td>
                      <td className="text-right p-3 text-green-600">
                        {formatCurrency(result.netReturn)}
                      </td>
                      <td className="text-right p-3">
                        <span className={result.realReturn > 0 ? 'text-green-600' : 'text-red-600'}>
                          {formatCurrency(result.realReturn)}
                        </span>
                      </td>
                      <td className="text-center p-3">
                        <span className={getRiskColor(result.investment.riskLevel)}>
                          {getRiskLabel(result.investment.riskLevel)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Additional Info */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  <p className="font-medium mb-2">Informações Importantes:</p>
                  <ul className="space-y-1">
                    <li>• *Retorno Real: descontada a inflação de {inflationRate}% ao ano</li>
                    <li>• Os cálculos consideram aportes mensais constantes</li>
                    <li>• Taxas de administração e IR são aplicados sobre os rendimentos</li>
                    <li>• Resultados são projeções e podem variar conforme o mercado</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}