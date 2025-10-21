import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Award, 
  Download, 
  Share2, 
  Calendar, 
  User, 
  CheckCircle,
  Star,
  Trophy,
  Printer,
  Mail
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
}

interface CertificateGeneratorProps {
  certificate: Certificate;
  onDownload?: (certificate: Certificate) => void;
  onShare?: (certificate: Certificate) => void;
  onPrint?: (certificate: Certificate) => void;
  onEmail?: (certificate: Certificate) => void;
}

export const CertificateGenerator: React.FC<CertificateGeneratorProps> = ({
  certificate,
  onDownload,
  onShare,
  onPrint,
  onEmail
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      // Simulate certificate generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      onDownload?.(certificate);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = () => {
    onShare?.(certificate);
  };

  const handlePrint = () => {
    onPrint?.(certificate);
  };

  const handleEmail = () => {
    onEmail?.(certificate);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Certificate Preview */}
      <motion.div
        ref={certificateRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-50 to-indigo-100 border-8 border-blue-600 rounded-lg p-8 shadow-2xl"
        style={{ aspectRatio: '1.414/1' }} // A4 ratio
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-4 rounded-full">
              <Award className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-blue-800 mb-2">
            CERTIFICADO DE CONCLUSÃO
          </h1>
          <div className="w-32 h-1 bg-blue-600 mx-auto"></div>
        </div>

        {/* Content */}
        <div className="text-center space-y-6">
          <p className="text-lg text-gray-700">
            Certificamos que
          </p>
          
          <h2 className="text-3xl font-bold text-gray-800 border-b-2 border-blue-300 pb-2 inline-block">
            {certificate.studentName}
          </h2>
          
          <p className="text-lg text-gray-700">
            concluiu com sucesso o curso
          </p>
          
          <h3 className="text-2xl font-semibold text-blue-700">
            {certificate.courseName}
          </h3>
          
          {certificate.grade && (
            <div className="flex justify-center items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-lg font-medium text-gray-700">
                Nota: {certificate.grade}
              </span>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-8 mt-8">
            <div>
              <p className="text-sm text-gray-600 mb-1">Data de Conclusão</p>
              <p className="font-semibold text-gray-800">
                {formatDate(certificate.completionDate)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Duração do Curso</p>
              <p className="font-semibold text-gray-800">
                {certificate.duration}
              </p>
            </div>
          </div>
          
          {certificate.skills.length > 0 && (
            <div className="mt-6">
              <p className="text-sm text-gray-600 mb-2">Competências Desenvolvidas</p>
              <div className="flex flex-wrap justify-center gap-2">
                {certificate.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 flex justify-between items-end">
          <div className="text-left">
            <div className="border-t-2 border-gray-400 pt-2 w-48">
              <p className="text-sm font-medium text-gray-700">
                {certificate.instructor}
              </p>
              <p className="text-xs text-gray-600">Instrutor</p>
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">
                Certificado Verificado
              </span>
            </div>
            <p className="text-xs text-gray-600">
              Nº {certificate.certificateNumber}
            </p>
            <p className="text-xs text-gray-600">
              Emitido em {formatDate(certificate.issueDate)}
            </p>
            {certificate.validUntil && (
              <p className="text-xs text-gray-600">
                Válido até {formatDate(certificate.validUntil)}
              </p>
            )}
          </div>
          
          <div className="text-right">
            <div className="border-t-2 border-gray-400 pt-2 w-48">
              <p className="text-sm font-medium text-gray-700">
                Sistema Jurus
              </p>
              <p className="text-xs text-gray-600">Plataforma de Educação</p>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 left-4 opacity-10">
          <Trophy className="w-16 h-16 text-blue-600" />
        </div>
        <div className="absolute top-4 right-4 opacity-10">
          <Trophy className="w-16 h-16 text-blue-600" />
        </div>
        <div className="absolute bottom-4 left-4 opacity-10">
          <Star className="w-12 h-12 text-blue-600" />
        </div>
        <div className="absolute bottom-4 right-4 opacity-10">
          <Star className="w-12 h-12 text-blue-600" />
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap justify-center gap-4"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownload}
          disabled={isGenerating}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-5 h-5" />
          <span>{isGenerating ? 'Gerando...' : 'Baixar PDF'}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShare}
          className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          <Share2 className="w-5 h-5" />
          <span>Compartilhar</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrint}
          className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
        >
          <Printer className="w-5 h-5" />
          <span>Imprimir</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleEmail}
          className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
        >
          <Mail className="w-5 h-5" />
          <span>Enviar por Email</span>
        </motion.button>
      </motion.div>

      {/* Certificate Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg p-6 shadow-lg"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Award className="w-5 h-5 mr-2 text-blue-600" />
          Informações do Certificado
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">Número:</span>
            <span className="ml-2 text-gray-800">{certificate.certificateNumber}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Data de Emissão:</span>
            <span className="ml-2 text-gray-800">{formatDate(certificate.issueDate)}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Instrutor:</span>
            <span className="ml-2 text-gray-800">{certificate.instructor}</span>
          </div>
          {certificate.validUntil && (
            <div>
              <span className="font-medium text-gray-600">Válido até:</span>
              <span className="ml-2 text-gray-800">{formatDate(certificate.validUntil)}</span>
            </div>
          )}
        </div>
        
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-sm font-medium text-green-800">
              Este certificado é válido e pode ser verificado através do número de série.
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};