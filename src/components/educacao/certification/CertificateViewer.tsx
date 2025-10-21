import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Star,
  Trophy,
  Clock,
  BookOpen,
  Target,
  TrendingUp
} from 'lucide-react';

interface Certificate {
  id: string;
  studentName: string;
  courseName: string;
  completionDate: Date;
  issueDate: Date;
  certificateNumber: string;
  grade?: string;
  duration: string;
  instructor: string;
  skills: string[];
  validUntil?: Date;
  status: 'valid' | 'expired' | 'revoked';
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}

interface CertificateViewerProps {
  certificates: Certificate[];
  onViewCertificate?: (certificate: Certificate) => void;
  onDownloadCertificate?: (certificate: Certificate) => void;
  onVerifyCertificate?: (certificateNumber: string) => Promise<boolean>;
}

export const CertificateViewer: React.FC<CertificateViewerProps> = ({
  certificates,
  onViewCertificate,
  onDownloadCertificate,
  onVerifyCertificate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'course'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [verificationResults, setVerificationResults] = useState<Record<string, boolean>>({});

  const categories = Array.from(new Set(certificates.map(cert => cert.category)));
  const levels = ['beginner', 'intermediate', 'advanced'];
  const statuses = ['valid', 'expired', 'revoked'];

  const filteredCertificates = certificates
    .filter(cert => {
      const matchesSearch = cert.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           cert.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           cert.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || cert.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || cert.status === selectedStatus;
      const matchesLevel = selectedLevel === 'all' || cert.level === selectedLevel;
      
      return matchesSearch && matchesCategory && matchesStatus && matchesLevel;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = a.completionDate.getTime() - b.completionDate.getTime();
          break;
        case 'name':
          comparison = a.studentName.localeCompare(b.studentName);
          break;
        case 'course':
          comparison = a.courseName.localeCompare(b.courseName);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleVerifyCertificate = async (certificateNumber: string) => {
    if (onVerifyCertificate) {
      const isValid = await onVerifyCertificate(certificateNumber);
      setVerificationResults(prev => ({
        ...prev,
        [certificateNumber]: isValid
      }));
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'expired':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'revoked':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'beginner':
        return <BookOpen className="w-4 h-4 text-green-600" />;
      case 'intermediate':
        return <Target className="w-4 h-4 text-yellow-600" />;
      case 'advanced':
        return <TrendingUp className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-yellow-100 text-yellow-800';
      case 'revoked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center">
          <Award className="w-8 h-8 mr-3 text-blue-600" />
          Certificados
        </h1>
        <p className="text-gray-600">
          Visualize e gerencie seus certificados de conclusão
        </p>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg p-6 shadow-lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar certificados..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas as Categorias</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos os Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'valid' ? 'Válido' : status === 'expired' ? 'Expirado' : 'Revogado'}
                </option>
              ))}
            </select>
          </div>

          {/* Level Filter */}
          <div>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos os Níveis</option>
              {levels.map(level => (
                <option key={level} value={level}>
                  {level === 'beginner' ? 'Iniciante' : level === 'intermediate' ? 'Intermediário' : 'Avançado'}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field as 'date' | 'name' | 'course');
                setSortOrder(order as 'asc' | 'desc');
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date-desc">Data (Mais Recente)</option>
              <option value="date-asc">Data (Mais Antigo)</option>
              <option value="name-asc">Nome (A-Z)</option>
              <option value="name-desc">Nome (Z-A)</option>
              <option value="course-asc">Curso (A-Z)</option>
              <option value="course-desc">Curso (Z-A)</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="bg-white rounded-lg p-4 shadow-lg">
          <div className="flex items-center">
            <Trophy className="w-8 h-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-800">{certificates.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-lg">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Válidos</p>
              <p className="text-2xl font-bold text-gray-800">
                {certificates.filter(c => c.status === 'valid').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-lg">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Expirados</p>
              <p className="text-2xl font-bold text-gray-800">
                {certificates.filter(c => c.status === 'expired').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-lg">
          <div className="flex items-center">
            <Star className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Com Nota</p>
              <p className="text-2xl font-bold text-gray-800">
                {certificates.filter(c => c.grade).length}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Certificates Grid */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredCertificates.map((certificate, index) => (
            <motion.div
              key={certificate.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Certificate Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <Award className="w-6 h-6" />
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(certificate.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(certificate.status)}`}>
                      {certificate.status === 'valid' ? 'Válido' : 
                       certificate.status === 'expired' ? 'Expirado' : 'Revogado'}
                    </span>
                  </div>
                </div>
                <h3 className="font-semibold text-lg truncate">{certificate.courseName}</h3>
                <p className="text-blue-100 text-sm">{certificate.studentName}</p>
              </div>

              {/* Certificate Content */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Nível:</span>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(certificate.level)}`}>
                    {getLevelIcon(certificate.level)}
                    <span>
                      {certificate.level === 'beginner' ? 'Iniciante' : 
                       certificate.level === 'intermediate' ? 'Intermediário' : 'Avançado'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Conclusão:</span>
                  <span className="text-sm font-medium">{formatDate(certificate.completionDate)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Duração:</span>
                  <span className="text-sm font-medium">{certificate.duration}</span>
                </div>

                {certificate.grade && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Nota:</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium">{certificate.grade}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Instrutor:</span>
                  <span className="text-sm font-medium truncate">{certificate.instructor}</span>
                </div>

                <div>
                  <span className="text-sm text-gray-600 block mb-1">Competências:</span>
                  <div className="flex flex-wrap gap-1">
                    {certificate.skills.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                    {certificate.skills.length > 3 && (
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                        +{certificate.skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Certificate Number */}
                <div className="border-t pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Nº {certificate.certificateNumber}</span>
                    {verificationResults[certificate.certificateNumber] !== undefined && (
                      <div className="flex items-center space-x-1">
                        {verificationResults[certificate.certificateNumber] ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                        <span className="text-xs">
                          {verificationResults[certificate.certificateNumber] ? 'Verificado' : 'Inválido'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t bg-gray-50 p-4 flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onViewCertificate?.(certificate)}
                  className="flex-1 flex items-center justify-center space-x-1 bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>Ver</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onDownloadCertificate?.(certificate)}
                  className="flex-1 flex items-center justify-center space-x-1 bg-green-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Baixar</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleVerifyCertificate(certificate.certificateNumber)}
                  className="flex items-center justify-center bg-gray-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-gray-700 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Empty State */}
      {filteredCertificates.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            Nenhum certificado encontrado
          </h3>
          <p className="text-gray-500">
            Tente ajustar os filtros ou complete um curso para obter seu primeiro certificado.
          </p>
        </motion.div>
      )}
    </div>
  );
};