import React, { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, BarChart3, PieChart, Download, Activity, Brain } from 'lucide-react';
import { ResultadoSimulacao as ResultadoType, SimulacaoInput } from '../types';
import { CardsResumo } from './CardsResumo';
import { TabelaDetalhada } from './TabelaDetalhada';
import { AnimatedContainer } from './AnimatedContainer';
import { AnimatedButton } from './AnimatedButton';
import { StaggeredContainer } from './AnimatedContainer';
import { PeriodoSwitch, PeriodoVisualizacao } from './PeriodoSwitch';
import { PeriodoConversor } from '../utils/periodoConversao';

interface ResultadoSimulacaoProps {
  resultado: ResultadoType;
  simulacao?: SimulacaoInput;
  periodoVisualizacao?: PeriodoVisualizacao;
  onPeriodoChange?: (periodo: PeriodoVisualizacao) => void;
  onMostrarInflacao?: () => void;
  onMostrarCenarios?: () => void;
  onMostrarAnaliseAvancada?: () => void;
  onMostrarDashboard?: () => void;
  onMostrarExportacao?: () => void;
  onMostrarPerformance?: () => void;
}

const ResultadoSimulacao = memo(function ResultadoSimulacao({ 
  resultado, 
  simulacao, 
  periodoVisualizacao: periodoVisualizacaoExterno,
  onPeriodoChange,
  onMostrarInflacao,
  onMostrarCenarios,
  onMostrarAnaliseAvancada,
  onMostrarDashboard,
  onMostrarExportacao,
  onMostrarPerformance 
}: ResultadoSimulacaoProps) {
  
  // Usar estado externo se disponível, senão usar estado interno
  const [periodoVisualizacaoInterno, setPeriodoVisualizacaoInterno] = useState<PeriodoVisualizacao>('anual');
  const periodoVisualizacao = periodoVisualizacaoExterno ?? periodoVisualizacaoInterno;
  
  const handlePeriodoChange = (novoPeriodo: PeriodoVisualizacao) => {
    if (onPeriodoChange) {
      onPeriodoChange(novoPeriodo);
    } else {
      setPeriodoVisualizacaoInterno(novoPeriodo);
    }
  };
  
  // Converte o resultado baseado no período selecionado
  const resultadoConvertido = PeriodoConversor.converterResultadoSimulacao(resultado, periodoVisualizacao);
  const evolucaoConvertida = PeriodoConversor.converterEvolucaoMensal(resultado.evolucaoMensal, periodoVisualizacao);
  
  return (
    <AnimatedContainer
      variant="slideUp"
      delay={0.2}
      className="space-y-6"
    >
      <StaggeredContainer>
        {/* Switch de Período */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex justify-center mb-6"
        >
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Visualizar por:
              </span>
              <PeriodoSwitch
                valor={periodoVisualizacao}
                onChange={handlePeriodoChange}
                size="md"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <CardsResumo resultado={resultadoConvertido} periodoVisualizacao={periodoVisualizacao} />
        </motion.div>
        
        {/* Botões de Análises Avançadas */}
        {(onMostrarInflacao || onMostrarCenarios || onMostrarAnaliseAvancada || onMostrarDashboard || onMostrarExportacao || onMostrarPerformance) && simulacao && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-center gap-4 flex-wrap">
              {onMostrarInflacao && (
                <AnimatedButton
                  onClick={onMostrarInflacao}
                  variant="secondary"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                >
                  <TrendingDown className="w-5 h-5" />
                  Simular com Inflação
                </AnimatedButton>
              )}
              
              {onMostrarCenarios && (
                <AnimatedButton
                  onClick={onMostrarCenarios}
                  variant="secondary"
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
                >
                  <BarChart3 className="w-5 h-5" />
                  Análise de Cenários
                </AnimatedButton>
              )}

              {onMostrarAnaliseAvancada && (
                <AnimatedButton
                  onClick={onMostrarAnaliseAvancada}
                  variant="secondary"
                  className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white"
                >
                  <Brain className="w-5 h-5" />
                  Análise Avançada
                </AnimatedButton>
              )}
              
              {onMostrarDashboard && (
                <AnimatedButton
                  onClick={onMostrarDashboard}
                  variant="secondary"
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                >
                  <PieChart className="w-5 h-5" />
                  Dashboard Avançado
                </AnimatedButton>
              )}

              {onMostrarPerformance && (
                <AnimatedButton
                  onClick={onMostrarPerformance}
                  variant="secondary"
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                >
                  <Activity className="w-5 h-5" />
                  Performance
                </AnimatedButton>
              )}
              
              {onMostrarExportacao && (
                <AnimatedButton
                  onClick={onMostrarExportacao}
                  variant="secondary"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                >
                  <Download className="w-5 h-5" />
                  Exportar Relatório
                </AnimatedButton>
              )}
             </div>
           </motion.div>
         )}
         
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.3 }}
         >
           <TabelaDetalhada 
             dados={evolucaoConvertida} 
             periodoVisualizacao={periodoVisualizacao}
           />
         </motion.div>
       </StaggeredContainer>
     </AnimatedContainer>
   );
});

export { ResultadoSimulacao };