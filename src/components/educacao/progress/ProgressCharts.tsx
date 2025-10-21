import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar
} from 'recharts';
import { 
  TrendingUp, 
  Calendar, 
  Clock, 
  Target,
  BookOpen,
  Brain,
  Award,
  Zap
} from 'lucide-react';
import useGamification from '../../../hooks/useGamification';
import { useEducationProgress } from '../../../hooks/useEducationProgress';

interface ProgressChartsProps {
  timeRange: string;
}

interface ChartData {
  date: string;
  xp: number;
  modules: number;
  studyTime: number;
  quizScore: number;
}

const ProgressCharts: React.FC<ProgressChartsProps> = React.memo(({ timeRange }) => {
  const { userProgress } = useGamification();
  const { learningTracks } = useEducationProgress();
  const [selectedChart, setSelectedChart] = useState('xp');

  // Gerar dados mockados baseados no timeRange
  const generateChartData = (): ChartData[] => {
    const now = new Date();
    const data: ChartData[] = [];
    
    let days = 7;
    if (timeRange === 'month') days = 30;
    if (timeRange === 'quarter') days = 90;
    if (timeRange === 'year') days = 365;

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toLocaleDateString('pt-BR', { 
          day: '2-digit', 
          month: '2-digit' 
        }),
        xp: Math.floor(Math.random() * 100) + 50,
        modules: Math.floor(Math.random() * 3),
        studyTime: Math.floor(Math.random() * 120) + 30,
        quizScore: Math.floor(Math.random() * 30) + 70
      });
    }
    
    return data;
  };

  const chartData = useMemo(() => generateChartData(), [timeRange]);

  // Dados para gráfico de pizza - distribuição por categoria
  const categoryData = [
    { name: 'Básico', value: 35, color: '#3B82F6' },
    { name: 'Investimentos', value: 25, color: '#10B981' },
    { name: 'Planejamento', value: 20, color: '#F59E0B' },
    { name: 'Avançado', value: 15, color: '#8B5CF6' },
    { name: 'Outros', value: 5, color: '#EF4444' }
  ];

  // Dados para gráfico radial - progresso por trilha
  const trackProgressData = learningTracks.slice(0, 5).map((track, index) => ({
    name: track.title.substring(0, 20) + '...',
    progress: Math.floor(Math.random() * 100),
    fill: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'][index]
  }));

  const chartOptions = [
    {
      id: 'xp',
      title: 'Evolução de XP',
      icon: <Zap className="w-5 h-5" />,
      color: 'blue'
    },
    {
      id: 'modules',
      title: 'Módulos Concluídos',
      icon: <BookOpen className="w-5 h-5" />,
      color: 'green'
    },
    {
      id: 'time',
      title: 'Tempo de Estudo',
      icon: <Clock className="w-5 h-5" />,
      color: 'yellow'
    },
    {
      id: 'performance',
      title: 'Performance em Quiz',
      icon: <Brain className="w-5 h-5" />,
      color: 'purple'
    }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-white">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {selectedChart === 'time' && ' min'}
              {selectedChart === 'performance' && '%'}
              {selectedChart === 'xp' && ' XP'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (selectedChart) {
      case 'xp':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="xp"
                stroke="#3B82F6"
                strokeWidth={3}
                fill="url(#xpGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'modules':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="modules" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'time':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="studyTime"
                stroke="#F59E0B"
                strokeWidth={3}
                dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#F59E0B', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'performance':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" stroke="#6B7280" />
              <YAxis stroke="#6B7280" domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="quizScore"
                stroke="#8B5CF6"
                strokeWidth={3}
                fill="url(#performanceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Chart Selection */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {chartOptions.map((option) => (
          <motion.button
            key={option.id}
            onClick={() => setSelectedChart(option.id)}
            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              selectedChart === option.id
                ? `border-${option.color}-500 bg-${option.color}-50 dark:bg-${option.color}-900/20`
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                selectedChart === option.id
                  ? `bg-${option.color}-100 dark:bg-${option.color}-900/30 text-${option.color}-600 dark:text-${option.color}-400`
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                {option.icon}
              </div>
              <span className="font-medium text-gray-700 dark:text-gray-300 text-sm">
                {option.title}
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Main Chart */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {chartOptions.find(opt => opt.id === selectedChart)?.title}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>
              {timeRange === 'week' && 'Últimos 7 dias'}
              {timeRange === 'month' && 'Último mês'}
              {timeRange === 'quarter' && 'Último trimestre'}
              {timeRange === 'year' && 'Último ano'}
            </span>
          </div>
        </div>
        {renderChart()}
      </motion.div>

      {/* Secondary Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-blue-500" />
            Distribuição por Categoria
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any) => [`${value}%`, 'Progresso']}
                labelStyle={{ color: '#374151' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Track Progress */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-purple-500" />
            Progresso por Trilha
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="20%"
              outerRadius="90%"
              data={trackProgressData}
            >
              <RadialBar
                dataKey="progress"
                cornerRadius={10}
                fill="#8884d8"
              />
              <Tooltip 
                formatter={(value: any) => [`${value}%`, 'Concluído']}
                labelStyle={{ color: '#374151' }}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Summary Stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {[
          { label: 'Total XP Ganho', value: chartData.reduce((acc, item) => acc + item.xp, 0), color: 'blue' },
          { label: 'Módulos Concluídos', value: chartData.reduce((acc, item) => acc + item.modules, 0), color: 'green' },
          { label: 'Horas de Estudo', value: Math.floor(chartData.reduce((acc, item) => acc + item.studyTime, 0) / 60), color: 'yellow' },
          { label: 'Média em Quiz', value: Math.floor(chartData.reduce((acc, item) => acc + item.quizScore, 0) / chartData.length), color: 'purple' }
        ].map((stat, index) => (
          <div
            key={stat.label}
            className={`p-4 rounded-xl bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 dark:from-${stat.color}-900/20 dark:to-${stat.color}-800/20 border border-${stat.color}-200 dark:border-${stat.color}-700`}
          >
            <div className="text-center">
              <p className={`text-2xl font-bold text-${stat.color}-600 dark:text-${stat.color}-400`}>
                {stat.value}
                {stat.label.includes('Média') && '%'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
});

export default ProgressCharts;